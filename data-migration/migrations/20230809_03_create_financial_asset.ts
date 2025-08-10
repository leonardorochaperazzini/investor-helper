import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('financial_asset', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable();
    table.string('description');
    table.float('desired_value');
    table.float('current_market_value');
    table.float('amount');
    table
      .integer('type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('financial_asset_type')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('group_id')
      .unsigned()
      .references('id')
      .inTable('invest_group')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table.unique(['code']);
    table.index(['code'], 'idx_financial_asset_code');
    table.index(['type_id'], 'idx_financial_asset_type_id');
    table.index(['group_id'], 'idx_financial_asset_group_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('financial_asset');
}
