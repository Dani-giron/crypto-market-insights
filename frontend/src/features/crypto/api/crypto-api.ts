/**
 * Crypto API
 * API functions for crypto-related endpoints
 */

import { apiClient } from '../../../lib/api-client';
import type {
  ApiResponse,
  MarketContext,
  NewsResponse,
  SentimentResponse,
} from '../types';

/**
 * Get market context for a cryptocurrency
 */
export const getCryptoContext = async (
  assetId: string
): Promise<MarketContext> => {
  const response = await apiClient.get<ApiResponse<MarketContext>>(
    `/api/crypto/${assetId}/context`
  );
  return response.data.data;
};

/**
 * Get news headlines for a cryptocurrency
 */
export const getCryptoNews = async (
  assetId: string,
  limit?: number
): Promise<NewsResponse> => {
  const params = limit ? { limit } : {};
  const response = await apiClient.get<ApiResponse<NewsResponse>>(
    `/api/crypto/${assetId}/news`,
    { params }
  );
  return response.data.data;
};

/**
 * Get sentiment analysis for a cryptocurrency
 */
export const getCryptoSentiment = async (
  assetId: string,
  limit?: number
): Promise<SentimentResponse> => {
  const params = limit ? { limit } : {};
  const response = await apiClient.get<ApiResponse<SentimentResponse>>(
    `/api/crypto/${assetId}/sentiment`,
    { params }
  );
  return response.data.data;
};
