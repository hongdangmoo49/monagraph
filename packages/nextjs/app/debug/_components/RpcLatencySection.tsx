"use client";

import { useEffect, useState } from "react";
import { fetchLatencyData } from "~~/utils/rpc/latency/client/api";
import type { LatencyResponse } from "~~/utils/rpc/latency/client/types";

const POLLING_INTERVAL_MS = 10000; // 10초마다 자동 업데이트

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

const formatLatency = (latencyMs: number): string => `${latencyMs.toLocaleString()} ms`;

const useRelativeTime = (timestamp: number) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
      if (secondsAgo < 60) setRelativeTime(`${secondsAgo}초 전`);
      else if (secondsAgo < 3600) setRelativeTime(`${Math.floor(secondsAgo / 60)}분 전`);
      else setRelativeTime(`${Math.floor(secondsAgo / 3600)}시간 전`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return relativeTime;
};

const LatencySkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-3 bg-base-300 rounded w-12 mb-2"></div>
              <div className="h-5 bg-base-300 rounded w-24"></div>
            </div>
            <div className="h-8 bg-base-300 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-base-300 rounded w-full"></div>
            <div className="h-10 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const gatherLatencyStatuses = (data: LatencyResponse): LatencyStatus[] => {
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
};

export const RpcLatencySection = () => {
  const [data, setData] = useState<LatencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const result = await fetchLatencyData();
      setData(result);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다");
      console.error("[RpcLatencySection] Failed to fetch latency data:", err);
    } finally {
      setIsLoading(false);
      if (isManualRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => fetchData(), POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const relativeTime = useRelativeTime(lastUpdated);
  const statuses = data ? gatherLatencyStatuses(data) : [];
  const isMonitoring = !isLoading && !error;

  return (
    <section className="mt-8 px-6 py-8 bg-base-200 rounded-3xl">
      <header className="mb-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-wider text-secondary">Network Observability</p>
            <h2 className="text-3xl font-bold">RPC Latency Snapshot</h2>
            <p className="text-base text-neutral">
              실시간 RPC 체감 속도 데이터입니다. 더 많은 체인이 순차적으로 추가될 예정입니다.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="btn btn-sm btn-primary min-w-[100px]"
            >
              {isRefreshing ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  새로고침
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  새로고침
                </>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isMonitoring ? "bg-green-500" : isLoading ? "bg-yellow-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-neutral">
                {isMonitoring ? `${relativeTime} 업데이트` : isLoading ? "데이터 수집 중..." : "연결 오류"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm" onClick={() => fetchData(true)}>
            재시도
          </button>
        </div>
      )}

      {isLoading && !data ? (
        <LatencySkeleton />
      ) : (
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
      )}
    </section>
  );
};
