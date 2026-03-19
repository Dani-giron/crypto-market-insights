import type { CryptoAsset } from '../types';

interface AssetCardProps {
  asset: CryptoAsset;
}

const COIN_ICONS: Record<string, string> = {
  bitcoin:  '₿',
  ethereum: 'Ξ',
  cardano:  '₳',
  solana:   '◎',
};

/** Generates a simple decorative sparkline path from 24h change direction */
function buildSparkline(change24h: number): { line: string; fill: string } {
  const W = 600, H = 64, PAD = 4;
  const pts: number[] = [];
  const n = 28;
  const trend = change24h / 100;

  // Seed a pseudo-random walk biased by the trend
  let val = 50;
  for (let i = 0; i < n; i++) {
    const noise = (Math.sin(i * 2.5) * 8) + (Math.cos(i * 1.3) * 5);
    val += trend * 3 + noise * 0.4;
    pts.push(val);
  }

  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const xs = pts.map((_, i) => (i / (n - 1)) * W);
  const ys = pts.map(p => PAD + (1 - (p - min) / range) * (H - PAD * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return { line: d, fill: `${d} L${W},${H} L0,${H} Z` };
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const isPositive = asset.change24h >= 0;
  const spark = buildSparkline(asset.change24h);
  const icon = COIN_ICONS[asset.id] ?? asset.symbol.charAt(0);

  return (
    <div className="relative bg-surface border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 overflow-hidden transition-colors hover:border-[rgba(255,255,255,0.12)]">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      {/* Coin identity */}
      <div className="flex items-center gap-3.5 mb-7">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/15 to-accent2/15 border border-accent/20 flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold">{asset.name}</div>
          <div className="font-mono text-[11px] text-ink-muted tracking-[0.1em] mt-0.5">
            {asset.symbol} / USD
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-5 mb-1">
        <span className="text-[48px] font-extrabold tracking-[-0.04em] leading-none tabular-nums animate-count-up">
          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}
        </span>
        <span className={`font-mono text-[13px] font-medium px-2.5 py-1 rounded-md border ${
          isPositive
            ? 'bg-green/10 text-green border-green/20'
            : 'bg-red/10 text-red border-red/20'
        }`}>
          {isPositive ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
        </span>
      </div>
      <div className="font-mono text-[10px] text-ink-muted tracking-[0.15em] uppercase mb-6">
        24H Change
      </div>

      {/* Sparkline */}
      <div className="border-t border-[rgba(255,255,255,0.06)] pt-6">
        <div className="font-mono text-[10px] text-ink-muted tracking-[0.15em] uppercase mb-3">
          7-Day Trend
        </div>
        <svg viewBox="0 0 600 64" preserveAspectRatio="none" className="w-full h-16">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={spark.fill} fill="url(#sg)" />
          <path d={spark.line} fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 mt-5 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
        <div className="bg-surface2 px-5 py-3.5">
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-1.5">Symbol</div>
          <div className="font-mono text-sm font-medium">{asset.symbol}</div>
        </div>
        <div className="bg-surface2 px-5 py-3.5 border-l border-[rgba(255,255,255,0.06)]">
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-1.5">Updated</div>
          <div className="font-mono text-sm font-medium">
            {asset.updatedAt ? new Date(asset.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
