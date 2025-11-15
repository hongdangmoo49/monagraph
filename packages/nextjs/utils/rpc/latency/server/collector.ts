import { getBlockTimestampLatency } from "./blockTimestampLatency";
import { COLLECTION_INTERVAL_MS, NETWORK_TARGETS } from "./config";
import { RpcLatencyMonitor } from "./monitor";
import { SolanaConnectionClockSource, SolanaRpcLatencyProbe } from "./solana";
import { latencyStorage } from "./storage";
import { Connection } from "@solana/web3.js";

class LatencyCollector {
  private intervalId: NodeJS.Timeout | null = null;
  private isCollecting = false;

  public start(): void {
    if (this.intervalId) {
      console.log("[LatencyCollector] Already running");
      return;
    }

    console.log("[LatencyCollector] Starting collection");

    // 즉시 한 번 실행
    this.collect();

    // 주기적으로 실행
    this.intervalId = setInterval(() => {
      this.collect();
    }, COLLECTION_INTERVAL_MS);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[LatencyCollector] Stopped");
    }
  }

  private async collect(): Promise<void> {
    if (this.isCollecting) {
      console.log("[LatencyCollector] Collection already in progress, skipping");
      return;
    }

    this.isCollecting = true;

    try {
      await Promise.all(
        NETWORK_TARGETS.map(async target => {
          try {
            let snapshot;

            if (target.type === "solana") {
              const connection = new Connection(target.endpoint);
              const clockSource = new SolanaConnectionClockSource(connection);
              const probe = new SolanaRpcLatencyProbe(clockSource, target.network);
              const monitor = new RpcLatencyMonitor(probe);
              snapshot = await monitor.measure();
            } else {
              // EVM chains
              const latencyMs = await getBlockTimestampLatency(target.endpoint, target.network);
              snapshot = {
                status: "success" as const,
                latencyMs,
                network: target.network,
                endpoint: target.endpoint,
                capturedAt: Date.now(),
              };
            }

            latencyStorage.addSample(snapshot);
            console.log(
              `[LatencyCollector] ${target.network}: ${snapshot.status === "success" ? `${snapshot.latencyMs}ms` : snapshot.error}`,
            );
          } catch (error) {
            const errorSnapshot = {
              status: "error" as const,
              error: error instanceof Error ? error.message : "Unknown error",
              network: target.network,
              endpoint: target.endpoint,
              capturedAt: Date.now(),
            };
            latencyStorage.addSample(errorSnapshot);
            console.error(`[LatencyCollector] ${target.network} failed:`, error);
          }
        }),
      );
    } finally {
      this.isCollecting = false;
    }
  }

  public isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// 싱글톤 인스턴스
export const latencyCollector = new LatencyCollector();
