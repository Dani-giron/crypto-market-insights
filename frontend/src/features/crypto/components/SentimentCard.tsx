import type { Sentiment } from '../types';

interface SentimentCardProps {
  sentiment: Sentiment;
  newsCount: number;
}

const SENTIMENT_LABEL: Record<string, string> = {
  positive: 'Bullish',
  neutral:  'Neutral',
  negative: 'Bearish',
};

const SENTIMENT_COLOR: Record<string, string> = {
  positive: 'text-green',
  neutral:  'text-gold',
  negative: 'text-red',
};

export const SentimentCard = ({ sentiment, newsCount }: SentimentCardProps) => {
  // Map score (-1 to 1) → meter width (5% to 95%)
  const meterPct = Math.round(((sentiment.score + 1) / 2) * 90 + 5);
  const confPct   = Math.round(sentiment.confidence * 100);
  const label     = SENTIMENT_LABEL[sentiment.value] ?? 'Neutral';
  const color     = SENTIMENT_COLOR[sentiment.value] ?? 'text-gold';

  return (
    <div className="bg-surface border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex flex-col transition-colors hover:border-[rgba(255,255,255,0.12)]">
      <div className="font-mono text-[9px] tracking-[0.2em] text-ink-muted uppercase mb-5">
        Market Sentiment
      </div>

      {/* Main sentiment value */}
      <div className={`text-[32px] font-extrabold mb-1.5 ${color}`}>{label}</div>
      <div className="font-mono text-[11px] text-ink-muted mb-6">
        Based on {newsCount} headlines
      </div>

      {/* Meter */}
      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red via-gold to-green transition-all duration-700"
          style={{ width: `${meterPct}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9px] text-ink-muted mb-7">
        <span>FEAR</span>
        <span>NEUTRAL</span>
        <span>GREED</span>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.06)] mb-6" />

      {/* Score + Confidence */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-1.5">Score</div>
          <div className="font-mono text-[22px] font-medium tabular-nums">
            {sentiment.score >= 0 ? '+' : ''}{sentiment.score.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-1.5">Confidence</div>
          <div className="font-mono text-[22px] font-medium tabular-nums">{confPct}%</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-2">Confidence Level</div>
        <div className="h-0.5 bg-surface2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full shadow-[0_0_8px_#00e5ff] transition-all duration-700"
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.06)] mt-6 mb-6" />

      {/* Signal breakdown from real data */}
      <div>
        <div className="font-mono text-[9px] tracking-[0.18em] text-ink-muted uppercase mb-3">Signal Breakdown</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-ink-muted">News volume</span>
            <span className={newsCount >= 5 ? 'text-green' : newsCount >= 2 ? 'text-gold' : 'text-red'}>
              {newsCount >= 5 ? 'Strong' : newsCount >= 2 ? 'Moderate' : 'Weak'}
            </span>
          </div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-ink-muted">Score magnitude</span>
            <span className={Math.abs(sentiment.score) > 0.5 ? (sentiment.score > 0 ? 'text-green' : 'text-red') : 'text-gold'}>
              {Math.abs(sentiment.score) > 0.5 ? (sentiment.score > 0 ? 'Bullish' : 'Bearish') : 'Neutral'}
            </span>
          </div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-ink-muted">Confidence</span>
            <span className={confPct >= 70 ? 'text-green' : confPct >= 40 ? 'text-gold' : 'text-red'}>
              {confPct >= 70 ? 'High' : confPct >= 40 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
