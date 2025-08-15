export async function up(knex: any): Promise<void> {
  await knex.schema.createTable('financial_asset_history', (table: any) => {
    table.increments('id').primary();
    table.string('code').notNullable();

    // Snapshot fields (except description)
    table.float('desired_percentage_value');
    table.float('market_value');
    table.float('amount');

    // type_code referencing financial_asset_type.code
    table
      .string('type_code')
      .nullable()
      .references('code')
      .inTable('financial_asset_type')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');

    // Store desired group value instead of FK
    table.float('group_desired_percentage_value');

    // Use date only for inserted_date
    table.date('inserted_date').notNullable().defaultTo(knex.fn.now());

    table.unique(['code', 'inserted_date']);
    table.index(['code'], 'idx_financial_asset_history_code');
    table.index(['inserted_date'], 'idx_financial_asset_history_inserted_date');
    table.index(['type_code'], 'idx_financial_asset_history_type_code');
  });
}

export async function down(knex: any): Promise<void> {
  await knex.schema.dropTableIfExists('financial_asset_history');
}
