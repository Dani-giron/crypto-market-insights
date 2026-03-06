/**
 * SentimentCard Component
 * Displays market sentiment analysis with value, score, and confidence
 */

import type { Sentiment } from '../types';

interface SentimentCardProps {
  sentiment: Sentiment;
}

export const SentimentCard = ({ sentiment }: SentimentCardProps) => {
  const getSentimentColor = () => {
    switch (sentiment.value) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getSentimentBg = () => {
    switch (sentiment.value) {
      case 'positive':
        return 'bg-green-400/10 border-green-400/20';
      case 'negative':
        return 'bg-red-400/10 border-red-400/20';
      default:
        return 'bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment.value) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className={`bg-dark-card rounded-lg border ${getSentimentBg()} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text">Market Sentiment</h3>
        <span className="text-2xl">{getSentimentIcon()}</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-dark-text-muted mb-1">Value</p>
          <p className={`text-2xl font-bold ${getSentimentColor()} capitalize`}>
            {sentiment.value}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dark-border">
          <div>
            <p className="text-xs text-dark-text-muted mb-1">Score</p>
            <p className="text-lg font-semibold text-dark-text">
              {sentiment.score.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dark-text-muted mb-1">Confidence</p>
            <p className="text-lg font-semibold text-dark-text">
              {(sentiment.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
