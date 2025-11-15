import { Zap } from "lucide-react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export function Header() {
  return (
    <header className="border-b border-[#961DD3]/20 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[#961DD3]">
              <Zap className="w-8 h-8" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#961DD3] tracking-tight">Monagraph</h1>
              <p className="text-sm text-white/70 tracking-tight">Where Blocks Meet Speed</p>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
        <p className="mt-4 text-white/60 tracking-tight">내가 쓰는 RPC가 얼마나 빠른지, 안정적인지 시각화한다.</p>
      </div>
    </header>
  );
}
