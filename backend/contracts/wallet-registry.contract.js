// wallet-registry.contract.js
// Funciones para consumir el contrato WalletRegistry desde el backend.
// El WalletRegistry es el contrato de identidad central de ProofWork/Nuv.
// Todos los contratos que requieren validación de usuarios hacen cross-contract calls a este contrato.
const { invokeContract, queryContract } = require('./soroban.helper');
const { CONTRACT_IDS } = require('./soroban.client');
const { toAddress, toSymbol, toBytes32 } = require('./scval.helpers');
const crypto = require('crypto');
/**
 * Registra un nuevo usuario en el WalletRegistry on-chain.
 * @param {Keypair} adminKeypair    - Keypair del admin de la plataforma
 * @param {string}  newPublicKey    - Public key de la nueva wallet del usuario
 * @param {string}  email           - Email del usuario (se hashea a SHA-256 antes de enviar)
 * @param {string}  role            - Rol: "Freelancer" | "Recruiter" | "Admin"
 */
async function registerUser(adminKeypair, newPublicKey, email, role) {
  const emailHash = crypto.createHash('sha256').update(email).digest('hex');
  return invokeContract(
    CONTRACT_IDS.walletRegistry,
    'register_user',
    [
      toAddress(newPublicKey),
      toBytes32(emailHash),
      toSymbol(role),
    ],
    adminKeypair
  );
}
/**
 * Verifica si una wallet está activa en el WalletRegistry.
 * @param {string} callerPublicKey  - Cuenta que paga la simulación
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
  return result ? result.sym().toString() : null;
}
/**
 * Rota la wallet de un usuario: reemplaza oldPublicKey por newPublicKey on-chain.
 * @param {Keypair} adminKeypair  - Keypair del admin
 * @param {string}  oldPublicKey  - Public key actual del usuario
 * @param {string}  newPublicKey  - Nueva public key
 */
async function updateWallet(adminKeypair, oldPublicKey, newPublicKey) {
  return invokeContract(
    CONTRACT_IDS.walletRegistry,
    'update_wallet',
    [
      toAddress(oldPublicKey),
      toAddress(newPublicKey),
    ],
    adminKeypair
  );
}
/**
 * Desactiva un usuario en el WalletRegistry.
 * @param {Keypair} adminKeypair    - Keypair del admin
 * @param {string}  userPublicKey   - Public key del usuario a desactivar
 */
async function deactivateUser(adminKeypair, userPublicKey) {
  return invokeContract(
    CONTRACT_IDS.walletRegistry,
    'deactivate_user',
    [toAddress(userPublicKey)],
    adminKeypair
  );
}
/**
 * Re-activa un usuario previamente desactivado en el WalletRegistry.
 * @param {Keypair} adminKeypair    - Keypair del admin
 * @param {string}  userPublicKey   - Public key del usuario a reactivar
 */
async function activateUser(adminKeypair, userPublicKey) {
  return invokeContract(
    CONTRACT_IDS.walletRegistry,
    'activate_user',
    [toAddress(userPublicKey)],
    adminKeypair
  );
}
module.exports = {
  registerUser,
  isActiveByWallet,
  getRoleByWallet,
  updateWallet,
  deactivateUser,
  activateUser,
};