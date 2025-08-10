import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const connection =
  process.env.DATABASE_URL ||
  [
    'postgres://',
    process.env.DB_USER ,
    ':',
    process.env.DB_PASSWORD ,
    '@',
    process.env.DB_HOST || 'localhost',
    ':',
    process.env.DB_PORT || '5432',
    '/',
    process.env.DB_NAME ,
  ].join('');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory: './migrations',
      tableName: 'migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
      extension: 'ts',
    },
  },
};

export default config;
