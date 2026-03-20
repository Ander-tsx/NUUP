#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

// ─── Storage keys ───────────────────────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,                          // Address de la plataforma
    Rep(Address, Symbol),           // (user, category) → u32
    Banned(Address),                // user → bool
}

// ─── Contract ───────────────────────────────────────────────────────────────

#[contract]
pub struct ReputationLedger;

#[contractimpl]
impl ReputationLedger {
    // ── Inicialización ──────────────────────────────────────────────────
    /// Configura el admin (plataforma). Solo se puede llamar una vez.
    pub fn initialize(env: Env, admin: Address) {
        // Prevenir re-inicialización
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    // ── Consultas ───────────────────────────────────────────────────────
    /// Retorna la reputación de un usuario en una categoría.
    /// Retorna 0 si el usuario no tiene reputación registrada.
    pub fn get_reputation(env: Env, user: Address, category: Symbol) -> u32 {
        let key = DataKey::Rep(user, category);
        env.storage().persistent().get(&key).unwrap_or(0u32)
    }

    /// Consulta si un usuario está baneado.
    pub fn is_banned(env: Env, user: Address) -> bool {
        let key = DataKey::Banned(user);
        env.storage().persistent().get(&key).unwrap_or(false)
    }

    // ── Modificaciones (solo admin) ─────────────────────────────────────
    /// Incrementa la reputación de un usuario en una categoría.
    /// Solo el admin (plataforma) o contratos autorizados pueden llamar esto.
    pub fn add_reputation(env: Env, caller: Address, user: Address, category: Symbol, delta: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        caller.require_auth();
        if caller != admin {
            panic!("only admin can add reputation");
        }

        let key = DataKey::Rep(user, category);
        let current: u32 = env.storage().persistent().get(&key).unwrap_or(0u32);
        env.storage().persistent().set(&key, &(current + delta));
    }

    /// Marca a un usuario como baneado (shadowban).
    /// Solo el admin puede ejecutar esta acción.
    pub fn shadowban(env: Env, caller: Address, user: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        caller.require_auth();
        if caller != admin {
            panic!("only admin can shadowban");
        }

        let key = DataKey::Banned(user);
        env.storage().persistent().set(&key, &true);
    }
}

mod test;
