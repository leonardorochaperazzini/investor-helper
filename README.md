# Invest Automation

Este repositório contém dois projetos principais:

- **data-migration**: Responsável pela migração e estruturação do banco de dados Postgres, utilizando Knex para migrations.
- **data-query**: Responsável por buscar dados de investimentos (financial_asset) e consultar informações de mercado via API, além de disponibilizar uma API REST para acesso aos dados.

## Pré-requisitos

- Docker e Docker Compose
- Chaves de API:
  - BRAPI_TOKEN: Para ativos brasileiros (ETFs, FIIs)
  - ALPHAVANTAGE_API_KEY: Para ativos americanos (Stocks, REITs)

## Configuração

1. Clone o repositório e acesse a pasta do projeto.
2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   BRAPI_TOKEN=sua_chave_brapi
   ALPHAVANTAGE_API_KEY=sua_chave_alpha_vantage
   ```
3. Crie um arquivo `.env` dentro da pasta `data-query` com o mesmo conteúdo.

## Como rodar o projeto

### Usando Docker Compose

1. Inicie os containers:
   ```sh
   docker-compose up --build
   ```

   Isto irá:
   - Iniciar o banco de dados Postgres
   - Executar as migrations
   - Iniciar a API REST (disponível em http://localhost:3000)

2. Acesse a documentação da API em: http://localhost:3000/api-docs

> **Nota**: Se encontrar erros relacionados a nomes de propriedades do Prisma como `"Property 'financial_asset' does not exist on type 'PrismaClient'"`, é porque o Prisma Client usa nomenclatura camelCase, mas o código pode estar usando snake_case. Verifique o arquivo `PrismaFinancialAssetRepository.ts` e ajuste para usar os nomes gerados pelo Prisma.
>
> **Nota sobre erros de import**: Se encontrar erros como `Cannot find module '../domain/value-objects/AssetType'`, verifique os caminhos de importação. Os arquivos em `src/adapters/controllers` devem importar de `'../../domain'` (dois níveis acima) e não de `'../domain'`.

### Sem Docker (desenvolvimento local)

1. Inicie o PostgreSQL localmente ou use Docker apenas para o banco de dados:
   ```sh
   docker-compose up -d postgres
   ```

2. Configure o ambiente na pasta `data-query`:
   ```sh
   cd data-query
   npm install
   npm run generate
   ```

3. Inicie a API em modo de desenvolvimento:
   ```sh
   npm run dev:api
   ```

## Funcionalidades da API

A API oferece os seguintes endpoints:

### Ativos
- `GET /api/assets` - Listar todos os ativos
- `GET /api/assets/{code}` - Buscar um ativo pelo código
- `GET /api/assets/type/{typeCode}` - Listar ativos por tipo
- `GET /api/assets/types` - Listar todos os tipos de ativos disponíveis
- `PUT /api/assets/{id}` - Atualizar atributos de um ativo financeiro

### Grupos
- `PUT /api/groups/{id}` - Atualizar atributos de um grupo de investimento

### Sincronização
- `POST /api/sync/type/{typeCode}` - Sincronizar preços de ativos de um tipo específico
- `POST /api/sync/all` - Sincronizar preços de todos os ativos

### Câmbio
- `GET /api/currency/rate` - Obter a taxa de câmbio atual (USD-BRL)
- `POST /api/currency/update` - Atualizar a taxa de câmbio para ativos estrangeiros

## Tipos de Ativos Suportados

- `stock-br`: Ações Brasil
- `stock-us`: Ações EUA
- `etf-br`: ETFs Brasil
- `etf-us`: ETFs EUA
- `etf-cripto-br`: ETFs de Criptomoedas Brasil
- `real-estate-funds-br`: Fundos Imobiliários Brasil
- `reit-us`: REITs EUA
- `fixed-income-br`: Renda Fixa Brasil
- `fixed-income-us`: Renda Fixa EUA
- `reservation-money`: Reserva de Emergência
- `fgts-br`: FGTS Brasil

## Como rodar a seed

Após subir os containers e rodar as migrations, execute:

```sh
# garantir Postgres rodando (opcional se já subiu com up)
docker-compose up -d postgres

# rodar todas as seeds
docker-compose run --rm migration npm exec knex seed:run -- --knexfile knexfile.js

# (opcional) rodar uma seed específica
# docker-compose run --rm migration npm exec knex seed:run -- --knexfile knexfile.js --specific 20230809_seed_financial_asset_type.ts
```

Rodar seeds específicas (ordem correta):
```sh
# tipos
docker-compose run --rm migration npm run seed:type
# grupo etf-br (depende de tipos)
docker-compose run --rm migration npm run seed:group
# ativo NDIV11 (depende de grupo)
docker-compose run --rm migration npm run seed:asset
```

Rodar todas as seeds em ordem:
```sh
docker-compose run --rm migration npm run seed:all
```

## Arquitetura

O projeto segue os princípios da Clean Architecture:

- **Domain**: Contém as entidades de negócio e os objetos de valor
- **Application**: Contém os serviços de aplicação e interfaces do repositório
- **Adapters**: Contém implementações concretas (repositórios, controladores, etc.)
- **Infrastructure**: Configuração e código de inicialização

## Recursos Adicionados

1. **API REST**: Acesso aos dados via endpoints HTTP
2. **Documentação Swagger**: Interface interativa para testar a API
3. **Suporte a Assets Americanos**: Integração com Alpha Vantage API
4. **Snapshot Diário**: Registro histórico dos valores dos ativos
5. **Múltiplos Tipos de Ativos**: Suporte para ETFs, FIIs, REITs, ações, etc.

## Resetar banco e reaplicar migrations + seeds (sem remover volume)

Use o próprio Knex para zerar e recriar o schema:
```sh
# 1) Garantir Postgres rodando
docker-compose up -d postgres

# 2) Rollback de todas as migrations (zera o schema gerenciado pelo Knex)
docker-compose run --rm migration npm exec knex migrate:rollback -- --knexfile knexfile.js --all

# 3) Aplicar novamente todas as migrations
docker-compose run --rm migration

# 4) Rodar todas as seeds
docker-compose run --rm migration npm exec knex seed:run -- --knexfile knexfile.js
```

Comando único:
```sh
docker-compose up -d postgres \
&& docker-compose run --rm migration npm exec knex migrate:rollback -- --knexfile knexfile.js --all \
&& docker-compose run --rm migration \
&& docker-compose run --rm migration npm exec knex seed:run -- --knexfile knexfile.js
```

Observações:
- A seed de tipos usa IDs fixos (1 a 10) e espera a tabela `financial_asset_type` vazia.
- Para resetar o banco (apaga tudo):
```sh
docker-compose down -v --remove-orphans
docker-compose up -d
```

## Estrutura dos Projetos

- **data-migration**: Código de migrations e configuração do Knex.
- **data-query**: Código de consulta ao banco e integração com API de mercado.

## Conexão com Postgres (DBeaver)
- Host: localhost
- Porta: 5432
- Database: invest
- Usuário: invest
- Senha: invest

## Troubleshooting
- Versão do Postgres incompatível no volume:
  ```sh
  docker-compose down -v --remove-orphans
  docker-compose build --no-cache
  docker-compose up
  ```
- Erro "No space left on device" com o PostgreSQL:
  ```sh
  # Verificar espaço disponível
  df -h
  
  # Limpar volumes Docker não utilizados
  docker volume prune -f
  
  # Limpar imagens e containers não utilizados
  docker system prune -f
  
  # Se precisar de mais espaço, limpar também imagens não utilizadas
  docker system prune -a -f
  ```
- Limpar e reconstruir do zero:
  ```sh
  docker-compose down -v --rmi all --remove-orphans
  docker-compose build --no-cache
  docker-compose up
  ```
- Caso "knex: not found": já incluímos instalação de dependências no container e mapeamos /app/node_modules; use os comandos acima para rebuild total.

## Observações
- O arquivo `copilot.yaml` detalha os objetivos e contextos dos projetos.
- Sempre mantenha este README atualizado conforme alterações nos projetos.

## TODO REFACTOR 
- ✅ alterar nome de rotas de update (removido /management/ das rotas PUT)
- ✅ alterar repository para separar o invest group
- ✅ alterar repository para separar o financial asset type
- ✅ alterar entities faltando

## Funcionalidades Recentes

- **Atualização de Ativos e Grupos**: Possibilidade de modificar atributos de ativos financeiros e grupos de investimento
- **Controle de Câmbio**: API para atualização e consulta de taxas de câmbio para ativos estrangeiros
- **Snapshot após Sincronização**: Criação automática de snapshots históricos após sincronização completa de ativos
- **Organização de Controllers**: Separação de responsabilidades entre controllers de ativos e sincronização
- **Separação de Repositories**: Criação de repositórios específicos para grupos de investimento e tipos de ativos financeiros