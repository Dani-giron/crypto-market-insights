import type { NewsHeadline } from '../types';

interface NewsListProps {
  headlines: NewsHeadline[];
}

function timeAgo(dateString: string): string {
  const ms = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(ms / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TAG_STYLES: Record<string, string> = {
  positive: 'bg-green/10 text-green border-green/15',
  neutral:  'bg-gold/10 text-gold border-gold/15',
  negative: 'bg-red/10 text-red border-red/15',
};

const TAG_LABEL: Record<string, string> = {
  positive: 'BULLISH',
  neutral:  'NEUTRAL',
  negative: 'BEARISH',
};

export const NewsList = ({ headlines }: NewsListProps) => {
  if (headlines.length === 0) {
    return (
      <div className="bg-surface border border-[rgba(255,255,255,0.06)] rounded-2xl p-8">
        <div className="font-mono text-[9px] tracking-[0.2em] text-ink-muted uppercase mb-5">Latest News</div>
        <p className="text-sm text-ink-muted">No news available for this asset.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-colors hover:border-[rgba(255,255,255,0.12)]">
      <div className="flex items-center justify-between mb-5">
        <div className="font-mono text-[9px] tracking-[0.2em] text-ink-muted uppercase">Latest News</div>
        <span className="font-mono text-[11px] text-ink-muted px-2.5 py-1 border border-[rgba(255,255,255,0.06)] rounded-full">
          {headlines.length} articles
        </span>
      </div>

      <div className="flex flex-col">
        {headlines.map((headline) => {
          const tag = headline.sentiment ?? 'neutral';
          const tagStyle = TAG_STYLES[tag] ?? TAG_STYLES.neutral;
          const tagLabel = TAG_LABEL[tag] ?? 'NEUTRAL';

          return (
            <a
              key={headline.id}
              href={headline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] gap-4 items-center py-4 border-b border-[rgba(255,255,255,0.06)] last:border-0 relative transition-all duration-200 hover:pl-3"
            >
              {/* Left accent bar on hover */}
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-8" />

              <div>
                <p className="text-sm font-semibold leading-snug text-ink group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {headline.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-mono text-[10px] text-accent tracking-[0.05em]">{headline.source}</span>
                  <span className="w-1 h-1 rounded-full bg-ink-muted" />
                  <span className="font-mono text-[10px] text-ink-muted">{timeAgo(headline.publishedAt)}</span>
                </div>
              </div>

              <span className={`font-mono text-[9px] tracking-[0.1em] px-2 py-1 rounded border self-start mt-0.5 whitespace-nowrap ${tagStyle}`}>
                {tagLabel}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
