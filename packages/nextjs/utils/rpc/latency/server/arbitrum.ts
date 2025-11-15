import { createBlockTimestampRpcLatencyMonitor, getBlockTimestampLatency } from "./blockTimestampLatency";

const DEFAULT_ARBITRUM_ENDPOINT = "https://arb1.arbitrum.io/rpc";
const DEFAULT_ARBITRUM_NETWORK = "arbitrum-one";

export const createArbitrumRpcLatencyMonitor = (
  endpoint: string = DEFAULT_ARBITRUM_ENDPOINT,
  network: string = DEFAULT_ARBITRUM_NETWORK,
) => createBlockTimestampRpcLatencyMonitor(endpoint, network);

export const getArbitrumBlockLatency = async (endpoint: string = DEFAULT_ARBITRUM_ENDPOINT): Promise<number> => {
  return getBlockTimestampLatency(endpoint, DEFAULT_ARBITRUM_NETWORK);
};
