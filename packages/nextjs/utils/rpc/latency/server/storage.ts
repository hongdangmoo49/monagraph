import type { LatencySnapshot } from "./types";

const SAMPLE_SIZE = 20;
const MAX_AGE_MS = 5 * 60 * 1000; // 5분

interface LatencyRecord {
  network: string;
  endpoint: string;
  samples: LatencySnapshot[];
  lastUpdated: number;
}

class LatencyStorage {
  private records = new Map<string, LatencyRecord>();

  private getKey(network: string, endpoint: string): string {
    return `${network}:${endpoint}`;
  }

  public addSample(snapshot: LatencySnapshot): void {
    const key = this.getKey(snapshot.network, snapshot.endpoint);
    const record = this.records.get(key);

    if (record) {
      record.samples.push(snapshot);
      // 최근 SAMPLE_SIZE개만 유지
      if (record.samples.length > SAMPLE_SIZE) {
        record.samples = record.samples.slice(-SAMPLE_SIZE);
      }
      record.lastUpdated = Date.now();
    } else {
      this.records.set(key, {
        network: snapshot.network,
        endpoint: snapshot.endpoint,
        samples: [snapshot],
        lastUpdated: Date.now(),
      });
    }
  }

  public getAverage(network: string, endpoint: string): number | null {
    const key = this.getKey(network, endpoint);
    const record = this.records.get(key);

    if (!record || record.samples.length === 0) {
      return null;
    }

    // 오래된 데이터 확인
    if (Date.now() - record.lastUpdated > MAX_AGE_MS) {
      return null;
    }

    const successfulSamples = record.samples.filter(s => s.status === "success");

    if (successfulSamples.length === 0) {
      return null;
    }

    const sum = successfulSamples.reduce((acc, sample) => {
      return acc + (sample.status === "success" ? sample.latencyMs : 0);
    }, 0);

    return Math.round(sum / successfulSamples.length);
  }

  public getLastError(network: string, endpoint: string): string | null {
    const key = this.getKey(network, endpoint);
    const record = this.records.get(key);

    if (!record || record.samples.length === 0) {
      return null;
    }

    const lastSample = record.samples[record.samples.length - 1];
    return lastSample.status === "error" ? lastSample.error : null;
  }

  public getAllNetworks(): Array<{ network: string; endpoint: string }> {
    return Array.from(this.records.values()).map(record => ({
      network: record.network,
      endpoint: record.endpoint,
    }));
  }

  public clear(): void {
    this.records.clear();
  }
}

// 싱글톤 인스턴스
export const latencyStorage = new LatencyStorage();
