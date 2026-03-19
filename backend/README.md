# Crypto Market Insights - Backend

Backend API para el proyecto portfolio "Crypto Market Insights".

For a complete overview of the system architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md) in the root directory.

## Arquitectura

Este proyecto utiliza **Hexagonal Architecture** (también conocida como Ports & Adapters), una arquitectura limpia que separa la lógica de negocio de los detalles de implementación.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Adapter Layer                    │
│  (adapters/http/routes, adapters/http/controllers)     │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Application Layer (Use Cases)             │
│         (application/useCases/GetCryptoMarketContext)   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐          ┌─────────▼──────────┐
│  Domain Layer  │          │   Ports (Interfaces)│
│  (entities,    │          │  (CryptoPriceProvider│
│   services)    │          │   NewsProvider)     │
└────────────────┘          └─────────┬──────────┘
                                      │
                           ┌──────────▼──────────┐
                           │  External Adapters  │
                           │  (MockPriceProvider, │
                           │   MockNewsProvider)  │
                           └─────────────────────┘
```

### Capas de la Arquitectura

#### 1. Domain Layer (Núcleo del Negocio)
- **Entities**: `CryptoAsset` - Representa un activo criptográfico
- **Value Objects**: `SentimentScore` - Representa un valor de sentimiento
- **Services**: `SentimentAnalyzer` - Lógica pura de análisis de sentimiento

**Características:**
- No tiene dependencias externas
- Contiene solo lógica de negocio
- Es testeable de forma aislada

#### 2. Application Layer (Casos de Uso)
- **Use Cases**: `GetCryptoMarketContext` - Orquesta la obtención de contexto de mercado

**Características:**
- Coordina servicios de dominio y adapters
- Define qué puede hacer el sistema
- Recibe dependencias por inyección

#### 3. Ports (Interfaces)
- `CryptoPriceProvider` - Contrato para proveedores de precios
- `NewsProvider` - Contrato para proveedores de noticias
- `SentimentAnalyzer` - Contrato para análisis de sentimiento

**Características:**
- Define QUÉ necesita el sistema
- No define CÓMO se implementa
- Permite intercambiar implementaciones fácilmente

#### 4. Adapters (Implementaciones)
- **External Adapters**:
  - `CoinGeckoAdapter` - Implementación real para precios (CoinGecko API)
  - `RSSNewsAdapter` - Implementación real para noticias vía RSS feeds (CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine)
  - `MockPriceProvider`, `MockNewsProvider` - Implementaciones mock para desarrollo/testing
- **HTTP Adapters**: Controllers y Routes de Express

**Características:**
- Implementan los ports definidos
- Aíslan detalles técnicos (HTTP, APIs externas)
- Fáciles de reemplazar o mockear
- Configurables mediante variables de entorno

#### 5. Infrastructure Layer
- Configuración, middleware, container de dependencias

### Dependency Injection

El proyecto utiliza un contenedor de inyección de dependencias (`infrastructure/container.js`) que:

1. Instancia los adapters (implementaciones)
2. Instancia los servicios de dominio
3. Inyecta dependencias en los use cases
4. Exporta use cases configurados

**Ejemplo:**
```javascript
const container = require('./infrastructure/container');

// Use case ya configurado con todas sus dependencias
const context = await container.getCryptoMarketContext.execute('bitcoin');
```

### Principios Aplicados

1. **Dependency Inversion**: Las dependencias apuntan hacia adentro (domain no depende de nada externo)
2. **Separation of Concerns**: Cada capa tiene una responsabilidad única
3. **Testability**: Fácil mockear dependencias externas
4. **Extensibility**: Añadir nuevos providers sin cambiar lógica de negocio

## Estructura del Proyecto

```
backend/
└── src/
    ├── domain/              # Núcleo del negocio
    │   ├── entities/        # Entidades del dominio
    │   ├── valueObjects/    # Objetos de valor
    │   └── services/        # Servicios de dominio
    ├── application/         # Casos de uso
    │   └── useCases/
    ├── ports/               # Interfaces (contratos)
    ├── adapters/            # Implementaciones
    │   ├── external/        # APIs externas
    │   └── http/           # Express controllers/routes
    ├── infrastructure/      # Configuración técnica
    │   ├── config/
    │   ├── middleware/
    │   └── container.js
    ├── app.js
    └── server.js
```

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto `backend/`:

```env
PORT=3000
NODE_ENV=development

# Opcional: Usar providers mock en lugar de APIs/feeds reales
USE_MOCK_PROVIDERS=false
```

No se requiere ninguna API key. El sistema obtiene noticias de feeds RSS públicos.

### Fuentes de Datos

- **CoinGecko** — Precios en tiempo real
  - Sin API key requerida
  - Endpoint: `/api/v3/simple/price`
  - Rate limit: ~10-50 calls/minuto en el free tier

- **RSS Feeds** — Noticias de criptomonedas (sin API key, sin rate limit)
  | Fuente | Feed |
  |--------|------|
  | CoinDesk | `coindesk.com/arc/outboundfeeds/rss/` |
  | CoinTelegraph | `cointelegraph.com/rss` |
  | Decrypt | `decrypt.co/feed` |
  | Bitcoin Magazine | `bitcoinmagazine.com/feed` |

  Los feeds se consultan en paralelo. Si uno falla, los demás siguen funcionando.
  Las noticias se filtran por keywords del activo (ej: `bitcoin`, `btc`).

**Nota**: Para desarrollo/testing, puedes usar `USE_MOCK_PROVIDERS=true` para usar datos mock sin hacer llamadas a fuentes externas.

## Ejecución

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor se ejecutará en el puerto 3000 por defecto (o el puerto especificado en la variable de entorno `PORT`).

## API Documentation

La documentación interactiva de la API está disponible en:

**http://localhost:3000/docs**

Esta documentación está generada con [Scalar](https://scalar.com/) y utiliza el archivo OpenAPI 3.0 ubicado en `docs/openapi.yaml`.

## Endpoints

### GET /
Obtiene el estado de la API.

**Respuesta:**
```json
{
  "message": "Crypto Market Insights API",
  "version": "1.0.0",
  "status": "running",
  "timestamp": "2024-..."
}
```

### GET /api/crypto/:assetId/context
Obtiene el contexto completo de mercado para un activo criptográfico.

**Parámetros:**
- `assetId` (path): Identificador del activo (ej: 'bitcoin', 'ethereum')
- `limit` (query, opcional): Número máximo de noticias (default: 10)

**Ejemplo:**
```
GET /api/crypto/bitcoin/context?limit=5
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "asset": {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "price": 43250.50,
      "change24h": 2.45
    },
    "sentiment": {
      "value": "positive",
      "score": 0.65,
      "confidence": 0.8
    },
    "headlines": [
      {
        "title": "Bitcoin Reaches New All-Time High",
        "source": "CryptoNews",
        "publishedAt": "2024-...",
        "url": "https://..."
      }
    ],
    "timestamp": "2024-..."
  }
}
```

## Estado del Proyecto

### Implementado
- ✅ Arquitectura Hexagonal (Ports & Adapters)
- ✅ Domain entities y value objects
- ✅ Use cases con dependency injection
- ✅ Mock adapters para desarrollo
- ✅ Endpoint de contexto de mercado
- ✅ Manejo de errores centralizado
- ✅ Noticias vía RSS feeds (sin API key)
- ✅ Sentiment analysis con votos de comunidad + keywords como fallback

### Pendiente
- [ ] Tests de integración
- [ ] Validación de datos de entrada
- [ ] Rate limiting
- [ ] Caching layer (especialmente para RSS feeds)
- [ ] Retry logic para feeds externos
- [ ] Logging estructurado

## Desarrollo

### Añadir un nuevo Provider

1. Crear el port en `ports/`:
```javascript
class NewProvider {
  async getData() {
    throw new Error('Must be implemented');
  }
}
```

2. Crear el adapter en `adapters/external/`:
```javascript
class NewProviderAdapter extends NewProvider {
  async getData() {
    // Implementación
  }
}
```

3. Actualizar `infrastructure/container.js`:
```javascript
const newProvider = new NewProviderAdapter();
// Inyectar en use case
```

### Añadir un nuevo Use Case

1. Crear en `application/useCases/`:
```javascript
class NewUseCase {
  constructor(dependency1, dependency2) {
    this.dependency1 = dependency1;
    this.dependency2 = dependency2;
  }
  
  async execute(params) {
    // Lógica del caso de uso
  }
}
```

2. Añadir al container y exportar

3. Usar en controller:
```javascript
const result = await container.newUseCase.execute(params);
```

## Referencias

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
