/**
 * AssetCard Component
 * Displays cryptocurrency asset information (name, symbol, price, 24h change)
 */

import type { CryptoAsset } from '../types';

interface AssetCardProps {
  asset: CryptoAsset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const isPositive = asset.change24h >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">{asset.name}</h2>
          <p className="text-dark-text-muted text-sm mt-1">{asset.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-dark-text">
            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={`flex items-center gap-1 mt-1 ${changeColor}`}>
            <span className="text-sm font-semibold">
              {changeIcon} {Math.abs(asset.change24h).toFixed(2)}%
            </span>
            <span className="text-xs text-dark-text-muted">24h</span>
          </div>
        </div>
      </div>
      {asset.updatedAt && (
        <p className="text-xs text-dark-text-muted mt-4">
          Updated: {new Date(asset.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};
