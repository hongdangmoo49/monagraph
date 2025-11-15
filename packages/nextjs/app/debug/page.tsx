import { Suspense } from "react";
import { DebugContracts } from "./_components/DebugContracts";
import { RpcLatencySection } from "./_components/RpcLatencySection";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const RpcLatencySkeleton = () => (
  <section className="mt-8 px-6 py-8 bg-base-200 rounded-3xl">
    <header className="mb-6 text-left">
      <p className="text-sm uppercase tracking-wider text-secondary">Network Observability</p>
      <h2 className="text-3xl font-bold">RPC Latency Snapshot</h2>
    </header>
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
  </section>
);

const Debug = async () => {
  return (
    <>
      <DebugContracts />
      <Suspense fallback={<RpcLatencySkeleton />}>
        <RpcLatencySection />
      </Suspense>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
