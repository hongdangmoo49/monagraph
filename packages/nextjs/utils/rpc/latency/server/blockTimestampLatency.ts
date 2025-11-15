import { RpcLatencyMonitor, assertSuccessfulSnapshot } from "./monitor";
import { BlockTimestampLatencyProbe } from "./probes/blockTimestampLatencyProbe";
import { createViemClockSource } from "./sources/blockTimestampClock";

export const createBlockTimestampRpcLatencyMonitor = (endpoint: string, network: string): RpcLatencyMonitor => {
  const clockSource = createViemClockSource(endpoint);
  const probe = new BlockTimestampLatencyProbe(clockSource, network);

  return new RpcLatencyMonitor(probe);
};

export const getBlockTimestampLatency = async (endpoint: string, network: string): Promise<number> => {
  const monitor = createBlockTimestampRpcLatencyMonitor(endpoint, network);
  const snapshot = await monitor.measure();
  const successSnapshot = assertSuccessfulSnapshot(snapshot);

  return successSnapshot.latencyMs;
};
