# Architecture

This document describes the architecture of the system and the main design decisions.

## Overview

Crypto Market Insights is a full-stack web application that combines real-time cryptocurrency price data with sentiment analysis from news sources. The backend uses a hexagonal architecture pattern to keep business logic separate from external dependencies, while the frontend follows a feature-based structure for better organization.

## System Context

At the highest level, the system interacts with users who want to understand market context for cryptocurrencies. It fetches price data from CoinGecko and news from CryptoPanic, then analyzes sentiment to provide a complete market view.

See [System Context Diagram](docs/architecture/system-context.md) for a visual representation.

## Containers

The system consists of three main parts:

1. **React SPA** - The frontend dashboard that users interact with
2. **Node.js API** - The backend server that handles requests and coordinates data fetching
3. **External APIs** - CoinGecko for prices and CryptoPanic for news

The frontend communicates with the backend via REST API, and the backend fetches data from external services.

See [Container Diagram](docs/architecture/containers.md) for details.

## Backend Architecture

The backend uses hexagonal architecture (also known as Ports & Adapters). This pattern separates business logic from external concerns like HTTP and API calls.

The architecture has these layers:

- **Domain Layer** - Pure business logic with no external dependencies. Contains entities like `CryptoAsset`, value objects like `SentimentScore`, and domain services like `SentimentAnalyzer`.

- **Application Layer** - Use cases that orchestrate business operations. For example, `GetCryptoMarketContext` coordinates fetching prices, news, and analyzing sentiment.

- **Ports** - Interfaces that define what the system needs from the outside world, like `CryptoPriceProvider` and `NewsProvider`. These are contracts, not implementations.

- **Adapters** - Implementations of the ports. `CoinGeckoAdapter` implements `CryptoPriceProvider`, and `CryptoPanicAdapter` implements `NewsProvider`. There are also mock adapters for development and testing.

- **Infrastructure** - Configuration, dependency injection container, and middleware. The container wires everything together.

This structure makes it easy to swap implementations (like using mocks instead of real APIs) without changing business logic. It also makes testing simpler since you can inject mock dependencies.

## Frontend Architecture

The frontend uses a feature-based structure inspired by Bulletproof React. Each feature is self-contained with its own API functions, components, hooks, and types.

The main feature is `crypto`, which includes:
- API functions for fetching data
- React components like `AssetCard`, `SentimentCard`, and `NewsList`
- Custom hooks like `useCryptoContext` that use React Query
- TypeScript types for type safety

Shared components like `DashboardLayout` live in the `components` directory, and page components are in `pages`.

React Query handles server state management, caching, and automatic refetching. The API client is centralized in `lib/api-client.ts` with error handling interceptors.

## Module Structure

The backend modules are organized by architectural layers. HTTP adapters (controllers and routes) handle incoming requests and delegate to use cases. Use cases coordinate domain services and external adapters. The domain layer contains pure business logic.

The frontend modules are organized by features. Each feature contains everything it needs to function independently.

See [Module Structure Diagram](docs/architecture/modules.md) for a visual breakdown.

## Request Flow

When a user views the dashboard:

1. The React app calls `useCryptoContext` hook, which uses React Query
2. React Query makes an HTTP request to `/api/crypto/:assetId/context`
3. The Express router matches the route and calls the controller
4. The controller extracts parameters and calls the use case
5. The use case (`GetCryptoMarketContext`) coordinates:
   - Fetching price from `CoinGeckoAdapter`
   - Fetching news from `CryptoPanicAdapter`
   - Analyzing sentiment using `SentimentAnalyzer`
6. The use case combines everything and returns the result
7. The controller formats the response as JSON
8. React Query caches the response and updates the UI

See [Data Flow Diagram](docs/architecture/data-flow.md) for a detailed view.

## Design Decisions

The main architectural decision was using hexagonal architecture for the backend. This was chosen to keep business logic testable and independent of external services. See [ADR-001](docs/adr/0001-hexagonal-architecture.md) for more details.

For the frontend, React Query was chosen over alternatives like Redux because it handles server state, caching, and refetching out of the box, which fits well with this API-driven application.

The sentiment analysis uses a simple keyword-based approach rather than machine learning models. This is a pragmatic choice for an MVP that can be improved later if needed.
