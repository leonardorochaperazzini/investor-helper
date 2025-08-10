import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    const row = await trx('financial_asset_type')
      .count('id as count')
      .first();

    const existing = Number((row as any)?.count ?? 0);
    if (existing > 0) {
      return;
    }

    const types = [
      { id: 1, code: 'stock-br', description: 'Ações Brasil', country: 'BR' },
      { id: 2, code: 'stock-us', description: 'Stocks EUA', country: 'US' },
      { id: 3, code: 'etf-us', description: 'ETFs EUA', country: 'US' },
      { id: 4, code: 'etf-br', description: 'ETFs Brasil', country: 'BR' },
      { id: 5, code: 'real-estate-funds-br', description: 'Fundos Imobiliários Brasil', country: 'BR' },
      { id: 6, code: 'reit-us', description: 'REITs EUA', country: 'US' },
      { id: 7, code: 'fixed-income-br', description: 'Renda Fixa Brasil', country: 'BR' },
      { id: 8, code: 'fixed-income-us', description: 'Renda Fixa EUA', country: 'US' },
      { id: 9, code: 'reservation-money', description: 'Reserva de Emergência', country: 'BR' },
      { id: 10, code: 'etf-cripto-br', description: 'ETFs de Cripto Brasil', country: 'BR' },
    ];

    await trx('financial_asset_type').insert(types);
  });
}
