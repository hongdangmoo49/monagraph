import { getLatencyData } from "~~/utils/rpc/latency";

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

const gatherLatencyStatuses = async (): Promise<LatencyStatus[]> => {
  try {
    const data = await getLatencyData();

    return data.networks.map(network => {
      if (network.averageLatencyMs !== null) {
        return {
          chain: network.chain,
          endpoint: network.endpoint,
          status: "healthy" as const,
          latencyMs: network.averageLatencyMs,
        };
      } else {
        return {
          chain: network.chain,
          endpoint: network.endpoint,
          status: "error" as const,
          reason: network.error || "데이터 수집 중입니다...",
        };
      }
    });
  } catch (error) {
    console.error("[RpcLatencySection] Failed to get latency data:", error);
    return [];
  }
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
