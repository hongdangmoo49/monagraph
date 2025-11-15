import type { LatencySnapshot, RpcLatencyProbe } from "./types";

export class RpcLatencyMonitor {
  constructor(private readonly probe: RpcLatencyProbe) {}

  public measure(): Promise<LatencySnapshot> {
    return this.probe.measure();
  }
}

export const assertSuccessfulSnapshot = (snapshot: LatencySnapshot): LatencySnapshot & { status: "success" } => {
  if (snapshot.status === "error") {
    throw new Error(`[${snapshot.network} RPC Latency] ${snapshot.error}`);
  }

  return snapshot;
};
