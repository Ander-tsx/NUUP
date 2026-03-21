# ReputationLedger

### Descripción

`ReputationLedger` es el contrato inteligente encargado de gestionar la reputación de los usuarios dentro de la plataforma ProofWork.

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

# ProjectContract