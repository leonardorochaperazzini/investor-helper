import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    const etfBr = await trx('financial_asset_type').where({ code: 'etf-br' }).first();
    if (!etfBr) throw new Error('Tipo etf-br não encontrado.');

    let group = await trx('invest_group').where({ type_id: etfBr.id, desired_value: 17.5 }).first();
    if (!group) {
      const [created] = await trx('invest_group')
        .insert({ type_id: etfBr.id, desired_value: 17.5 })
        .returning(['id']);
      group = created as any;
    }

    const exists = await trx('financial_asset').where({ code: 'NDIV11' }).first();
    if (exists) return;

    await trx('financial_asset').insert({
      code: 'NDIV11',
      description: 'Repassa os dividendos',
      desired_value: 100,
      amount: 397,
      type_id: etfBr.id,
      group_id: (group as any).id,
    });
  });
}
