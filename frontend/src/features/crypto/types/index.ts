/**
 * Crypto Feature Types
 * TypeScript types for the crypto feature
 */

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  updatedAt?: string;
}

export interface Sentiment {
  value: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
}

export interface NewsHeadline {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface MarketContext {
  asset: CryptoAsset;
  sentiment: Sentiment;
  headlines: NewsHeadline[];
  meta?: {
    newsCount?: number;
  };
  timestamp: string;
}

export interface NewsResponse {
  asset: string;
  headlines: NewsHeadline[];
  meta?: {
    newsCount?: number;
  };
  timestamp: string;
}

export interface SentimentResponse {
  asset: string;
  sentiment: Sentiment;
  meta?: {
    newsAnalyzed?: number;
  };
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
