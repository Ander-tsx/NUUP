# ReputationLedger

### Descripción

`ReputationLedger` es el contrato inteligente encargado de gestionar la reputación de los usuarios dentro de la plataforma Nuv.

Actúa como la **fuente única de verdad (single source of truth)** para la reputación, almacenando de forma inmutable los puntajes por usuario y categoría en la blockchain.

Este contrato no contiene lógica de negocio; únicamente registra y expone cambios de reputación generados por otros contratos como `EventContract` y `ProjectContract`.

Las funciones de este contrato son accedidas únicamente por el administrador del sistema y los contratos inteligentes desplegados y autorizados

---

## Modelo de Datos

| Claves del contrato       | Tipo      | Descripción                                               |
|------                     |------     |------------                                               |
| `Admin`                   | `Address` | Dirección de la plataforma (control total del contrato)   |
| `Rep(Address, Symbol)`    | `u32`     | Reputación de un usuario por categoría                    |
| `Banned(Address)`         | `bool`    | Indica si el usuario está baneado                         |
| `Authorized(Address)`     | `bool`    | Indica si el contrato que llama al método está baneado    |

---

## Control de Acceso

- Solo la **wallet de la plataforma (admin)** puede:
    - Modificar reputación
    - Aplicar shadowban
- Contratos autorizados (`EventContract`, `ProjectContract`) también podrán modificar reputación
    - El administrador es quien registra los contratos como autorizados

---

## Funciones del contrato

---

### `initialize`

```rust
initialize(admin: Address)

Inicializa `DataKey` con el valor de `Admin` = `admin`, la dirección ingresada tendrá los derechos sobre todas las funcionalidades


### `get_admin`

```rust
get_admin() -> Address

Devuelve la dirección del administrador actual registrado

### 

### `authorize_contract`

```rust
authorize_contract(contract: Address)

Autoriza a un contrato para interactuar con el Reputation Ledger.

Solo el administrador puede ejecutar esta función.

### `get_reputation`

```rust
get_reputation(user: Address, category: Symbol) -> u32

Devuelve la reputación de un usuario en una categoría específica.

Si el usuario no tiene reputación registrada, retorna 0.

### `is_banned`

```rust
is_banned(user: Address) -> bool

Indica si un usuario está baneado.

Retorna true si está baneado, false en caso contrario.

### `add_reputation`

```rust
add_reputation(caller: Address, user: Address, category: Symbol, delta: u32)

Incrementa la reputación de un usuario en una categoría.

Solo puede ser ejecutada por el administrador.

### `remove_reputation`

```rust
remove_reputation(caller: Address, user: Address, category: Symbol, delta: u32)

Reduce la reputación de un usuario en una categoría.

Solo puede ser ejecutada por el administrador.

### `shadowban`

```rust
shadowban(caller: Address, user: Address)

Marca a un usuario como baneado.

Solo el administrador puede ejecutar esta función.

### `unban`

```rust
unban(caller: Address, user: Address)

Revierte el estado de baneo de un usuario.

Solo el administrador puede ejecutar esta función.

# EventContract

### Descripción

`EventContract` es el contrato inteligente encargado de gestionar eventos/competencias dentro de la plataforma Nuv.

Permite a los reclutadores crear convocatorias con un premio en escrow, recibir aplicaciones de freelancers, evaluar entregables y distribuir recompensas a los ganadores. También actualiza automáticamente la reputación de los participantes mediante llamadas cruzadas al contrato `ReputationLedger`.

---

## Modelo de Datos

### `EventData`

| Campo              | Tipo                        | Descripción                                              |
|--------------------|-----------------------------|----------------------------------------------------------|
| `recruiter`        | `Address`                   | Cuenta del reclutador que creó el evento                 |
| `prize`            | `i128`                      | Premio total depositado en escrow                        |
| `category`         | `Symbol`                    | Categoría del evento (usada para reputación)             |
| `deadline_submit`  | `u64`                       | Timestamp límite para enviar entregables                 |
| `deadline_select`  | `u64`                       | Timestamp límite para seleccionar ganadores              |
| `status`           | `EventStatus`               | Estado actual del evento                                 |
| `applicants`       | `Vec<Address>`              | Lista de freelancers que aplicaron                       |
| `submissions`      | `Map<Address, BytesN<32>>`  | Mapa de freelancer → hash del entregable enviado         |

### `EventStatus`

| Variante    | Descripción                                              |
|-------------|----------------------------------------------------------|
| `Open`      | El evento está activo; se aceptan aplicaciones y envíos |
| `Closed`    | El evento cerró sin ganadores (timeout del reclutador)  |
| `Resolved`  | Ganadores seleccionados y premios distribuidos           |

### Claves de almacenamiento (`DataKey`)

| Clave             | Tipo      | Descripción                                        |
|-------------------|-----------|----------------------------------------------------|
| `Admin`           | `Address` | Dirección del administrador de la plataforma       |
| `Token`           | `Address` | Dirección del token de pago (XLM nativo o USDC)   |
| `ReputationAddr`  | `Address` | Dirección del contrato `ReputationLedger`          |
| `PlatformAddr`    | `Address` | Dirección que recibe la comisión de la plataforma  |
| `Counter`         | `u64`     | Contador auto-incremental para IDs de eventos      |
| `Event(u64)`      | `EventData` | Datos del evento identificado por su ID          |

---

## Control de Acceso

- El **reclutador** puede crear eventos y seleccionar ganadores de sus propios eventos.
- Los **freelancers** pueden aplicar a eventos y enviar entregables.
- La función `timeout_distribute` puede ser llamada por **cualquier cuenta** una vez vencido el plazo de selección.
- La distribución de premios y la actualización de reputación son ejecutadas **automáticamente** por el contrato al resolver un evento.

---

## Flujo del Evento
```
create_event → apply_to_event → submit_entry → select_winners
                                                     ↓ (si no ocurre antes del deadline_select)
                                              timeout_distribute
```

---

## Funciones del contrato

---

### `initialize`
```rust
initialize(admin: Address, token: Address, reputation_addr: Address, platform_addr: Address)
```

Inicializa el contrato con las direcciones esenciales. Solo puede ejecutarse una vez; llamadas posteriores generan un panic.

Registra el `admin`, el token de pago (`token`), la dirección del contrato de reputación (`reputation_addr`) y la dirección de la plataforma que recibirá comisiones (`platform_addr`).

---

### `create_event`
```rust
create_event(recruiter: Address, prize: i128, category: Symbol, deadline_submit: u64, deadline_select: u64) -> u64
```

Crea un nuevo evento y transfiere el `prize` al contrato en escrow. Retorna el `event_id` único generado.

Requisitos:
- `prize` debe ser mayor a 0.
- `deadline_submit` debe ser anterior a `deadline_select`.

---

### `apply_to_event`
```rust
apply_to_event(event_id: u64, freelancer: Address)
```

Registra a un freelancer como participante de un evento.

Requisitos:
- El evento debe estar en estado `Open`.
- El timestamp actual debe ser anterior a `deadline_submit`.
- El freelancer no puede haber aplicado previamente.

---

### `submit_entry`
```rust
submit_entry(event_id: u64, freelancer: Address, entry_hash: BytesN<32>)
```

Registra el entregable del freelancer como un hash de 32 bytes (huella del trabajo enviado).

Requisitos:
- El evento debe estar en estado `Open`.
- El timestamp actual debe ser anterior a `deadline_submit`.
- El freelancer debe haber aplicado previamente al evento.

---

### `select_winners`
```rust
select_winners(event_id: u64, winners: Vec<Address>)
```

El reclutador selecciona los ganadores del evento. Distribuye el premio y actualiza la reputación de todos los participantes.

**Distribución del premio:**
- Se cobra una comisión del **10%** a favor de la plataforma.
- El **90% restante** se divide equitativamente entre los ganadores.

**Actualización de reputación (vía `ReputationLedger`):**
- **Ganadores:** +10 puntos de reputación en la categoría del evento.
- **No ganadores que enviaron aplicación:** +1 punto de reputación en la categoría del evento.

Requisitos:
- Solo el reclutador del evento puede ejecutar esta función.
- El evento debe estar en estado `Open`.
- El timestamp actual debe ser igual o posterior a `deadline_submit`.
- La lista de ganadores no puede estar vacía.
- Cada ganador debe haber enviado un entregable.

---

### `timeout_distribute`
```rust
timeout_distribute(event_id: u64)
```

Si el reclutador no selecciona ganadores antes del `deadline_select`, cualquier cuenta puede invocar esta función para cerrar el evento. Los fondos son devueltos parcialmente al reclutador.

**Distribución en timeout:**
- Se cobra una comisión del **10%** a favor de la plataforma.
- El **90% restante** es devuelto al reclutador.

Requisitos:
- El evento debe estar en estado `Open`.
- El timestamp actual debe ser posterior a `deadline_select`.

---

### `get_event`
```rust
get_event(event_id: u64) -> EventData
```

Retorna los datos completos de un evento dado su `event_id`.

# ProjectContract