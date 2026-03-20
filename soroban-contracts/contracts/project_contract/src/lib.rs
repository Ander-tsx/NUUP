#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, BytesN, Env, IntoVal, Symbol,
};

// ─── Data types ─────────────────────────────────────────────────────────────

#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum ProjectStatus {
    Created,    // Proyecto creado, esperando aceptación del freelancer
    Active,     // Freelancer aceptó, trabajando
    Delivered,  // Freelancer entregó, esperando revisión del reclutador
    Correcting, // Reclutador pidió correcciones
    Disputed,   // Disputa abierta, esperando resolución del admin
    Completed,  // Proyecto completado y pagado
    Cancelled,  // Proyecto cancelado, fondos devueltos
}

#[derive(Clone, Debug)]
#[contracttype]
pub struct ProjectData {
    pub recruiter: Address,
    pub freelancer: Address,
    pub amount: i128,              // Pago principal
    pub guarantee: i128,           // Garantía depositada por el reclutador
    pub deadline: u64,             // Timestamp límite
    pub status: ProjectStatus,
    pub delivery_hash: BytesN<32>, // Hash del entregable (bytes vacíos si no se ha entregado)
    pub correction_count: u32,     // Número de correcciones solicitadas
    pub category: Symbol,          // Categoría para reputación
}

// ─── Storage keys ───────────────────────────────────────────────────────────

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    ReputationAddr,
    Project(u64),
    Counter,
}

// ─── Contract ───────────────────────────────────────────────────────────────

#[contract]
pub struct ProjectContract;

#[contractimpl]
impl ProjectContract {
    // ── Inicialización ──────────────────────────────────────────────────

    pub fn initialize(env: Env, admin: Address, token: Address, reputation_addr: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::ReputationAddr, &reputation_addr);
        env.storage().instance().set(&DataKey::Counter, &0u64);
    }

    // ── Creación de proyectos ───────────────────────────────────────────

    /// Crea un nuevo proyecto. El reclutador deposita amount + guarantee en escrow.
    pub fn create_project(
        env: Env,
        recruiter: Address,
        freelancer: Address,
        amount: i128,
        guarantee: i128,
        deadline: u64,
        category: Symbol,
    ) -> u64 {
        recruiter.require_auth();

        if amount <= 0 {
            panic!("amount must be positive");
        }
        if guarantee < 0 {
            panic!("guarantee must be non-negative");
        }

        // Transferir amount + guarantee al contrato (escrow)
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total = amount + guarantee;
        token_client.transfer(&recruiter, &env.current_contract_address(), &total);

        // Generar ID
        let mut counter: u64 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&DataKey::Counter, &counter);

        // Hash vacío para inicializar
        let empty_hash = BytesN::from_array(&env, &[0u8; 32]);

        let project = ProjectData {
            recruiter,
            freelancer,
            amount,
            guarantee,
            deadline,
            status: ProjectStatus::Created,
            delivery_hash: empty_hash,
            correction_count: 0,
            category,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Project(counter), &project);

        counter
    }

    // ── Aceptación ──────────────────────────────────────────────────────

    /// El freelancer asignado acepta el proyecto.
    pub fn accept_project(env: Env, project_id: u64, freelancer: Address) {
        freelancer.require_auth();

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.status != ProjectStatus::Created {
            panic!("project is not in Created status");
        }
        if project.freelancer != freelancer {
            panic!("only the assigned freelancer can accept");
        }

        project.status = ProjectStatus::Active;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Entrega ─────────────────────────────────────────────────────────

    /// El freelancer envía su entregable.
    pub fn submit_delivery(
        env: Env,
        project_id: u64,
        freelancer: Address,
        delivery_hash: BytesN<32>,
    ) {
        freelancer.require_auth();

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.freelancer != freelancer {
            panic!("only the assigned freelancer can submit");
        }
        if project.status != ProjectStatus::Active && project.status != ProjectStatus::Correcting {
            panic!("project must be Active or Correcting to submit delivery");
        }

        project.delivery_hash = delivery_hash;
        project.status = ProjectStatus::Delivered;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Aprobación ──────────────────────────────────────────────────────

    /// El reclutador aprueba la entrega. Se paga al freelancer y se actualiza reputación.
    pub fn approve_delivery(env: Env, project_id: u64, recruiter: Address) {
        recruiter.require_auth();

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.recruiter != recruiter {
            panic!("only the recruiter can approve");
        }
        if project.status != ProjectStatus::Delivered {
            panic!("project must be in Delivered status");
        }

        // Pagar al freelancer: amount + guarantee
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total = project.amount + project.guarantee;
        token_client.transfer(
            &env.current_contract_address(),
            &project.freelancer,
            &total,
        );

        // Actualizar reputación del freelancer
        Self::update_reputation(&env, &project.freelancer, &project.category, 5);

        project.status = ProjectStatus::Completed;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Correcciones ────────────────────────────────────────────────────

    /// El reclutador solicita correcciones. Máximo 2 rondas.
    pub fn request_correction(env: Env, project_id: u64, recruiter: Address) {
        recruiter.require_auth();

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.recruiter != recruiter {
            panic!("only the recruiter can request corrections");
        }
        if project.status != ProjectStatus::Delivered {
            panic!("project must be in Delivered status");
        }
        if project.correction_count >= 2 {
            panic!("maximum correction rounds reached");
        }

        project.correction_count += 1;
        project.status = ProjectStatus::Correcting;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Rechazo → disputa ───────────────────────────────────────────────

    /// El reclutador rechaza la entrega, abriendo una disputa para resolución del admin.
    pub fn reject_delivery(env: Env, project_id: u64, recruiter: Address) {
        recruiter.require_auth();

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.recruiter != recruiter {
            panic!("only the recruiter can reject");
        }
        if project.status != ProjectStatus::Delivered {
            panic!("project must be in Delivered status");
        }

        project.status = ProjectStatus::Disputed;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Resolución de disputas ──────────────────────────────────────────

    /// Solo el admin puede resolver disputas. Decide a favor del freelancer o del reclutador.
    pub fn resolve_dispute(
        env: Env,
        project_id: u64,
        admin: Address,
        favor_freelancer: bool,
    ) {
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        if admin != stored_admin {
            panic!("only admin can resolve disputes");
        }

        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.status != ProjectStatus::Disputed {
            panic!("project must be in Disputed status");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total = project.amount + project.guarantee;

        if favor_freelancer {
            // Pagar al freelancer
            token_client.transfer(
                &env.current_contract_address(),
                &project.freelancer,
                &total,
            );
            // Actualizar reputación
            Self::update_reputation(&env, &project.freelancer, &project.category, 5);
            project.status = ProjectStatus::Completed;
        } else {
            // Devolver fondos al reclutador
            token_client.transfer(
                &env.current_contract_address(),
                &project.recruiter,
                &total,
            );
            project.status = ProjectStatus::Cancelled;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Timeouts ────────────────────────────────────────────────────────

    /// Si el deadline pasó y el proyecto está en Delivered sin acción del reclutador,
    /// se auto-aprueba y paga al freelancer.
    pub fn timeout_approve(env: Env, project_id: u64) {
        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.status != ProjectStatus::Delivered {
            panic!("project must be in Delivered status for timeout_approve");
        }

        let now = env.ledger().timestamp();
        if now <= project.deadline {
            panic!("deadline has not passed yet");
        }

        // Auto-aprobar: pagar al freelancer
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total = project.amount + project.guarantee;
        token_client.transfer(
            &env.current_contract_address(),
            &project.freelancer,
            &total,
        );

        Self::update_reputation(&env, &project.freelancer, &project.category, 5);

        project.status = ProjectStatus::Completed;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    /// Si el deadline pasó y el freelancer nunca aceptó (status Created),
    /// se devuelven los fondos al reclutador.
    pub fn timeout_refund(env: Env, project_id: u64) {
        let mut project: ProjectData = env
            .storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap();

        if project.status != ProjectStatus::Created {
            panic!("project must be in Created status for timeout_refund");
        }

        let now = env.ledger().timestamp();
        if now <= project.deadline {
            panic!("deadline has not passed yet");
        }

        // Devolver fondos al reclutador
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total = project.amount + project.guarantee;
        token_client.transfer(
            &env.current_contract_address(),
            &project.recruiter,
            &total,
        );

        project.status = ProjectStatus::Cancelled;
        env.storage()
            .persistent()
            .set(&DataKey::Project(project_id), &project);
    }

    // ── Consultas ───────────────────────────────────────────────────────

    /// Retorna los datos de un proyecto.
    pub fn get_project(env: Env, project_id: u64) -> ProjectData {
        env.storage()
            .persistent()
            .get(&DataKey::Project(project_id))
            .unwrap()
    }

    // ── Internal helpers ────────────────────────────────────────────────

    fn update_reputation(env: &Env, user: &Address, category: &Symbol, delta: u32) {
        let reputation_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::ReputationAddr)
            .unwrap();
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();

        env.invoke_contract::<()>(
            &reputation_addr,
            &Symbol::new(env, "add_reputation"),
            (
                admin,
                user.clone(),
                category.clone(),
                delta,
            )
                .into_val(env),
        );
    }
}

mod test;
