import {
  getArbitrumBlockLatency,
  getAvalancheBlockLatency,
  getMonadBlockLatency,
  getPolygonBlockLatency,
  getSolanaSlotLatency,
} from "~~/utils/rpc/latency";

type LatencyStatus =
  | {
      chain: string;
      endpoint: string;
      status: "healthy";
      latencyMs: number;
    }
  | {
      chain: string;
      endpoint: string;
      status: "error";
      reason: string;
    };

type LatencyTarget = {
  chain: string;
  endpoint: string;
  measureLatency: () => Promise<number>;
};

const SOLANA_MAINNET_ENDPOINT = "https://api.mainnet-beta.solana.com";
const MONAD_TESTNET_ENDPOINT = "https://testnet-rpc.monad.xyz";
const POLYGON_MAINNET_ENDPOINT = "https://polygon-rpc.com";
const AVALANCHE_C_CHAIN_ENDPOINT = "https://api.avax.network/ext/bc/C/rpc";
const ARBITRUM_ONE_ENDPOINT = "https://arb1.arbitrum.io/rpc";

const RPC_LATENCY_TARGETS: LatencyTarget[] = [
  {
    chain: "Solana Mainnet",
    endpoint: SOLANA_MAINNET_ENDPOINT,
    measureLatency: () => getSolanaSlotLatency(SOLANA_MAINNET_ENDPOINT),
  },
  {
    chain: "Monad Testnet",
    endpoint: MONAD_TESTNET_ENDPOINT,
    measureLatency: () => getMonadBlockLatency(MONAD_TESTNET_ENDPOINT),
  },
  {
    chain: "Polygon Mainnet",
    endpoint: POLYGON_MAINNET_ENDPOINT,
    measureLatency: () => getPolygonBlockLatency(POLYGON_MAINNET_ENDPOINT),
  },
  {
    chain: "Avalanche C-Chain",
    endpoint: AVALANCHE_C_CHAIN_ENDPOINT,
    measureLatency: () => getAvalancheBlockLatency(AVALANCHE_C_CHAIN_ENDPOINT),
  },
  {
    chain: "Arbitrum One",
    endpoint: ARBITRUM_ONE_ENDPOINT,
    measureLatency: () => getArbitrumBlockLatency(ARBITRUM_ONE_ENDPOINT),
  },
];

const gatherLatencyStatuses = async (): Promise<LatencyStatus[]> => {
  const measurements = await Promise.all(
    RPC_LATENCY_TARGETS.map(async (target): Promise<LatencyStatus> => {
      try {
        const latencyMs = await target.measureLatency();
        return {
          chain: target.chain,
          endpoint: target.endpoint,
          status: "healthy",
          latencyMs,
        };
      } catch (error) {
        return {
          chain: target.chain,
          endpoint: target.endpoint,
          status: "error",
          reason: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  return measurements;
};

const formatLatency = (latencyMs: number): string => `${latencyMs.toLocaleString()} ms`;

export const RpcLatencySection = async () => {
  const statuses = await gatherLatencyStatuses();

  return (
    <section className="mt-8 px-6 py-8 bg-base-200 rounded-3xl">
      <header className="mb-6 text-left">
        <p className="text-sm uppercase tracking-wider text-secondary">Network Observability</p>
        <h2 className="text-3xl font-bold">RPC Latency Snapshot</h2>
        <p className="text-base text-neutral">
          실시간 RPC 체감 속도 데이터입니다. 더 많은 체인이 순차적으로 추가될 예정입니다.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {statuses.map(status => (
          <article key={status.chain} className="rounded-2xl border border-base-300 bg-base-100 p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral">Chain</p>
                <p className="text-xl font-semibold">{status.chain}</p>
              </div>
              <span
                className={`badge ${
                  status.status === "healthy" ? "badge-success" : "badge-error"
                } badge-lg font-semibold`}
              >
                {status.status === "healthy" ? "Healthy" : "Error"}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-neutral">
              <p>
                <span className="font-medium">Endpoint:</span> {status.endpoint}
              </p>
              {status.status === "healthy" ? (
                <p className="text-4xl font-bold text-primary">{formatLatency(status.latencyMs)}</p>
              ) : (
                <p className="text-error">{status.reason}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
