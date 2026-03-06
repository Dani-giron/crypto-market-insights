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
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '🟢';
      case 'negative':
        return '🔴';
      default:
        return '🟡';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-lg border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Latest News</h3>
        <div className="space-y-4">
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
      <div className="bg-dark-card rounded-lg border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Latest News</h3>
        <p className="text-dark-text-muted text-sm">No news available</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text">Latest News</h3>
        <span className="text-xs text-dark-text-muted">
          {headlines.length} {headlines.length === 1 ? 'article' : 'articles'}
        </span>
      </div>
      
      <div className="space-y-4">
        {headlines.map((headline) => (
          <a
            key={headline.id}
            href={headline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-dark-border hover:border-dark-text-muted transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-dark-text group-hover:text-white transition-colors mb-2">
                  {headline.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-dark-text-muted">
                  <span>{headline.source}</span>
                  <span>•</span>
                  <span>
                    {new Date(headline.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              {headline.sentiment && (
                <div className={`flex items-center gap-1 ${getSentimentColor(headline.sentiment)}`}>
                  <span className="text-sm">{getSentimentIcon(headline.sentiment)}</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
