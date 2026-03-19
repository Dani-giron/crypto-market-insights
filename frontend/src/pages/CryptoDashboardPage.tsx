import { useState, useEffect } from 'react';
import { AssetCard } from '../features/crypto/components/AssetCard';
import { SentimentCard } from '../features/crypto/components/SentimentCard';
import { NewsList } from '../features/crypto/components/NewsList';
import { useCryptoContext } from '../features/crypto/hooks/useCryptoContext';

const ASSETS = [
  { id: 'bitcoin',  symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'cardano',  symbol: 'ADA' },
  { id: 'solana',   symbol: 'SOL' },
];

export const CryptoDashboardPage = () => {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [clock, setClock] = useState('');
  const { data, isLoading, error } = useCryptoContext(selectedAsset);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toISOString().slice(11, 19) + ' UTC');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-start mb-12 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-accent uppercase mb-2">
            <span className="w-6 h-px bg-accent inline-block" />
            Market Analytics
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink">
            Crypto Market Insights
          </h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted tracking-wide px-4 py-2 border border-[rgba(255,255,255,0.06)] rounded-full bg-surface">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
          LIVE · {clock}
        </div>
      </header>

      {/* Asset tabs */}
      <div className="flex gap-1 mb-8 bg-surface border border-[rgba(255,255,255,0.06)] rounded-xl p-1 w-fit animate-fade-up animate-delay-100">
        {ASSETS.map(({ id, symbol }) => (
          <button
            key={id}
            onClick={() => setSelectedAsset(id)}
            className={`font-mono text-xs font-medium tracking-[0.08em] px-[22px] py-[9px] rounded-lg border transition-all duration-200 ${
              selectedAsset === id
                ? 'bg-surface2 text-accent border-accent/20 shadow-[0_0_20px_rgba(0,229,255,0.08)]'
                : 'text-ink-muted border-transparent hover:text-ink'
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-[rgba(255,255,255,0.06)] border-t-accent animate-spin" />
          <p className="font-mono text-xs text-ink-muted tracking-widest">LOADING MARKET DATA</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-surface border border-red/20 rounded-2xl p-6">
          <p className="font-mono text-xs text-red tracking-widest mb-1">ERROR</p>
          <p className="text-sm text-ink-muted">{error.message}</p>
        </div>
      )}

      {/* Main content */}
      {data && (
        <>
          {/* Price + Sentiment grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mb-4 animate-fade-up animate-delay-200">
            <AssetCard asset={data.asset} />
            <SentimentCard sentiment={data.sentiment} newsCount={data.meta?.newsCount ?? data.headlines.length} />
          </div>

          {/* News */}
          <div className="animate-fade-up animate-delay-300">
            <NewsList headlines={data.headlines} />
          </div>

          {/* Timestamp */}
          <p className="text-center font-mono text-[10px] text-ink-muted tracking-widest mt-6">
            UPDATED · {new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </>
      )}
    </>
  );
};
