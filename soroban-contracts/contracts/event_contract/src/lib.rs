#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, BytesN, Env, IntoVal, Map, Symbol,
    Vec,
};

// ─── Data types ─────────────────────────────────────────────────────────────

#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum EventStatus {
    Open,     // Evento abierto, freelancers pueden aplicar y enviar entregas
    Closed,   // Evento cerrado sin ganadores (timeout)
    Resolved, // Ganadores seleccionados y premios distribuidos
}

#[derive(Clone, Debug)]
#[contracttype]
pub struct EventData {
    pub recruiter: Address,    // Cuenta del reclutador
    pub prize: i128,           // Premio propuesto
    pub category: Symbol,      // Categoría del evento
    pub deadline_submit: u64,  // Timestamp límite para enviar entregas
    pub deadline_select: u64,  // Timestamp límite para seleccionar ganadores
    pub status: EventStatus,   // Estado actual del evento
    pub applicants: Vec<Address>,   // Cuentas de los aplicantes
    pub submissions: Map<Address, BytesN<32>>, // freelancer → hash del entregable
}

// ─── Storage keys ───────────────────────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,            // Address de la plataforma
    Token,            // Address del token para pagos (XLM nativo o USDC)
    ReputationAddr,   // Address del contrato reputation_ledger
    Event(u64),       // event_id → EventData
    Counter,          // Auto-incrementable para IDs de eventos
    PlatformAddr,     // Plataforma a la que se le va la comisión
}

// ─── Contract ───────────────────────────────────────────────────────────────

#[contract]
pub struct EventContract;

#[contractimpl]
impl EventContract {
    // ── Inicialización ──────────────────────────────────────────────────

    /// Configura admin, token de pago, y dirección del contrato de reputación.
    pub fn initialize(env: Env, admin: Address, token: Address, reputation_addr: Address, platform_addr: Address) {
        // No puede haber dos admins
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();

        // Seteo de las clasves del contrato
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::ReputationAddr, &reputation_addr);
        env.storage()
            .instance()
            .set(&DataKey::PlatformAddr, &platform_addr);
        env.storage().instance().set(&DataKey::Counter, &0u64);
    }

    // ── Creación de eventos ─────────────────────────────────────────────

    /// Crea un nuevo evento/competencia. El reclutador deposita el premio en escrow.
    /// Retorna el event_id único.
    pub fn create_event(
        env: Env,
        recruiter: Address,
        prize: i128,
        category: Symbol,
        deadline_submit: u64,
        deadline_select: u64,
    ) -> u64 {
        recruiter.require_auth();

        if prize <= 0 {
            panic!("prize must be positive");
        }
        if deadline_submit >= deadline_select {
            panic!("deadline_submit must be before deadline_select");
        }

        // Transferir premio al contrato (escrow)
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&recruiter, &env.current_contract_address(), &prize);

        // Generar ID
        let mut counter: u64 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&DataKey::Counter, &counter);

        // Crear evento
        let event = EventData {
            recruiter,
            prize,
            category,
            deadline_submit,
            deadline_select,
            status: EventStatus::Open,
            applicants: Vec::new(&env),
            submissions: Map::new(&env),
        };
        env.storage()
            .persistent()
            .set(&DataKey::Event(counter), &event);

        counter
    }

    // ── Aplicación a eventos ────────────────────────────────────────────

    /// Un freelancer aplica para participar en un evento.
    pub fn apply_to_event(env: Env, event_id: u64, freelancer: Address) {
        freelancer.require_auth();

        let mut event: EventData = env
            .storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .unwrap();

        if event.status != EventStatus::Open {
            panic!("event is not open");
        }

        let now = env.ledger().timestamp();
        if now > event.deadline_submit {
            panic!("submission deadline has passed");
        }

        // Verificar que no haya aplicado ya
        for i in 0..event.applicants.len() {
            if event.applicants.get(i).unwrap() == freelancer {
                panic!("already applied");
            }
        }

        event.applicants.push_back(freelancer);
        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
    }

    // ── Envío de entregables ────────────────────────────────────────────

    /// Un freelancer envía su entregable (hash del código/trabajo).
    pub fn submit_entry(env: Env, event_id: u64, freelancer: Address, entry_hash: BytesN<32>) {
        freelancer.require_auth();

        let mut event: EventData = env
            .storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .unwrap();

        if event.status != EventStatus::Open {
            panic!("event is not open");
        }

        let now = env.ledger().timestamp();
        if now > event.deadline_submit {
            panic!("submission deadline has passed");
        }

        // Verificar que el freelancer haya aplicado
        let mut found = false;
        for i in 0..event.applicants.len() {
            if event.applicants.get(i).unwrap() == freelancer {
                found = true;
                break;
            }
        }
        if !found {
            panic!("freelancer has not applied to this event");
        }

        event.submissions.set(freelancer, entry_hash);
        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
    }

    // ── Selección de ganadores ──────────────────────────────────────────

    /// El reclutador selecciona los ganadores. El premio se divide equitativamente.
    /// Se actualiza la reputación de cada ganador en el contrato de reputación.
    pub fn select_winners(env: Env, event_id: u64, winners: Vec<Address>) {
        let mut event: EventData = env
            .storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .unwrap();

        // Solo el reclutador puede seleccionar ganadores
        event.recruiter.require_auth();

        if event.status != EventStatus::Open {
            panic!("event is not open");
        }

        let now = env.ledger().timestamp();
        if now < event.deadline_submit {
            panic!("cannot select winners before submission deadline");
        }

        if winners.is_empty() {
            panic!("must select at least one winner");
        }

        // Verificar que todos los ganadores hayan enviado entregable
        for i in 0..winners.len() {
            let winner = winners.get(i).unwrap();
            if !event.submissions.contains_key(winner.clone()) {
                panic!("winner has not submitted an entry");
            }
        }

        // Distribuir premio equitativamente
        let platform: Address = env.storage().instance().get(&DataKey::PlatformAddr).unwrap();
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Cobrar comisión muehehehehhehehehe
        let commission = event.prize / 10; // 10%
        let payout = event.prize - commission;
        let prize_per_winner = payout / (winners.len() as i128);
        

        //Enviar la comisión ijijijiji
        token_client.transfer(
            &env.current_contract_address(),
            &platform,
            &commission,
        );

        for i in 0..winners.len() {
            let winner = winners.get(i).unwrap();
            token_client.transfer(
                &env.current_contract_address(),
                &winner,
                &prize_per_winner,
            );
        }

        // Actualizar reputación de cada ganador via cross-contract call
        let reputation_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::ReputationAddr)
            .unwrap();
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();

        // Reputación: 10 puntos base por ganar un evento
        let rep_delta: u32 = 10;
        for i in 0..winners.len() {
            let winner = winners.get(i).unwrap();
            // Cross-contract call a reputation_ledger.add_reputation
            env.invoke_contract::<()>(
                &reputation_addr,
                &Symbol::new(&env, "add_reputation"),
                (
                    admin.clone(),
                    winner,
                    event.category.clone(),
                    rep_delta,
                )
                    .into_val(&env),
            );
        }

        // Para los no ganadores se les premia un tantito
        let delta_rep_no_winners = 1;

        for i in 0..event.applicants.len() {
            let applicant = event.applicants.get(i).unwrap();

            // Saltar si es ganador
            let mut is_winner = false;
            for j in 0..winners.len() {
                if applicant == winners.get(j).unwrap() {
                    is_winner = true;
                    break;
                }
            }
            if is_winner {
                continue;
            }

            // Dar reputación mínima
            env.invoke_contract::<()>(
                &reputation_addr,
                &Symbol::new(&env, "add_reputation"),
                (
                    admin.clone(),
                    applicant,
                    event.category.clone(),
                    delta_rep_no_winners,
                )
                    .into_val(&env),
            );
        }

        event.status = EventStatus::Resolved;
        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
    }

    // ── Timeout ─────────────────────────────────────────────────────────

    /// Si el reclutador no selecciona ganadores antes del deadline_select,
    /// cualquiera puede llamar esta función para devolver los fondos al reclutador.
    pub fn timeout_distribute(env: Env, event_id: u64) {
        let mut event: EventData = env
            .storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .unwrap();

        if event.status != EventStatus::Open {
            panic!("event is not open");
        }

        let now = env.ledger().timestamp();
        if now <= event.deadline_select {
            panic!("selection deadline has not passed yet");
        }

        // Devolver fondos al reclutador
    
        // Cobrar comisión muehehehehhehehehe
        let commission = event.prize / 10; // 10%
        let payout = event.prize - commission;

        let platform: Address = env.storage().instance().get(&DataKey::PlatformAddr).unwrap();
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transferir comisión a la plataforma muehehehehe
        token_client.transfer(
            &env.current_contract_address(),
            &platform,
            &commission,
        );

        // Devolver el 90% al reclutador
        token_client.transfer(
            &env.current_contract_address(),
            &event.recruiter,
            &payout,
        );

        event.status = EventStatus::Closed;
        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
    }

    // ── Consultas ───────────────────────────────────────────────────────

    /// Retorna los datos de un evento.
    pub fn get_event(env: Env, event_id: u64) -> EventData {
        env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .unwrap()
    }
}

mod test;
