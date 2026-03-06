/**
 * useCryptoNews Hook
 * React Query hook for fetching crypto news
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoNews } from '../api/crypto-api';
import type { NewsResponse } from '../types';

export const useCryptoNews = (assetId: string, limit?: number) => {
  return useQuery<NewsResponse, Error>({
    queryKey: ['crypto', 'news', assetId, limit],
    queryFn: () => getCryptoNews(assetId, limit),
    enabled: !!assetId,
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
  });
};
