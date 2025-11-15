import { PublicClient, createPublicClient, http } from "viem";

export interface BlockTimestampClockSource {
  readonly endpoint: string;
  fetchLatestBlockTimestamp(): Promise<number>;
}

export class ViemPublicClientClockSource implements BlockTimestampClockSource {
  constructor(
    private readonly client: PublicClient,
    private readonly rpcEndpoint: string,
  ) {}

  public get endpoint(): string {
    return this.rpcEndpoint;
  }

  public async fetchLatestBlockTimestamp(): Promise<number> {
    const block = await this.client.getBlock({ blockTag: "latest" });

    if (block.timestamp == null) {
      throw new Error("Block timestamp unavailable");
    }

    return Number(block.timestamp);
  }
}

export const createViemClockSource = (endpoint: string): BlockTimestampClockSource => {
  const client = createPublicClient({
    transport: http(endpoint),
  });

  return new ViemPublicClientClockSource(client, endpoint);
};
