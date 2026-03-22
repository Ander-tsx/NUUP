// wallet-registry.contract.js
// Funciones para consumir el contrato WalletRegistry desde el backend.
// El WalletRegistry es el contrato de identidad central de ProofWork.
// Todos los contratos que requieren validación de usuarios hacen cross-contract calls a este contrato.

const { queryContract } = require('./soroban.helper');
const { CONTRACT_IDS } = require('./soroban.client');
const { toAddress } = require('./scval.helpers');

/**
 * Verifica si una wallet está activa en el WalletRegistry.
 * Los contratos EventContract, ProjectContract y ReputationLedger invocan
 * internamente esta función vía cross-contract call.
 * Puedes usarla desde el backend para pre-validar antes de construir transacciones.
 *
 * @param {string} callerPublicKey  - Cuenta que paga la simulación (ej: PLATFORM_SECRET)
 * @param {string} walletPublicKey  - Address a consultar
 * @returns {Promise<boolean>}
 */
async function isActiveByWallet(callerPublicKey, walletPublicKey) {
  const result = await queryContract(
    CONTRACT_IDS.walletRegistry,
    'is_active_by_wallet',
    [toAddress(walletPublicKey)],
    callerPublicKey
  );

  return result?.b() ?? false;
}

/**
 * Obtiene el rol de una wallet en el WalletRegistry.
 * Los contratos lo usan para garantizar que el reclutador tenga rol Recruiter
 * y el freelancer tenga rol Freelancer antes de operar.
 *
 * @param {string} callerPublicKey  - Cuenta que paga la simulación
 * @param {string} walletPublicKey  - Address a consultar
 * @returns {Promise<string|null>}  - "Recruiter" | "Freelancer" | "Admin" | null
 */
async function getRoleByWallet(callerPublicKey, walletPublicKey) {
  const result = await queryContract(
    CONTRACT_IDS.walletRegistry,
    'get_role_by_wallet',
    [toAddress(walletPublicKey)],
    callerPublicKey
  );

  // El resultado es un ScVal Symbol
  return result ? result.sym().toString() : null;
}

module.exports = { isActiveByWallet, getRoleByWallet };
