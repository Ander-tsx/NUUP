#![cfg(test)]

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Ledger},
    Address, BytesN, Env, Vec,
};

// Helper: registra un token SAC de prueba y mintea tokens
fn create_token<'a>(
    env: &Env,
    admin: &Address,
) -> (token::Client<'a>, token::StellarAssetClient<'a>) {
    let addr = env.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(env, &addr.address()),
        token::StellarAssetClient::new(env, &addr.address()),
    )
}

#[test]
fn test_full_event_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    // Registrar reputation_ledger
    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());

    // Crear token y mintear al reclutador
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    token_admin_client.mint(&recruiter, &1000);

    // Registrar event_contract
    let contract_id = env.register(EventContract, ());
    let client = EventContractClient::new(&env, &contract_id);

    client.initialize(&admin, &token_addr, &rep_id);

    // Crear evento con premio de 100
    let category = symbol_short!("code");
    let event_id = client.create_event(&recruiter, &100, &category, &1000, &2000);
    assert_eq!(event_id, 1);

    // Verificar que el reclutador transfirió el premio
    assert_eq!(token_client.balance(&recruiter), 900);
    assert_eq!(token_client.balance(&contract_id), 100);

    // Freelancers aplican
    let fl1 = Address::generate(&env);
    let fl2 = Address::generate(&env);
    client.apply_to_event(&event_id, &fl1);
    client.apply_to_event(&event_id, &fl2);

    // Freelancers envían entregables
    let hash1 = BytesN::from_array(&env, &[1u8; 32]);
    let hash2 = BytesN::from_array(&env, &[2u8; 32]);
    client.submit_entry(&event_id, &fl1, &hash1);
    client.submit_entry(&event_id, &fl2, &hash2);

    // Seleccionar ganadores (ambos)
    let mut winners = Vec::new(&env);
    winners.push_back(fl1.clone());
    winners.push_back(fl2.clone());

    // Avanzar el timestamp
    env.ledger().with_mut(|li| li.timestamp = 1500);

    client.select_winners(&event_id, &winners);

    // Verificar distribución: 100 / 2 = 50 cada uno
    assert_eq!(token_client.balance(&fl1), 50);
    assert_eq!(token_client.balance(&fl2), 50);
    assert_eq!(token_client.balance(&contract_id), 0);

    // Verificar que el evento está resuelto
    let ev = client.get_event(&event_id);
    assert_eq!(ev.status, EventStatus::Resolved);
}

#[test]
fn test_timeout_refund() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());

    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    token_admin_client.mint(&recruiter, &500);

    let contract_id = env.register(EventContract, ());
    let client = EventContractClient::new(&env, &contract_id);

    client.initialize(&admin, &token_addr, &rep_id);

    let event_id = client.create_event(
        &recruiter,
        &200,
        &symbol_short!("design"),
        &1000,
        &2000,
    );

    // Avanzar tiempo más allá del deadline_select
    env.ledger().with_mut(|li| li.timestamp = 2500);

    client.timeout_distribute(&event_id);

    // Fondos devueltos al reclutador
    assert_eq!(token_client.balance(&recruiter), 500);
    assert_eq!(token_client.balance(&contract_id), 0);

    let ev = client.get_event(&event_id);
    assert_eq!(ev.status, EventStatus::Closed);
}

#[test]
#[should_panic(expected = "already applied")]
fn test_cannot_apply_twice() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    token_admin_client.mint(&recruiter, &500);

    let contract_id = env.register(EventContract, ());
    let client = EventContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let event_id = client.create_event(&recruiter, &100, &symbol_short!("code"), &1000, &2000);

    let fl = Address::generate(&env);
    client.apply_to_event(&event_id, &fl);
    client.apply_to_event(&event_id, &fl); // Debe fallar
}

#[test]
#[should_panic(expected = "submission deadline has passed")]
fn test_cannot_apply_after_deadline() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    token_admin_client.mint(&recruiter, &500);

    let contract_id = env.register(EventContract, ());
    let client = EventContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let event_id = client.create_event(&recruiter, &100, &symbol_short!("code"), &1000, &2000);

    env.ledger().with_mut(|li| li.timestamp = 1500);

    let fl = Address::generate(&env);
    client.apply_to_event(&event_id, &fl); // Debe fallar
}

// ── Mini mock para reputation_ledger ────────────────────────────────────────
// Para los tests usamos un mock minimalista que no hace nada en add_reputation
mod reputation_ledger_mock {
    use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

    #[contract]
    pub struct ReputationMock;

    #[contractimpl]
    impl ReputationMock {
        pub fn add_reputation(
            _env: Env,
            _caller: Address,
            _user: Address,
            _category: Symbol,
            _delta: u32,
        ) {
            // Mock: no hace nada, solo acepta la llamada
        }
    }
}
