import { createBlockTimestampRpcLatencyMonitor, getBlockTimestampLatency } from "./blockTimestampLatency";

const DEFAULT_AVALANCHE_ENDPOINT = "https://api.avax.network/ext/bc/C/rpc";
const DEFAULT_AVALANCHE_NETWORK = "avalanche-c-chain";

export const createAvalancheRpcLatencyMonitor = (
  endpoint: string = DEFAULT_AVALANCHE_ENDPOINT,
  network: string = DEFAULT_AVALANCHE_NETWORK,
) => createBlockTimestampRpcLatencyMonitor(endpoint, network);

export const getAvalancheBlockLatency = async (endpoint: string = DEFAULT_AVALANCHE_ENDPOINT): Promise<number> => {
  return getBlockTimestampLatency(endpoint, DEFAULT_AVALANCHE_NETWORK);
};
