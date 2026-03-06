# Crypto Market Insights - Frontend

Frontend application for Crypto Market Insights built with React, TypeScript, and Tailwind CSS following the Bulletproof React architecture.

For a complete overview of the system architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md) in the root directory.

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack Query)** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📁 Project Structure

Following **Bulletproof React** architecture:

```
src/
├── app/                    # App configuration
├── features/               # Feature modules
│   └── crypto/            # Crypto feature
│       ├── api/           # API functions
│       ├── components/    # Feature-specific components
│       ├── hooks/         # Custom React hooks
│       └── types/         # TypeScript types
├── components/            # Shared components
│   └── layouts/          # Layout components
├── pages/                # Page components
├── lib/                  # Shared utilities
│   └── api-client.ts    # Axios instance
└── main.tsx             # Entry point
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🎨 Features

### Crypto Dashboard

- **Asset Card**: Displays cryptocurrency name, symbol, current price, and 24h change
- **Sentiment Card**: Shows market sentiment analysis (positive/neutral/negative) with score and confidence
- **News List**: Displays latest news headlines with sentiment indicators
- **Real-time Updates**: Auto-refreshes data every minute
- **Asset Selector**: Switch between different cryptocurrencies (Bitcoin, Ethereum, Cardano, Solana)

### Design

- **Dark Theme**: Inspired by Messari's clean crypto analytics UI
- **Responsive**: Works on desktop and mobile devices
- **Modern UI**: Clean cards, large typography, subtle animations

## 📡 API Integration

The frontend consumes the following backend endpoints:

- `GET /api/crypto/:assetId/context` - Market context (price, sentiment, news)
- `GET /api/crypto/:assetId/news` - News headlines
- `GET /api/crypto/:assetId/sentiment` - Sentiment analysis

All API calls are handled through React Query hooks:

- `useCryptoContext(assetId)` - Fetch market context
- `useCryptoNews(assetId, limit?)` - Fetch news
- `useCryptoSentiment(assetId, limit?)` - Fetch sentiment

## 🏗️ Architecture

### Bulletproof React Principles

1. **Feature-based organization**: Each feature is self-contained
2. **Separation of concerns**: API, components, hooks, and types are separated
3. **Reusability**: Shared components in `components/` directory
4. **Type safety**: Full TypeScript coverage
5. **Data fetching**: React Query for server state management

### Component Structure

```
features/crypto/
├── api/              # API functions (pure, no React)
├── components/       # Feature-specific UI components
├── hooks/           # React Query hooks
└── types/           # TypeScript interfaces
```

## 🎯 Supported Assets

Currently supports:
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Solana (SOL)

More assets can be added by updating the `SUPPORTED_ASSETS` array in `CryptoDashboardPage.tsx`.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Backend

Make sure the backend API is running on `http://localhost:3000` (or update `VITE_API_BASE_URL` in `.env`).

See the backend README for more information.
