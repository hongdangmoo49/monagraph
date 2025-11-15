import { createBlockTimestampRpcLatencyMonitor, getBlockTimestampLatency } from "./blockTimestampLatency";

const DEFAULT_POLYGON_ENDPOINT = "https://polygon-rpc.com";
const DEFAULT_POLYGON_NETWORK = "polygon-mainnet";

export const createPolygonRpcLatencyMonitor = (
  endpoint: string = DEFAULT_POLYGON_ENDPOINT,
  network: string = DEFAULT_POLYGON_NETWORK,
) => createBlockTimestampRpcLatencyMonitor(endpoint, network);

export const getPolygonBlockLatency = async (endpoint: string = DEFAULT_POLYGON_ENDPOINT): Promise<number> => {
  return getBlockTimestampLatency(endpoint, DEFAULT_POLYGON_NETWORK);
};
