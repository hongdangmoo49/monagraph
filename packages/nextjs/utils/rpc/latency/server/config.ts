export interface NetworkTarget {
  network: string;
  chain: string;
  endpoint: string;
  type: "evm" | "solana";
}

export const NETWORK_TARGETS: NetworkTarget[] = [
  {
    network: "ethereum-mainnet",
    chain: "Ethereum Mainnet",
    endpoint: "https://eth.llamarpc.com",
    type: "evm",
  },
  {
    network: "arbitrum-one",
    chain: "Arbitrum One",
    endpoint: "https://arb1.arbitrum.io/rpc",
    type: "evm",
  },
  {
    network: "polygon-mainnet",
    chain: "Polygon Mainnet",
    endpoint: "https://polygon-rpc.com",
    type: "evm",
  },
  {
    network: "avalanche-c-chain",
    chain: "Avalanche C-Chain",
    endpoint: "https://api.avax.network/ext/bc/C/rpc",
    type: "evm",
  },
  {
    network: "monad-testnet",
    chain: "Monad Testnet",
    endpoint: "https://testnet-rpc.monad.xyz",
    type: "evm",
  },
  {
    network: "solana-mainnet",
    chain: "Solana Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    type: "solana",
  },
];

export const COLLECTION_INTERVAL_MS = 30 * 1000; // 30초마다 수집
