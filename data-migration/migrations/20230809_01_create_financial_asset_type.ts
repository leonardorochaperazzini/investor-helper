import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('financial_asset_type', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable();
    table.string('description');
    table.string('country');
    table.unique(['code']);
    table.index(['code'], 'idx_financial_asset_type_code');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('financial_asset_type');
}
