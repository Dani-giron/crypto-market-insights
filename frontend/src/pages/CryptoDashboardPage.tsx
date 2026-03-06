/**
 * CryptoDashboardPage
 * Main dashboard page displaying crypto market context
 */

import { useState } from 'react';
import { AssetCard } from '../features/crypto/components/AssetCard';
import { SentimentCard } from '../features/crypto/components/SentimentCard';
import { NewsList } from '../features/crypto/components/NewsList';
import { useCryptoContext } from '../features/crypto/hooks/useCryptoContext';

const DEFAULT_ASSET = 'bitcoin';
const SUPPORTED_ASSETS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

export const CryptoDashboardPage = () => {
  const [selectedAsset, setSelectedAsset] = useState(DEFAULT_ASSET);
  const { data, isLoading, error, isFetching } = useCryptoContext(selectedAsset);

  return (
    <div className="space-y-4">
      {/* Asset Selector - Segmented Control */}
      <div className="inline-flex bg-dark-surface border border-dark-border rounded-lg p-1">
        {SUPPORTED_ASSETS.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset.id)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors rounded ${
              selectedAsset === asset.id
                ? 'bg-dark-border text-dark-text'
                : 'text-dark-text-muted hover:text-dark-text'
            }`}
          >
            {asset.symbol}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-dark-border border-t-primary-accent"></div>
          <p className="text-sm text-dark-text-muted mt-3">Loading market data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-dark-text mb-1">Error</h3>
          <p className="text-sm text-dark-text-muted">
            {error.message || 'Failed to load market data. Please try again.'}
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      {data && (
        <div className="space-y-4">
          {/* Status Indicator */}
          {isFetching && (
            <div className="bg-dark-surface border border-dark-border rounded-lg p-2 text-center">
              <p className="text-xs text-dark-text-muted">Refreshing data...</p>
            </div>
          )}

          {/* Asset and Sentiment Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AssetCard asset={data.asset} />
            <SentimentCard sentiment={data.sentiment} />
          </div>

          {/* News List */}
          <NewsList headlines={data.headlines} isLoading={isLoading} />

          {/* Timestamp */}
          <div className="text-center pt-2">
            <p className="text-xs text-dark-text-muted">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
