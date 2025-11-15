import type { BlockTimestampClockSource } from "../sources/blockTimestampClock";
import type { LatencySnapshot, RpcLatencyProbe } from "../types";

export class BlockTimestampLatencyProbe implements RpcLatencyProbe {
  constructor(
    private readonly clockSource: BlockTimestampClockSource,
    public readonly network: string,
  ) {}

  public get endpoint(): string {
    return this.clockSource.endpoint;
  }

  public async measure(): Promise<LatencySnapshot> {
    const capturedAt = Date.now();

    try {
      const blockTimestamp = await this.clockSource.fetchLatestBlockTimestamp();
      const nowSeconds = capturedAt / 1000;
      const latencyMs = Math.max(0, Math.round((nowSeconds - blockTimestamp) * 1000));

      return {
        status: "success",
        latencyMs,
        network: this.network,
        endpoint: this.endpoint,
        capturedAt,
      };
    } catch (error) {
      return this.createErrorSnapshot(error instanceof Error ? error.message : "Unknown error", capturedAt);
    }
  }

  private createErrorSnapshot(error: string, capturedAt: number): LatencySnapshot {
    return {
      status: "error",
      error,
      network: this.network,
      endpoint: this.endpoint,
      capturedAt,
    };
  }
}
