#![cfg(test)]

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Ledger},
    token, Address, BytesN, Env,
};

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

// ── Mini mock para reputation_ledger ────────────────────────────────────────
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
        }
    }
}

// ── Tests ───────────────────────────────────────────────────────────────────

#[test]
fn test_full_project_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &1500);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    // Crear proyecto: amount=1000, guarantee=200
    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &1000, &200, &5000, &cat);
    assert_eq!(pid, 1);
    assert_eq!(token_client.balance(&recruiter), 300); // 1500 - 1200
    assert_eq!(token_client.balance(&contract_id), 1200);

    // Freelancer acepta
    client.accept_project(&pid, &freelancer);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Active);

    // Freelancer entrega
    let hash = BytesN::from_array(&env, &[42u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Delivered);

    // Reclutador aprueba
    client.approve_delivery(&pid, &recruiter);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Completed);

    // Freelancer recibió amount + guarantee = 1200
    assert_eq!(token_client.balance(&freelancer), 1200);
    assert_eq!(token_client.balance(&contract_id), 0);
}

#[test]
fn test_correction_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &1000);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("design");
    let pid = client.create_project(&recruiter, &freelancer, &800, &100, &5000, &cat);

    client.accept_project(&pid, &freelancer);

    // Primera entrega
    let hash1 = BytesN::from_array(&env, &[1u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash1);

    // Reclutador pide corrección (1/2)
    client.request_correction(&pid, &recruiter);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Correcting);
    assert_eq!(p.correction_count, 1);

    // Freelancer corrige y re-entrega
    let hash2 = BytesN::from_array(&env, &[2u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash2);

    // Reclutador aprueba la segunda entrega
    client.approve_delivery(&pid, &recruiter);
    assert_eq!(token_client.balance(&freelancer), 900); // 800 + 100
}

#[test]
fn test_dispute_favor_freelancer() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &600);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &500, &50, &5000, &cat);

    client.accept_project(&pid, &freelancer);

    let hash = BytesN::from_array(&env, &[7u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash);

    // Reclutador rechaza → disputa
    client.reject_delivery(&pid, &recruiter);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Disputed);

    // Admin resuelve a favor del freelancer
    client.resolve_dispute(&pid, &admin, &true);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Completed);
    assert_eq!(token_client.balance(&freelancer), 550);
}

#[test]
fn test_dispute_favor_recruiter() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &600);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &500, &50, &5000, &cat);

    client.accept_project(&pid, &freelancer);
    let hash = BytesN::from_array(&env, &[7u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash);

    client.reject_delivery(&pid, &recruiter);

    // Admin resuelve a favor del reclutador
    client.resolve_dispute(&pid, &admin, &false);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Cancelled);
    // Reclutador recibe de vuelta sus fondos
    assert_eq!(token_client.balance(&recruiter), 600); // 50 restante + 550 devuelto
}

#[test]
fn test_timeout_approve() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &500);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &400, &50, &3000, &cat);

    client.accept_project(&pid, &freelancer);
    let hash = BytesN::from_array(&env, &[9u8; 32]);
    client.submit_delivery(&pid, &freelancer, &hash);

    // Avanzar el reloj más allá del deadline
    env.ledger().with_mut(|li| li.timestamp = 4000);

    client.timeout_approve(&pid);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Completed);
    assert_eq!(token_client.balance(&freelancer), 450);
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
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &500);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &400, &50, &3000, &cat);

    // Freelancer nunca acepta, pasa el deadline
    env.ledger().with_mut(|li| li.timestamp = 4000);

    client.timeout_refund(&pid);
    let p = client.get_project(&pid);
    assert_eq!(p.status, ProjectStatus::Cancelled);
    assert_eq!(token_client.balance(&recruiter), 500); // Todo devuelto
}

#[test]
#[should_panic(expected = "maximum correction rounds reached")]
fn test_max_corrections() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    token_admin_client.mint(&recruiter, &1000);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &800, &100, &5000, &cat);
    client.accept_project(&pid, &freelancer);

    // Ronda 1: entrega → corrección
    let h1 = BytesN::from_array(&env, &[1u8; 32]);
    client.submit_delivery(&pid, &freelancer, &h1);
    client.request_correction(&pid, &recruiter);

    // Ronda 2: entrega → corrección
    let h2 = BytesN::from_array(&env, &[2u8; 32]);
    client.submit_delivery(&pid, &freelancer, &h2);
    client.request_correction(&pid, &recruiter);

    // Ronda 3: entrega → corrección (debe fallar)
    let h3 = BytesN::from_array(&env, &[3u8; 32]);
    client.submit_delivery(&pid, &freelancer, &h3);
    client.request_correction(&pid, &recruiter); // Panic!
}

#[test]
#[should_panic(expected = "only the assigned freelancer can accept")]
fn test_wrong_freelancer_cannot_accept() {
    let env = Env::default();
    env.mock_all_auths();

    let rep_id = env.register(reputation_ledger_mock::ReputationMock, ());
    let admin = Address::generate(&env);
    let (token_client, token_admin_client) = create_token(&env, &admin);
    let token_addr = token_client.address.clone();

    let recruiter = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let imposter = Address::generate(&env);
    token_admin_client.mint(&recruiter, &1000);

    let contract_id = env.register(ProjectContract, ());
    let client = ProjectContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_addr, &rep_id);

    let cat = symbol_short!("code");
    let pid = client.create_project(&recruiter, &freelancer, &800, &100, &5000, &cat);

    client.accept_project(&pid, &imposter); // Debe fallar
}
