/**
 * RSSNewsAdapter
 * Implementation of NewsProvider using RSS feeds from major crypto news sources.
 * No API key required - free and reliable.
 *
 * Sources: CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine
 */

const NewsProvider = require('../../ports/NewsProvider');
const RSSParser = require('rss-parser');

const RSS_FEEDS = [
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
  { url: 'https://bitcoinmagazine.com/feed', source: 'Bitcoin Magazine' },
];

const ASSET_KEYWORDS = {
  bitcoin:        ['bitcoin', 'btc'],
  ethereum:       ['ethereum', 'eth', 'ether'],
  cardano:        ['cardano', 'ada'],
  solana:         ['solana', 'sol'],
  binancecoin:    ['binance', 'bnb'],
  polkadot:       ['polkadot', 'dot'],
  'matic-network':['polygon', 'matic'],
  'avalanche-2':  ['avalanche', 'avax'],
  chainlink:      ['chainlink', 'link'],
  uniswap:        ['uniswap', 'uni'],
};

class RSSNewsAdapter extends NewsProvider {
  constructor() {
    super();
    this.parser = new RSSParser({ timeout: 8000 });
  }

  /**
   * Fetches and filters RSS news for a given cryptocurrency
   * @param {string} assetId - e.g. 'bitcoin', 'ethereum'
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getLatest(assetId, limit = 10) {
    const keywords = ASSET_KEYWORDS[assetId.toLowerCase()] || [assetId.toLowerCase()];

    // Fetch all feeds in parallel, ignore individual failures
    const feedResults = await Promise.allSettled(
      RSS_FEEDS.map(feed => this._fetchFeed(feed))
    );

    const allItems = feedResults
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    if (process.env.NODE_ENV !== 'production') {
      const failed = feedResults.filter(r => r.status === 'rejected').length;
      console.log(`📰 RSS: fetched ${allItems.length} items from ${RSS_FEEDS.length - failed}/${RSS_FEEDS.length} feeds`);
    }

    // Filter by asset keywords, sort newest first, return top N
    return allItems
      .filter(item => this._matchesAsset(item, keywords))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);
  }

  /**
   * Fetches and parses a single RSS feed
   * @private
   */
  async _fetchFeed({ url, source }) {
    const feed = await this.parser.parseURL(url);
    return (feed.items || []).map((item, index) => ({
      id: `rss-${source.toLowerCase().replace(/\s+/g, '-')}-${item.guid || index}`,
      title: item.title || 'Untitled',
      source,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      url: item.link || url,
      content: item.contentSnippet || item.content || item.title || '',
      votes: null, // RSS feeds don't have community votes
    }));
  }

  /**
   * Checks if a news item mentions the asset
   * @private
   */
  _matchesAsset(item, keywords) {
    const text = `${item.title} ${item.content}`.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  }
}

module.exports = RSSNewsAdapter;
