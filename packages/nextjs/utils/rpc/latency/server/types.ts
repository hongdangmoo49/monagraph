export type LatencySnapshot =
  | {
      status: "success";
      latencyMs: number;
      network: string;
      endpoint: string;
      capturedAt: number;
    }
  | {
      status: "error";
      error: string;
      network: string;
      endpoint: string;
      capturedAt: number;
    };

export interface RpcLatencyProbe {
  readonly network: string;
  readonly endpoint: string;
  measure(): Promise<LatencySnapshot>;
}
