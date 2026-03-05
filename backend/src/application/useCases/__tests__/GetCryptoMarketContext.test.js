/**
 * GetCryptoMarketContext Use Case Tests
 * Tests the main use case with mocked dependencies
 */

const GetCryptoMarketContext = require('../GetCryptoMarketContext');

describe('GetCryptoMarketContext', () => {
  let useCase;
  let mockPriceProvider;
  let mockNewsProvider;
  let mockSentimentAnalyzer;

  beforeEach(() => {
    // Mock price provider
    mockPriceProvider = {
      getPrice: jest.fn().mockResolvedValue({
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43250.50,
        change24h: 2.45
      })
    };

    // Mock news provider
    mockNewsProvider = {
      getLatest: jest.fn().mockResolvedValue([
        {
          title: 'Bitcoin Reaches New High',
          source: 'CryptoNews',
          publishedAt: new Date().toISOString(),
          url: 'https://example.com/news/1'
        },
        {
          title: 'Institutional Adoption Grows',
          source: 'CoinDesk',
          publishedAt: new Date().toISOString(),
          url: 'https://example.com/news/2'
        }
      ])
    };

    // Mock sentiment analyzer
    mockSentimentAnalyzer = {
      analyze: jest.fn().mockResolvedValue({
        sentiment: { toString: () => 'positive' },
        score: 0.65,
        confidence: 0.8
      })
    };

    // Create use case instance
    useCase = new GetCryptoMarketContext(
      mockPriceProvider,
      mockNewsProvider,
      mockSentimentAnalyzer
    );
  });

  describe('execute', () => {
    it('should return complete market context', async () => {
      const result = await useCase.execute('bitcoin');

      // Verify structure
      expect(result).toHaveProperty('asset');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('headlines');
      expect(result).toHaveProperty('timestamp');

      // Verify asset data
      expect(result.asset).toEqual({
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43250.50,
        change24h: 2.45
      });

      // Verify sentiment
      expect(result.sentiment.value).toBe('positive');
      expect(result.sentiment.score).toBe(0.65);

      // Verify headlines
      expect(result.headlines).toHaveLength(2);
      expect(result.headlines[0]).toHaveProperty('title');
      expect(result.headlines[0]).toHaveProperty('source');
    });

    it('should call all providers with correct parameters', async () => {
      await useCase.execute('bitcoin', { newsLimit: 5 });

      // Verify price provider was called
      expect(mockPriceProvider.getPrice).toHaveBeenCalledWith('bitcoin');
      expect(mockPriceProvider.getPrice).toHaveBeenCalledTimes(1);

      // Verify news provider was called
      expect(mockNewsProvider.getLatest).toHaveBeenCalledWith('bitcoin', 5);
      expect(mockNewsProvider.getLatest).toHaveBeenCalledTimes(1);

      // Verify sentiment analyzer was called
      expect(mockSentimentAnalyzer.analyze).toHaveBeenCalledTimes(1);
      expect(mockSentimentAnalyzer.analyze).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: expect.any(String) })
        ])
      );
    });

    it('should use default news limit if not provided', async () => {
      await useCase.execute('bitcoin');

      expect(mockNewsProvider.getLatest).toHaveBeenCalledWith('bitcoin', 10);
    });

    it('should throw error if assetId is missing', async () => {
      await expect(useCase.execute()).rejects.toThrow('assetId is required');
      await expect(useCase.execute(null)).rejects.toThrow('assetId is required');
      await expect(useCase.execute('')).rejects.toThrow('assetId is required');
    });

    it('should handle errors from price provider', async () => {
      mockPriceProvider.getPrice.mockRejectedValue(
        new Error('Price provider failed')
      );

      await expect(useCase.execute('bitcoin')).rejects.toThrow(
        'Failed to get market context for bitcoin'
      );
    });

    it('should handle errors from news provider', async () => {
      mockNewsProvider.getLatest.mockRejectedValue(
        new Error('News provider failed')
      );

      await expect(useCase.execute('bitcoin')).rejects.toThrow(
        'Failed to get market context for bitcoin'
      );
    });

    it('should handle errors from sentiment analyzer', async () => {
      mockSentimentAnalyzer.analyze.mockRejectedValue(
        new Error('Sentiment analysis failed')
      );

      await expect(useCase.execute('bitcoin')).rejects.toThrow(
        'Failed to get market context for bitcoin'
      );
    });
  });

  describe('constructor', () => {
    it('should throw error if priceProvider is missing', () => {
      expect(() => {
        new GetCryptoMarketContext(null, mockNewsProvider, mockSentimentAnalyzer);
      }).toThrow('priceProvider is required');
    });

    it('should throw error if newsProvider is missing', () => {
      expect(() => {
        new GetCryptoMarketContext(mockPriceProvider, null, mockSentimentAnalyzer);
      }).toThrow('newsProvider is required');
    });

    it('should throw error if sentimentAnalyzer is missing', () => {
      expect(() => {
        new GetCryptoMarketContext(mockPriceProvider, mockNewsProvider, null);
      }).toThrow('sentimentAnalyzer is required');
    });
  });
});
