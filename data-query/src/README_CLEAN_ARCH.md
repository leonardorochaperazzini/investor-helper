# Data Query - Clean Architecture Layout

Suggested structure:

- src/domain
  - entities/
- src/application
  - use-cases/ (current services)
  - ports/ (interfaces for repos and providers)
- src/adapters
  - repositories/ (ORM adapters)
  - external_services/price (HTTP adapters)
  - controllers/ (CLI/HTTP)
  - resolvers/ (registries/factories)
- src/main
  - index.ts (composition root)

Key contracts:
- IFinancialAssetRepository
- IPriceProvider, IPriceProviderResolver

Prefer camelCase for methods (e.g., getCurrentPrice). Use registry for providers.
