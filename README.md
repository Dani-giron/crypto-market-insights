# Crypto Market Insights

A web dashboard that combines **crypto market data** with **sentiment analysis** to help interpret market context.

> This project focuses on **analysis and interpretation**, not price prediction or trading signals.

---

##  Goal
Provide a clear and structured view of:
- Market price and basic metrics
- News-driven sentiment
- Contextual signals to support human decision-making

---

##  What this project does NOT do
- It does not predict prices
- It does not generate buy/sell signals
- It does not attempt to beat the market

---

##  High-level Architecture
- **Frontend**: Web dashboard (React)
- **Backend**: REST API (Node.js)
- **Data sources**:
  - Public crypto price APIs
  - News or headlines feeds
- **Analysis**:
  - Basic sentiment classification (NLP)

---

##  MVP Scope
- Single crypto asset (e.g. Bitcoin)
- Current price and 24h change
- List of recent headlines
- Simple sentiment indicator (positive / neutral / negative)

---

##  Roadmap
**Phase 1 – MVP**
- Backend API with mock data
- Basic frontend dashboard
- Simple sentiment logic

**Phase 2**
- Historical sentiment
- Multiple assets
- Correlation between sentiment and price

**Phase 3**
- Narrative and trend detection
- Alerts and summaries

---

##  Notes
This project is built as a **portfolio piece**, with emphasis on:
- Clean architecture
- Clear documentation
- Reasonable technical trade-offs
