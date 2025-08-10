# Invest Automation

Este repositório contém dois projetos principais:

- **data-migration**: Responsável pela migração e estruturação do banco de dados Postgres, utilizando Knex para migrations.
- **data-query**: Responsável por buscar dados de investimentos (financial_asset) do tipo "stock" e consultar informações de mercado via API, usando ORM seguro e wrapper para integração.

## Como rodar o projeto

1. Clone o repositório e acesse a pasta do projeto.
2. Execute `docker-compose up --build` para subir os containers do Node e Postgres.
3. Para rodar as migrations, execute:
   ```sh
   docker-compose run --rm migration
   ```
4. Para executar a busca de dados:
   ```sh
   docker-compose run --rm query
   ```

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
