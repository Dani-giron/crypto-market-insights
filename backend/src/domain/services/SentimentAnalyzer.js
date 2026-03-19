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

    // Use community votes when available (more reliable than keywords)
    if (newsItem.votes && this._hasVoteSignal(newsItem.votes)) {
      return this._analyzeByVotes(newsItem.votes);
    }

    // Fallback: keyword-based analysis
    const text = `${newsItem.title || ''} ${newsItem.content || ''}`.toLowerCase();

    const positiveMatches = this._countMatches(text, POSITIVE_KEYWORDS);
    const negativeMatches = this._countMatches(text, NEGATIVE_KEYWORDS);

    let sentiment;
    let score;
    let confidence;

    if (positiveMatches > negativeMatches) {
      sentiment = SentimentScore.positive();
      score = 0.5 + (positiveMatches / 10);
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
      const result = await this.analyzeItem(item);
      if (result.sentiment.isPositive()) {
        positiveCount++;
      } else if (result.sentiment.isNegative()) {
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
   * Checks if votes object has enough signal to use
   * @private
   */
  _hasVoteSignal(votes) {
    const total = (votes.positive || 0) + (votes.negative || 0) + (votes.liked || 0) + (votes.disliked || 0);
    return total >= 3; // Minimum votes to consider reliable
  }

  /**
   * Analyzes sentiment from community votes
   * @private
   */
  _analyzeByVotes(votes) {
    const positiveSignal = (votes.positive || 0) + (votes.liked || 0);
    const negativeSignal = (votes.negative || 0) + (votes.disliked || 0);
    const total = positiveSignal + negativeSignal;

    if (total === 0) {
      return { sentiment: SentimentScore.neutral(), score: 0, confidence: 0.5 };
    }

    const positiveRatio = positiveSignal / total;
    const negativeRatio = negativeSignal / total;
    const confidence = Math.min(1, total / 20); // More votes = higher confidence, max at 20 votes

    if (positiveRatio > 0.55) {
      return {
        sentiment: SentimentScore.positive(),
        score: Math.round(positiveRatio * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      };
    } else if (negativeRatio > 0.55) {
      return {
        sentiment: SentimentScore.negative(),
        score: Math.round(-negativeRatio * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      };
    } else {
      return {
        sentiment: SentimentScore.neutral(),
        score: Math.round((positiveRatio - negativeRatio) * 100) / 100,
        confidence: Math.round(confidence * 0.7 * 100) / 100 // Lower confidence for ambiguous
      };
    }
  }

  /**
   * Counts keyword matches in text
   * @private
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
