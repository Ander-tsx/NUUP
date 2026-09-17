# NUUP — ProofWork

> Plataforma gamificada de freelancers con **reputación on-chain** sobre la red Stellar.  
> Conecta freelancers y reclutadores a través de eventos de competencia y contratos de trabajo 1:1, con pagos y reputación gestionados por smart contracts Soroban.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
  - [1. Backend (Node.js / Express)](#1-backend-nodejs--express)
  - [2. Frontend (Next.js)](#2-frontend-nextjs)
  - [3. Smart Contracts (Soroban / Rust)](#3-smart-contracts-soroban--rust)
- [Arquitectura](#arquitectura)
- [API Reference](#api-reference)
- [Smart Contracts](#smart-contracts)
- [Flujos principales](#flujos-principales)
- [Contribuir](#contribuir)

---

## Descripción general

NUUP es una plataforma **custodial** — el usuario se autentica con email y contraseña; la plataforma gestiona su wallet Stellar internamente. Los pagos se realizan en **MXNe** (token MXN digital sobre Stellar) y la reputación se escribe directamente en la blockchain, funcionando como fuente única de verdad.

Existen dos modos de trabajo:

| Modo | Descripción |
|---|---|
| **Eventos** | Competencia abierta: un reclutador publica un evento con premio en escrow; múltiples freelancers participan; el reclutador elige ganadores. |
| **Proyectos** | Contrato 1:1: un reclutador contrata directamente a un freelancer; el pago queda en escrow hasta la aprobación de la entrega. |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express 5, Mongoose (MongoDB Atlas) |
| Blockchain | Stellar / Soroban (smart contracts en Rust) |
| Auth | JWT + bcrypt |
| State mgmt | Zustand |
| Forms | React Hook Form + Zod |

---

## Estructura del proyecto

```
NUUP/
├── backend/                  # API REST Express + integración Soroban
│   ├── contracts/            # Wrappers JS para interactuar con contratos Soroban
│   ├── controllers/          # Lógica de negocio por módulo
│   ├── jobs/                 # Cron jobs (timeouts de eventos y proyectos)
│   ├── middleware/           # Auth JWT, validación de roles
│   ├── models/               # Esquemas Mongoose (MongoDB)
│   ├── routes/               # Definición de endpoints REST
│   ├── services/             # Servicios reutilizables (wallets, Soroban, etc.)
│   ├── server.js             # Entry point
│   └── .env.example          # Plantilla de variables de entorno
│
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/              # App Router de Next.js (páginas y layouts)
│   │   ├── components/       # Componentes React reutilizables
│   │   ├── lib/              # Clientes HTTP, utilidades
│   │   ├── store/            # Estado global con Zustand
│   │   └── types/            # Tipos TypeScript compartidos
│   └── package.json
│
└── soroban-contracts/        # Smart contracts en Rust (Soroban SDK)
    ├── contracts/
    │   ├── reputation_ledger/  # Gestión de reputación on-chain
    │   ├── event_contract/     # Eventos/competencias con escrow
    │   ├── project_contract/   # Proyectos 1:1 con escrow
    │   └── wallet_registry/    # Registro de identidad on-chain
    ├── deploy.sh               # Script de compilación y despliegue (Linux/macOS)
    ├── deploy.bat              # Script de despliegue (Windows)
    ├── contract.docs.md        # Documentación detallada de contratos
    ├── backend_endpoints_v2.md # Especificación completa de la API
    └── .env.example            # Plantilla de variables de entorno
```

---

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| **Node.js** | 20 LTS | https://nodejs.org |
| **npm** | 10+ | incluido con Node.js |
| **Rust** | stable | https://rustup.rs |
| **Stellar CLI** (brew) | 28+ | `brew install stellar-cli` |
| **Docker** | — | para MongoDB local (o usa MongoDB Atlas) |

> **Nota:** Para trabajar únicamente en el frontend o backend no necesitas instalar Rust ni Stellar CLI. Solo es necesario para compilar y desplegar contratos.

---

## Variables de entorno

El proyecto utiliza variables de entorno en dos módulos. **Nunca subas archivos `.env` reales al repositorio.**

### Backend (`backend/.env`)

Copia la plantilla y rellena tus valores:

```bash
cp backend/.env.example backend/.env
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor Express (default: `5000`) |
| `MONGO_URI` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `SOROBAN_RPC_URL` | RPC de Soroban (`https://soroban-testnet.stellar.org`) |
| `NETWORK` | Red Stellar: `testnet` o `mainnet` |
| `REPUTATION_CONTRACT_ID` | ID del contrato `ReputationLedger` desplegado |
| `EVENT_CONTRACT_ID` | ID del contrato `EventContract` desplegado |
| `PROJECT_CONTRACT_ID` | ID del contrato `ProjectContract` desplegado |
| `WALLET_REGISTRY_CONTRACT_ID` | ID del contrato `WalletRegistry` desplegado |
| `ADMIN_SECRET` | Clave secreta Stellar de la cuenta administradora |
| `PLATFORM_SECRET` | Clave secreta Stellar de la cuenta de plataforma |
| `WALLET_ENCRYPTION_KEY` | Clave de cifrado para wallets custodiales en DB |

### Soroban Contracts (`soroban-contracts/.env`)

```bash
cp soroban-contracts/.env.example soroban-contracts/.env
```

Contiene las mismas variables de Stellar/Soroban que el backend (sin `PORT`, `MONGO_URI`, `JWT_SECRET`).

> **Tip:** `deploy_v3.sh` escribe las variables de contratos en `soroban-contracts/.env.testnet`.

---

## Instalación y puesta en marcha

Guía para correr todo en local contra **Stellar testnet**: MongoDB en Docker, contratos desplegados por script, backend y frontend en modo desarrollo.

### 0. Dependencias del sistema (macOS)

```bash
brew install rustup stellar-cli
export PATH="/opt/homebrew/opt/rustup/bin:$PATH"
rustup toolchain install stable --target wasm32v1-none --profile minimal
```

Docker Desktop debe estar corriendo para MongoDB.

### 1. MongoDB local

```bash
docker run -d --name nuup-mongo -p 27017:27017 -v nuup-mongo-data:/data/db mongo:7
# siguientes veces: docker start nuup-mongo
```

### 2. Smart Contracts (Soroban)

```bash
cd soroban-contracts
cargo test                # 150 tests
./deploy_v3.sh            # despliega en testnet y escribe .env.testnet
```

`deploy_v3.sh` crea y fondea las identidades `nuup-admin` y `nuup-platform`, emite un asset de prueba `MXNE` (emisor = plataforma) y lo envuelve como SAC, despliega e inicializa los 4 contratos y autoriza a `EventContract`/`ProjectContract` en `ReputationLedger`. Las variables quedan en `soroban-contracts/.env.testnet`.

### 3. Backend (Node.js / Express)

```bash
cd backend
npm install
cp .env.example .env
cat ../soroban-contracts/.env.testnet >> .env   # IDs de contratos, MXNe y claves admin/plataforma
```

Completa en `backend/.env` al menos:

| Variable | Valor local sugerido |
|---|---|
| `PORT` | `5050` (en macOS el 5000 lo ocupa AirPlay Receiver) |
| `MONGO_URI` | `mongodb://localhost:27017/nuup` |
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `WALLET_ENCRYPTION_KEY` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `VIBRANT_WEBHOOK_SECRET` | cualquier secreto (los webhooks se firman con HMAC-SHA256) |
| `RESEND_API_KEY` | opcional; vacío = no se envían emails (solo warning en logs) |

```bash
npm run bootstrap         # categorías + admin (admin@nuup.local / Admin12345!)
npm run search:index      # índice de búsqueda de freelancers
npm run dev               # http://localhost:5050
npm test                  # tests de cifrado de wallets
```

En testnet, cada wallet nueva se fondea con Friendbot y abre trustline a MXNe automáticamente.

### 4. Frontend (Next.js)

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5050/api" > .env.local
npm run dev               # http://localhost:3001
```

### Simular un depósito SPEI (Vibrant sandbox)

Sin `VIBRANT_API_KEY` el backend genera una CLABE simulada. Para confirmar el depósito:

```bash
cd backend
npm run simulate:deposit -- <referencia NUUP-...> <monto>
```

Envía un webhook `deposit.confirmed` firmado; el backend acredita MXNe on-chain a la wallet del usuario. Reenviarlo no acredita dos veces.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
│                    http://localhost:3001                  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP REST
┌───────────────────────▼─────────────────────────────────┐
│               Backend API (Express / Node.js)            │
│                    http://localhost:5000                  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Controllers  │  │   Services   │  │  Cron Jobs    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘  │
│         │                 │                  │           │
│  ┌──────▼───────────────────────────────────▼────────┐  │
│  │           Contract Wrappers (contracts/)           │  │
│  └──────────────────────┬─────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ Soroban RPC
┌─────────────────────────▼───────────────────────────────┐
│              Stellar Testnet (Soroban)                   │
│                                                          │
│  ReputationLedger │ EventContract │ ProjectContract      │
│                   │ WalletRegistry                       │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────▼──────────┐
              │    MongoDB Atlas      │
              │  (metadatos off-chain)│
              └──────────────────────┘
```

**Modelo custodial:** El usuario nunca maneja claves privadas. La plataforma almacena las wallets Stellar cifradas en MongoDB y firma las transacciones en nombre del usuario.

---

## API Reference

La especificación completa de endpoints se encuentra en [`soroban-contracts/backend_endpoints_v2.md`](./soroban-contracts/backend_endpoints_v2.md).

### Resumen de módulos

| Prefijo | Descripción |
|---|---|
| `POST /api/auth/register` | Registro de usuario + creación de wallet custodial |
| `POST /api/auth/login` | Autenticación JWT |
| `GET/PATCH /api/users/:publicKey` | Perfil y reputación del usuario |
| `GET/POST /api/events` | Listar y crear eventos/competencias |
| `POST /api/events/:id/apply` | Aplicar a un evento |
| `POST /api/events/:id/submit` | Enviar entregable a un evento |
| `POST /api/events/:id/winners` | Seleccionar ganadores |
| `GET/POST /api/projects` | Listar y crear proyectos 1:1 |
| `POST /api/projects/:id/accept` | Freelancer acepta el proyecto |
| `POST /api/projects/:id/deliver` | Freelancer entrega el trabajo |
| `POST /api/projects/:id/approve` | Reclutador aprueba entrega |
| `GET/POST /api/disputes` | Gestión de disputas (Admin) |
| `GET /api/reputation/:publicKey` | Reputación on-chain de un usuario |
| `GET /api/wallets/balance` | Saldo MXNe del usuario |
| `GET /api/notifications` | Notificaciones del usuario |
| `GET /api/admin/*` | Panel de administración |

---

## Smart Contracts

Documentación detallada en [`soroban-contracts/contract.docs.md`](./soroban-contracts/contract.docs.md).

### Contratos desplegados en Testnet

| Contrato | ID | Descripción |
|---|---|---|
| `ReputationLedger` | `CCSFFRT3E777ZDEUC5Z6GF7QRFXJE33RNRPVTRKMNFH5YHB7DVYZYDOT` | Fuente única de verdad para reputación on-chain |
| `EventContract` | `CDSDLNQ22RM2MEAPGWDZRROLFEOFNIX763OXKBYNSLLDXYLRVBGOXRFR` | Gestión de competencias con escrow |
| `ProjectContract` | `CB7RXH7FA7SIVIR44YSI6AQTJFY7A7747S7HSZ54OKHTHPQRUXRICKNW` | Proyectos 1:1 con escrow y ciclo de vida completo |
| `WalletRegistry` | `CDVBEW6ICFL4RDABN43YDKOWK4WDWHB2OY3LPJB2KU63PG5MCHYD6UOQ` | Registro de identidad on-chain de usuarios |
| MXNe (SAC de prueba) | `CAWFXP3RCR6AGNNU2GTCI4LO7BDSJQK2XJYDS7OVELDQ6J7CEJOQBQJB` | Token de escrow; emisor `GCPFXS2YA63EB7Q72ORURBMVZFWGHE2XNNF3W3QFN7M72R6CRGTM67VP` |

### Resumen de contratos

**ReputationLedger** — Almacena puntos de reputación por usuario y categoría. Solo el admin y contratos autorizados pueden modificarla.

**EventContract** — El reclutador deposita un premio en escrow; los freelancers aplican y envían entregables (hash SHA-256); el reclutador selecciona ganadores. Comisión de plataforma: 10%.

**ProjectContract** — Acuerdo bilateral reclutador ↔ freelancer con escrow, hasta 2 rondas de corrección, sistema de disputas resueltas por el admin.

**WalletRegistry** — Registro de wallets custodiales; valida actividad y rol de usuarios en los demás contratos.

---

## Flujos principales

### Flujo de Evento (Competencia)

```
Reclutador → POST /events           → Crea evento + deposita escrow en MXNe
Freelancer → POST /events/:id/apply → Se registra como participante
Freelancer → POST /events/:id/submit → Envía entregable (hash SHA-256)
Reclutador → POST /events/:id/winners → Selecciona ganadores
                                     → Contrato distribuye 90% premio + 10% plataforma
                                     → Reputación: +10 ganadores, +1 participantes
```

### Flujo de Proyecto (1:1)

```
Reclutador → POST /projects              → Crea proyecto + deposita (amount + guarantee)
Freelancer → POST /projects/:id/accept   → Acepta el proyecto
Freelancer → POST /projects/:id/deliver  → Envía entregable
Reclutador → POST /projects/:id/approve  → Aprueba → fondos al freelancer + +5 reputación
          ↪ POST /projects/:id/correction → Solicita corrección (máx. 2 rondas)
          ↪ POST /projects/:id/reject     → Rechaza → abre disputa
Admin      → POST /disputes/:id/resolve  → Resuelve disputa a favor de cualquiera
```

---

## Contribuir

### Primeros pasos para un nuevo contribuidor

1. **Forkea** el repositorio y clónalo localmente.
2. **Crea** tus archivos `.env` a partir de los `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   cp soroban-contracts/.env.example soroban-contracts/.env
   ```
3. **Rellena** las variables de entorno con tus propias credenciales (MongoDB Atlas gratuito, cuenta Stellar testnet).
4. **Instala** las dependencias de cada módulo:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. **Levanta** el backend y el frontend:
   ```bash
   # Terminal 1
   cd backend && npm run dev
   # Terminal 2
   cd frontend && npm run dev
   ```
6. **Lee** la documentación de contratos y endpoints antes de modificar lógica on-chain:
   - [`soroban-contracts/contract.docs.md`](./soroban-contracts/contract.docs.md)
   - [`soroban-contracts/backend_endpoints_v2.md`](./soroban-contracts/backend_endpoints_v2.md)

### Convenciones

- El backend usa **camelCase** para todos los parámetros de body y query.
- Todos los endpoints retornan `{ success: true, data: ... }` en éxito y `{ error: "mensaje" }` en error.
- Los montos de contratos Soroban están en **MXNe** (no XLM).
- Las claves secretas Stellar (`S...`) **NUNCA** deben llegar al cliente; viven únicamente en variables de entorno del servidor.

---

> **Red:** Testnet Stellar | **Token de pago:** MXNe (SAC) | **RPC:** `https://soroban-testnet.stellar.org`
