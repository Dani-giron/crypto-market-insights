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
    <div className="space-y-6">
      {/* Asset Selector */}
      <div className="bg-dark-card rounded-lg border border-dark-border p-4">
        <label className="block text-sm font-medium text-dark-text mb-2">
          Select Cryptocurrency
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_ASSETS.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAsset === asset.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-surface text-dark-text hover:bg-dark-border'
              }`}
            >
              {asset.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-dark-text-muted mt-4">Loading market data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
          <p className="text-dark-text-muted">
            {error.message || 'Failed to load market data. Please try again.'}
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      {data && (
        <div className="space-y-6">
          {/* Status Indicator */}
          {isFetching && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-400">Refreshing data...</p>
            </div>
          )}

          {/* Asset and Sentiment Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetCard asset={data.asset} />
            <SentimentCard sentiment={data.sentiment} />
          </div>

          {/* News List */}
          <NewsList headlines={data.headlines} isLoading={isLoading} />

          {/* Timestamp */}
          <div className="text-center">
            <p className="text-xs text-dark-text-muted">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
