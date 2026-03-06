/**
 * useCryptoSentiment Hook
 * React Query hook for fetching crypto sentiment
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoSentiment } from '../api/crypto-api';
import type { SentimentResponse } from '../types';

export const useCryptoSentiment = (assetId: string, limit?: number) => {
  return useQuery<SentimentResponse, Error>({
    queryKey: ['crypto', 'sentiment', assetId, limit],
    queryFn: () => getCryptoSentiment(assetId, limit),
    enabled: !!assetId,
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
  });
};
