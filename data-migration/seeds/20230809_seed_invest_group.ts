import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    // Buscar o type id do etf-br
    const etfBr = await trx('financial_asset_type').where({ code: 'etf-br' }).first();
    if (!etfBr) {
      throw new Error('Tipo etf-br não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado: já existe grupo para esse tipo e desired_percentage_value?
    const existing = await trx('invest_group')
      .where({ type_id: etfBr.id, desired_percentage_value: 17.5 })
      .first();
    if (!existing) {
      await trx('invest_group').insert({ type_id: etfBr.id, desired_percentage_value: 17.5 });
    }

    // Buscar o type id do real-estate-funds-br
    const reFundsBr = await trx('financial_asset_type')
      .where({ code: 'real-estate-funds-br' })
      .first();
    if (!reFundsBr) {
      throw new Error('Tipo real-estate-funds-br não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para real-estate-funds-br
    const existingRe = await trx('invest_group')
      .where({ type_id: reFundsBr.id, desired_percentage_value: 17.5 })
      .first();
    if (!existingRe) {
      await trx('invest_group').insert({ type_id: reFundsBr.id, desired_percentage_value: 17.5 });
    }

    // Buscar o type id do etf-cripto-br
    const etfCriptoBr = await trx('financial_asset_type')
      .where({ code: 'etf-cripto-br' })
      .first();
    if (!etfCriptoBr) {
      throw new Error('Tipo etf-cripto-br não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para etf-cripto-br
    const existingCripto = await trx('invest_group')
      .where({ type_id: etfCriptoBr.id, desired_percentage_value: 5 })
      .first();
    if (!existingCripto) {
      await trx('invest_group').insert({ type_id: etfCriptoBr.id, desired_percentage_value: 5 });
    }

    // Buscar o type id do reservation-money
    const reservationMoney = await trx('financial_asset_type')
      .where({ code: 'reservation-money' })
      .first();
    if (!reservationMoney) {
      throw new Error('Tipo reservation-money não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para reservation-money
    const existingReservation = await trx('invest_group')
      .where({ type_id: reservationMoney.id, desired_percentage_value: 5 })
      .first();
    if (!existingReservation) {
      await trx('invest_group').insert({ type_id: reservationMoney.id, desired_percentage_value: 5 });
    }

    // Buscar o type id do fixed-income-br
    const fixedIncomeBr = await trx('financial_asset_type')
      .where({ code: 'fixed-income-br' })
      .first();
    if (!fixedIncomeBr) {
      throw new Error('Tipo fixed-income-br não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para fixed-income-br
    const existingFixedIncome = await trx('invest_group')
      .where({ type_id: fixedIncomeBr.id, desired_percentage_value: 30 })
      .first();
    if (!existingFixedIncome) {
      await trx('invest_group').insert({ type_id: fixedIncomeBr.id, desired_percentage_value: 37.5 });
    }

    // Buscar o type id do fgts
    const fgtsType = await trx('financial_asset_type')
      .where({ code: 'fgts-br' })
      .first();
    if (!fgtsType) {
      throw new Error('Tipo fgts não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para fgts
    const existingFgts = await trx('invest_group')
      .where({ type_id: fgtsType.id, desired_percentage_value: 0 })
      .first();
    if (!existingFgts) {
      await trx('invest_group').insert({ type_id: fgtsType.id, desired_percentage_value: 5 });
    }

    // Buscar o type id do reit-us
    const reitUsType = await trx('financial_asset_type')
      .where({ code: 'reit-us' })
      .first();
    if (!reitUsType) {
      throw new Error('Tipo reit-us não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para reit-us
    const existingReitUs = await trx('invest_group')
      .where({ type_id: reitUsType.id, desired_percentage_value: 10 })
      .first();
    if (!existingReitUs) {
      await trx('invest_group').insert({ type_id: reitUsType.id, desired_percentage_value: 5 });
    }

    // Buscar o type id do stock-us
    const stockUsType = await trx('financial_asset_type')
      .where({ code: 'stock-us' })
      .first();
    if (!stockUsType) {
      throw new Error('Tipo stock-us não encontrado. Rode as seeds de tipo antes.');
    }

    // Evitar duplicado para stock-us
    const existingStockUs = await trx('invest_group')
      .where({ type_id: stockUsType.id, desired_percentage_value: 10 })
      .first();
    if (!existingStockUs) {
      await trx('invest_group').insert({ type_id: stockUsType.id, desired_percentage_value: 5 });
    }
  });
}
