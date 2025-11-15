import { createBlockTimestampRpcLatencyMonitor, getBlockTimestampLatency } from "./blockTimestampLatency";

const DEFAULT_MONAD_ENDPOINT = "https://testnet-rpc.monad.xyz";
const DEFAULT_MONAD_NETWORK = "monad-testnet";

export const createMonadRpcLatencyMonitor = (
  endpoint: string = DEFAULT_MONAD_ENDPOINT,
  network: string = DEFAULT_MONAD_NETWORK,
) => createBlockTimestampRpcLatencyMonitor(endpoint, network);

export const getMonadBlockLatency = async (endpoint: string = DEFAULT_MONAD_ENDPOINT): Promise<number> => {
  return getBlockTimestampLatency(endpoint, DEFAULT_MONAD_NETWORK);
};
