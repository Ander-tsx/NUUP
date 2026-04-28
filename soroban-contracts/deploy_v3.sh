#!/usr/bin/env bash
set -euo pipefail

# Load environment variables
source .env 2>/dev/null || true

NETWORK="${STELLAR_NETWORK:-testnet}"
ADMIN_ADDRESS="${ADMIN_STELLAR_ADDRESS:?ADMIN_STELLAR_ADDRESS must be set}"
MXNE_TOKEN="${MXNE_TOKEN_ADDRESS:?MXNE_TOKEN_ADDRESS must be set}"
IDENTITY="${STELLAR_IDENTITY:-deployer}"

echo "Deploying contracts to $NETWORK..."

# Build contracts
echo "Building contracts..."
cargo build --release --target wasm32-unknown-unknown

# Deploy WalletRegistry
echo "Deploying WalletRegistry..."
WALLET_REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/wallet_registry.wasm \
  --source "$IDENTITY" \
  --network "$NETWORK")
echo "WalletRegistry: $WALLET_REGISTRY_ID"

# Deploy EventContract
echo "Deploying EventContract..."
EVENT_CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/event_contract.wasm \
  --source "$IDENTITY" \
  --network "$NETWORK")

stellar contract invoke \
  --id "$EVENT_CONTRACT_ID" \
  --source "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS" \
  --token_address "$MXNE_TOKEN"
echo "EventContract: $EVENT_CONTRACT_ID"

# Deploy ProjectContract
echo "Deploying ProjectContract..."
PROJECT_CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/project_contract.wasm \
  --source "$IDENTITY" \
  --network "$NETWORK")

stellar contract invoke \
  --id "$PROJECT_CONTRACT_ID" \
  --source "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS" \
  --token_address "$MXNE_TOKEN"
echo "ProjectContract: $PROJECT_CONTRACT_ID"

echo ""
echo "✅ Deployment complete. Add these to your .env:"
echo "EVENT_CONTRACT_ID=$EVENT_CONTRACT_ID"
echo "PROJECT_CONTRACT_ID=$PROJECT_CONTRACT_ID"
