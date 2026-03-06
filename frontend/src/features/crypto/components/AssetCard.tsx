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
  const changeColor = isPositive ? 'text-dark-text' : 'text-dark-text';

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border p-5">
      <div className="space-y-3">
        {/* Asset Name and Symbol */}
        <div>
          <h2 className="text-lg font-semibold text-dark-text">{asset.name}</h2>
          <p className="text-xs text-dark-text-muted uppercase tracking-wide mt-0.5">{asset.symbol}</p>
        </div>

        {/* Price */}
        <div>
          <p className="text-2xl font-semibold text-dark-text">
            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* 24h Change */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-dark-border">
          <span className={`text-sm font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
          </span>
          <span className="text-xs text-dark-text-muted uppercase tracking-wide">24h</span>
        </div>
      </div>
    </div>
  );
};
