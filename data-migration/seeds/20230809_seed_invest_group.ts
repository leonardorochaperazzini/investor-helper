import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    // Buscar o type id do etf-br
    const etfBr = await trx('financial_asset_type').where({ code: 'etf-br' }).first();
    if (!etfBr) {
      throw new Error('Tipo etf-br não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado: já existe grupo para esse tipo e desired_value?
    const existing = await trx('invest_group')
      .where({ type_id: etfBr.id, desired_value: 17.5 })
      .first();
    if (existing) return;

    await trx('invest_group').insert({ type_id: etfBr.id, desired_value: 17.5 });
  });
}
