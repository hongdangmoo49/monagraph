import { createBlockTimestampRpcLatencyMonitor, getBlockTimestampLatency } from "./blockTimestampLatency";

const DEFAULT_ETHEREUM_ENDPOINT = "https://eth.llamarpc.com";
const DEFAULT_ETHEREUM_NETWORK = "ethereum-mainnet";

export const createEthereumRpcLatencyMonitor = (
  endpoint: string = DEFAULT_ETHEREUM_ENDPOINT,
  network: string = DEFAULT_ETHEREUM_NETWORK,
) => createBlockTimestampRpcLatencyMonitor(endpoint, network);

export const getEthereumBlockLatency = async (endpoint: string = DEFAULT_ETHEREUM_ENDPOINT): Promise<number> => {
  return getBlockTimestampLatency(endpoint, DEFAULT_ETHEREUM_NETWORK);
};
