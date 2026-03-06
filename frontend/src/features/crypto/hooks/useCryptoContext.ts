/**
 * useCryptoContext Hook
 * React Query hook for fetching crypto market context
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoContext } from '../api/crypto-api';
import type { MarketContext } from '../types';

export const useCryptoContext = (assetId: string) => {
  return useQuery<MarketContext, Error>({
    queryKey: ['crypto', 'context', assetId],
    queryFn: () => getCryptoContext(assetId),
    enabled: !!assetId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
