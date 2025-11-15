import type { LatencyResponse } from "../client/types";
import { latencyCollector } from "./collector";
import { NETWORK_TARGETS } from "./config";
import { latencyStorage } from "./storage";

// 서버 사이드에서 레이턴시 데이터 가져오기
export async function getLatencyData(): Promise<LatencyResponse> {
  // 수집기가 실행 중이 아니면 시작
  if (!latencyCollector.isRunning()) {
    latencyCollector.start();
  }

  const networks = NETWORK_TARGETS.map(target => {
    const averageLatencyMs = latencyStorage.getAverage(target.network, target.endpoint);
    const error = latencyStorage.getLastError(target.network, target.endpoint);

    return {
      network: target.network,
      chain: target.chain,
      endpoint: target.endpoint,
      averageLatencyMs,
      error,
    };
  });

  return {
    networks,
    collectedAt: Date.now(),
  };
}
