/**
 * SentimentCard Component
 * Displays market sentiment analysis with value, score, and confidence
 */

import type { Sentiment } from '../types';

interface SentimentCardProps {
  sentiment: Sentiment;
}

export const SentimentCard = ({ sentiment }: SentimentCardProps) => {
  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-5">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-sm font-medium text-dark-text-muted uppercase tracking-wide mb-3">
            Market Sentiment
          </h3>
        </div>
        
        {/* Value */}
        <div>
          <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Value</p>
          <p className="text-lg font-semibold text-dark-text capitalize">
            {sentiment.value}
          </p>
        </div>
        
        {/* Score and Confidence */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dark-border">
          <div>
            <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Score</p>
            <p className="text-base font-medium text-dark-text">
              {sentiment.score.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Confidence</p>
            <p className="text-base font-medium text-dark-text">
              {(sentiment.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
