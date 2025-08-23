import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('financial_asset_type', (table) => {
    table.decimal('currency_price', 10, 5).defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('financial_asset_type', (table) => {
    table.dropColumn('currency_price');
  });
}
