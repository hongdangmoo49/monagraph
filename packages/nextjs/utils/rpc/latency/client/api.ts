import type { LatencyResponse } from "./types";

const CACHE_TTL_MS = 20 * 1000; // 20초 캐시

interface CacheEntry {
  data: LatencyResponse;
  timestamp: number;
}

let cache: CacheEntry | null = null;

export async function fetchLatencyData(): Promise<LatencyResponse> {
  // 캐시 확인
  const isCacheValid = cache && Date.now() - cache.timestamp < CACHE_TTL_MS;

  if (isCacheValid) {
    return cache!.data;
  }

  // API 호출
  const response = await fetch("/api/rpc-latency");

  if (!response.ok) {
    throw new Error(`Failed to fetch latency data: ${response.statusText}`);
  }

  const data: LatencyResponse = await response.json();

  // 캐시 업데이트
  cache = {
    data,
    timestamp: Date.now(),
  };

  return data;
}

export function clearCache(): void {
  cache = null;
}
