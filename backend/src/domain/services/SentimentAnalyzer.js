/**
 * SentimentAnalyzer Domain Service
 * Pure domain logic for sentiment analysis
 * 
 * This is a domain service - it contains business logic without external dependencies.
 * It implements the SentimentAnalyzer port.
 */

const SentimentScore = require('../valueObjects/SentimentScore');

// Keywords for sentiment classification (simple MVP approach)
const POSITIVE_KEYWORDS = [
  'bullish', 'surge', 'rally', 'gain', 'rise', 'up', 'growth',
  'adoption', 'partnership', 'launch', 'breakthrough', 'success',
  'positive', 'optimistic', 'strong', 'record', 'high'
];

const NEGATIVE_KEYWORDS = [
  'bearish', 'crash', 'drop', 'fall', 'decline', 'down', 'loss',
  'ban', 'regulation', 'hack', 'scam', 'fraud', 'negative',
  'pessimistic', 'weak', 'low', 'concern', 'risk', 'warning'
];

class SentimentAnalyzer {
  /**
   * Analyzes sentiment for a single news item
   * @param {Object} newsItem - News item with title/content
   * @returns {Object} Sentiment analysis result for the item
   */
  async analyzeItem(newsItem) {
    if (!newsItem) {
      return {
        sentiment: SentimentScore.neutral(),
        score: 0,
        confidence: 0
      };
    }

    const text = `${newsItem.title || ''} ${newsItem.content || ''}`.toLowerCase();
    
    const positiveMatches = this._countMatches(text, POSITIVE_KEYWORDS);
    const negativeMatches = this._countMatches(text, NEGATIVE_KEYWORDS);

    let sentiment;
    let score;
    let confidence;

    if (positiveMatches > negativeMatches) {
      sentiment = SentimentScore.positive();
      score = 0.5 + (positiveMatches / 10); // Scale based on matches
      confidence = Math.min(1, (positiveMatches - negativeMatches) / 5);
    } else if (negativeMatches > positiveMatches) {
      sentiment = SentimentScore.negative();
      score = -0.5 - (negativeMatches / 10);
      confidence = Math.min(1, (negativeMatches - positiveMatches) / 5);
    } else {
      sentiment = SentimentScore.neutral();
      score = 0;
      confidence = 0.5;
    }

    return {
      sentiment,
      score: Math.round(score * 100) / 100,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  /**
   * Analyzes sentiment from news items
   * @param {Array} newsItems - Array of news items with title/content
   * @returns {Object} Sentiment analysis result
   */
  async analyze(newsItems) {
    if (!newsItems || newsItems.length === 0) {
      return {
        sentiment: SentimentScore.neutral(),
        score: 0,
        confidence: 0
      };
    }

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    // Analyze each news item
    for (const item of newsItems) {
      const text = `${item.title || ''} ${item.content || ''}`.toLowerCase();
      
      const positiveMatches = this._countMatches(text, POSITIVE_KEYWORDS);
      const negativeMatches = this._countMatches(text, NEGATIVE_KEYWORDS);

      if (positiveMatches > negativeMatches) {
        positiveCount++;
      } else if (negativeMatches > positiveMatches) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    }

    // Determine overall sentiment
    const total = newsItems.length;
    const positiveRatio = positiveCount / total;
    const negativeRatio = negativeCount / total;

    let sentiment;
    let score;
    let confidence;

    if (positiveRatio > negativeRatio && positiveRatio > 0.4) {
      sentiment = SentimentScore.positive();
      score = positiveRatio;
      confidence = Math.abs(positiveRatio - negativeRatio);
    } else if (negativeRatio > positiveRatio && negativeRatio > 0.4) {
      sentiment = SentimentScore.negative();
      score = -negativeRatio;
      confidence = Math.abs(negativeRatio - positiveRatio);
    } else {
      sentiment = SentimentScore.neutral();
      score = 0;
      confidence = 1 - Math.abs(positiveRatio - negativeRatio);
    }

    return {
      sentiment,
      score: Math.round(score * 100) / 100, // Round to 2 decimals
      confidence: Math.round(confidence * 100) / 100
    };
  }

  /**
   * Counts keyword matches in text
   * @private
   * @param {string} text - Text to search
   * @param {Array<string>} keywords - Keywords to match
   * @returns {number} Number of matches
   */
  _countMatches(text, keywords) {
    return keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }
}

module.exports = SentimentAnalyzer;
