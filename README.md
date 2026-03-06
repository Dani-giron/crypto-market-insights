# Crypto Market Insights

A web dashboard that combines cryptocurrency market data with sentiment analysis to help interpret market context.

This project focuses on analysis and interpretation, not price prediction or trading signals.

## What It Does

The dashboard displays:
- Current cryptocurrency prices and 24-hour changes
- Market sentiment analysis based on recent news
- Latest news headlines with sentiment indicators
- Support for multiple cryptocurrencies (Bitcoin, Ethereum, Cardano, Solana)

## Features

- Real-time price data from CoinGecko API
- News aggregation from CryptoPanic
- Sentiment analysis using keyword-based classification
- Auto-refreshing dashboard (updates every minute)
- Dark theme UI inspired by modern crypto analytics platforms

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for server state management
- React Router for navigation

**Backend:**
- Node.js with Express
- Hexagonal Architecture (Ports & Adapters)
- Axios for HTTP requests
- OpenAPI documentation with Scalar

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cripto
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

**Backend:**
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
NODE_ENV=development
CRYPTOPANIC_API_KEY=your_api_key_here  # Optional
USE_MOCK_PROVIDERS=false  # Set to true for mock data
```

**Frontend:**
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The dashboard will be available at `http://localhost:5173` (or the port Vite assigns)

## Architecture

The system uses a hexagonal architecture pattern for the backend and a feature-based structure for the frontend.

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## Project Structure

```
cripto/
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── domain/    # Business logic
│   │   ├── application/  # Use cases
│   │   ├── ports/     # Interfaces
│   │   ├── adapters/  # Implementations
│   │   └── infrastructure/  # Configuration
│   └── docs/          # OpenAPI specification
├── frontend/          # React application
│   └── src/
│       ├── features/  # Feature modules
│       ├── components/  # Shared components
│       └── pages/     # Page components
└── docs/             # Architecture documentation
```

## Development

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

API documentation is available at `http://localhost:3000/docs` when the server is running.

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Documentation

Interactive API documentation is available at:
- Development: `http://localhost:3000/docs`

The OpenAPI specification is located at `backend/docs/openapi.yaml`.

## License

ISC
