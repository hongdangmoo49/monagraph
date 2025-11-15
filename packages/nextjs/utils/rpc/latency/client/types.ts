export interface NetworkLatency {
  network: string;
  chain: string;
  endpoint: string;
  averageLatencyMs: number | null;
  error: string | null;
}

export interface LatencyResponse {
  networks: NetworkLatency[];
  collectedAt: number;
}
