import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invest_group', (table) => {
    table.increments('id').primary();
    table
      .integer('type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('financial_asset_type')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.float('desired_value');
    table.index(['type_id'], 'idx_invest_group_type_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invest_group');
}
