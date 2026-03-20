#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env};

#[test]
fn test_initialize_and_get_default_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    // La reputación por defecto debe ser 0
    let user = Address::generate(&env);
    let cat = symbol_short!("design");
    assert_eq!(client.get_reputation(&user, &cat), 0u32);
}

#[test]
fn test_add_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let user = Address::generate(&env);
    let cat = symbol_short!("code");

    // Agregar 10 puntos
    client.add_reputation(&admin, &user, &cat, &10u32);
    assert_eq!(client.get_reputation(&user, &cat), 10u32);

    // Agregar 5 más → 15
    client.add_reputation(&admin, &user, &cat, &5u32);
    assert_eq!(client.get_reputation(&user, &cat), 15u32);
}

#[test]
fn test_multiple_categories() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let user = Address::generate(&env);
    let cat_code = symbol_short!("code");
    let cat_design = symbol_short!("design");

    client.add_reputation(&admin, &user, &cat_code, &20u32);
    client.add_reputation(&admin, &user, &cat_design, &8u32);

    assert_eq!(client.get_reputation(&user, &cat_code), 20u32);
    assert_eq!(client.get_reputation(&user, &cat_design), 8u32);
}

#[test]
fn test_shadowban() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let user = Address::generate(&env);

    // No debe estar baneado por defecto
    assert_eq!(client.is_banned(&user), false);

    // Shadowban
    client.shadowban(&admin, &user);
    assert_eq!(client.is_banned(&user), true);
}

#[test]
#[should_panic(expected = "only admin can add reputation")]
fn test_non_admin_cannot_add_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let not_admin = Address::generate(&env);
    client.initialize(&admin);

    let user = Address::generate(&env);
    let cat = symbol_short!("code");

    // Debe fallar
    client.add_reputation(&not_admin, &user, &cat, &10u32);
}

#[test]
#[should_panic(expected = "already initialized")]
fn test_cannot_reinitialize() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(ReputationLedger, ());
    let client = ReputationLedgerClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);
    // Segunda inicialización debe fallar
    client.initialize(&admin);
}
