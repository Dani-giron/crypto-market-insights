# ADR-001: Hexagonal Architecture

**Status:** Accepted

## Context

When building the backend, we needed a way to keep business logic separate from external dependencies like HTTP frameworks and third-party APIs. The system fetches data from multiple sources (CoinGecko for prices, CryptoPanic for news) and we wanted to be able to test the business logic without making real API calls. We also wanted the flexibility to swap implementations easily, like using mock data during development.

Traditional MVC or layered architectures tend to mix concerns - controllers often know about database details, and business logic can become tightly coupled to external services. This makes testing harder and changes more risky.

## Decision

We chose to use hexagonal architecture (also known as Ports & Adapters) for the backend. This pattern organizes code into layers:

- **Domain layer** - Pure business logic with no external dependencies
- **Application layer** - Use cases that orchestrate operations
- **Ports** - Interfaces that define what we need from the outside
- **Adapters** - Implementations of those interfaces (HTTP controllers, API clients, mocks)
- **Infrastructure** - Configuration and wiring

The key idea is that business logic lives in the center and doesn't depend on anything external. External concerns (like HTTP or API calls) are pushed to the edges as adapters.

## Consequences

**Positive:**
- Business logic is easy to test in isolation - you can inject mock adapters
- Changing external services doesn't require changing business logic
- The structure makes dependencies explicit and easy to understand
- Mock adapters let us develop and test without hitting real APIs

**Negative:**
- More initial setup compared to a simple MVC structure
- Requires understanding of dependency inversion and interfaces
- Slightly more files and layers to navigate

**Neutral:**
- The pattern works well for this portfolio project because it demonstrates architectural thinking
- For a larger team, this structure would make it easier for different developers to work on different layers

Overall, the benefits outweigh the costs for this project. The structure makes the codebase easier to understand and modify, and it's a good demonstration of clean architecture principles.
