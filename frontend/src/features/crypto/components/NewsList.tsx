/**
 * NewsList Component
 * Displays a list of cryptocurrency news headlines
 */

import type { NewsHeadline } from '../types';

interface NewsListProps {
  headlines: NewsHeadline[];
  isLoading?: boolean;
}

export const NewsList = ({ headlines, isLoading }: NewsListProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-lg border border-dark-border p-5">
        <h3 className="text-sm font-medium text-dark-text-muted uppercase tracking-wide mb-4">
          Latest News
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-dark-surface rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-dark-surface rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (headlines.length === 0) {
    return (
      <div className="bg-dark-card rounded-lg border border-dark-border p-5">
        <h3 className="text-sm font-medium text-dark-text-muted uppercase tracking-wide mb-4">
          Latest News
        </h3>
        <p className="text-sm text-dark-text-muted">No news available</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-dark-text-muted uppercase tracking-wide">
          Latest News
        </h3>
        <span className="text-xs text-dark-text-muted">
          {headlines.length} {headlines.length === 1 ? 'article' : 'articles'}
        </span>
      </div>
      
      <div className="divide-y divide-dark-border">
        {headlines.map((headline, index) => (
          <a
            key={headline.id}
            href={headline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-dark-text group-hover:text-primary-accent transition-colors mb-1.5 line-clamp-2">
                  {headline.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-dark-text-muted">
                  <span>{headline.source}</span>
                  <span>·</span>
                  <span>{formatTime(headline.publishedAt)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
