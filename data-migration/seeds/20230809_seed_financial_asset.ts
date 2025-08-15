import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx: Knex.Transaction) => {
    // --- STOCK US ---
    const stockUsType = await trx('financial_asset_type')
      .where({ code: 'stock-us' })
      .first();
    if (!stockUsType) throw new Error('Tipo stock-us não encontrado.');

    let stockUsGroup = await trx('invest_group')
      .where({ type_id: stockUsType.id, desired_percentage_value: 5 })
      .first();
    if (!stockUsGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: stockUsType.id, desired_percentage_value: 5 })
        .returning(['id']);
      stockUsGroup = created as any;
    }

    const qqqExists = await trx('financial_asset').where({ code: 'QQQ' }).first();
    if (!qqqExists) {
      await trx('financial_asset').insert({
        code: 'QQQ',
        description: 'Invesco QQQ Trust - Nasdaq 100',
        desired_percentage_value: 35,
        amount: 5.35,
        type_id: stockUsType.id,
        group_id: (stockUsGroup as any).id,
      });
    }

    const dhsExists = await trx('financial_asset').where({ code: 'DHS' }).first();
    if (!dhsExists) {
      await trx('financial_asset').insert({
        code: 'DHS',
        description: 'WisdomTree U.S. High Dividend Fund',
        desired_percentage_value: 65,
        amount: 61.15,
        type_id: stockUsType.id,
        group_id: (stockUsGroup as any).id,
      });
    }
    
    // --- REIT US ---
    const reitUsType = await trx('financial_asset_type')
      .where({ code: 'reit-us' })
      .first();
    if (!reitUsType) throw new Error('Tipo reit-us não encontrado.');

    let reitUsGroup = await trx('invest_group')
      .where({ type_id: reitUsType.id, desired_percentage_value: 5 })
      .first();
    if (!reitUsGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: reitUsType.id, desired_percentage_value: 5 })
        .returning(['id']);
      reitUsGroup = created as any;
    }

    const reitUsExists = await trx('financial_asset').where({ code: 'VNQ' }).first();
    if (!reitUsExists) {
      await trx('financial_asset').insert({
        code: 'VNQ',
        description: 'Vanguard Real Estate ETF',
        desired_percentage_value: 100,
        amount: 73.38,
        type_id: reitUsType.id,
        group_id: (reitUsGroup as any).id,
      });
    }
    // --- FGTS ---
    const fgtsType = await trx('financial_asset_type')
      .where({ code: 'fgts-br' })
      .first();
    if (!fgtsType) throw new Error('Tipo fgts não encontrado.');

    let fgtsGroup = await trx('invest_group')
      .where({ type_id: fgtsType.id, desired_percentage_value: 5 })
      .first();
    if (!fgtsGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: fgtsType.id, desired_percentage_value: 5 })
        .returning(['id']);
      fgtsGroup = created as any;
    }

    const fgtsExists = await trx('financial_asset').where({ code: 'FGTS' }).first();
    if (!fgtsExists) {
      await trx('financial_asset').insert({
        code: 'FGTS',
        description: 'Fundo de Garantia do Tempo de Serviço',
        current_market_value: 81000,
        desired_percentage_value: 0,
        amount: 1,
        type_id: fgtsType.id,
        group_id: (fgtsGroup as any).id,
      });
    }

    // --- Fixed Income BR ---
    const fixedIncomeBrType = await trx('financial_asset_type')
      .where({ code: 'fixed-income-br' })
      .first();
    if (!fixedIncomeBrType) throw new Error('Tipo fixed-income-br não encontrado.');

    let fixedIncomeGroup = await trx('invest_group')
      .where({ type_id: fixedIncomeBrType.id, desired_percentage_value: 30 })
      .first();
    if (!fixedIncomeGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: fixedIncomeBrType.id, desired_percentage_value: 30 })
        .returning(['id']);
      fixedIncomeGroup = created as any;
    }

    const fixedIncomeExists = await trx('financial_asset').where({ code: 'TESOURO' }).first();
    if (!fixedIncomeExists) {
      await trx('financial_asset').insert({
        code: 'RENDA-FIXA',
        description: 'Renda Fixa (Nuinvest + Itau)',
        current_market_value: 71975,
        desired_percentage_value: 100,
        amount: 1,
        type_id: fixedIncomeBrType.id,
        group_id: (fixedIncomeGroup as any).id,
      });
    }

    // --- ETF BR ---
    const etfBr = await trx('financial_asset_type').where({ code: 'etf-br' }).first();
    if (!etfBr) throw new Error('Tipo etf-br não encontrado.');

    let group = await trx('invest_group').where({ type_id: etfBr.id, desired_percentage_value: 17.5 }).first();
    if (!group) {
      const [created] = await trx('invest_group')
        .insert({ type_id: etfBr.id, desired_percentage_value: 17.5 })
        .returning(['id']);
      group = created as any;
    }

    const exists = await trx('financial_asset').where({ code: 'NDIV11' }).first();
    if (!exists) {
      await trx('financial_asset').insert({
        code: 'NDIV11',
        description: 'Repassa os dividendos',
        desired_percentage_value: 100,
        amount: 397,
        type_id: etfBr.id,
        group_id: (group as any).id,
      });
    }

    // --- Real Estate Funds BR ---
    const reFundsBr = await trx('financial_asset_type')
      .where({ code: 'real-estate-funds-br' })
      .first();
    if (!reFundsBr) throw new Error('Tipo real-estate-funds-br não encontrado.');

    let reGroup = await trx('invest_group')
      .where({ type_id: reFundsBr.id, desired_percentage_value: 17.5 })
      .first();
    if (!reGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: reFundsBr.id, desired_percentage_value: 17.5 })
        .returning(['id']);
      reGroup = created as any;
    }

    const reitAssets = [
      { code: 'HFOF11', desired_percentage_value: 12.5, amount: 1010, description: 'Fundo de Fundos' },
      { code: 'BTHF11', desired_percentage_value: 10, amount: 667, description: 'Fundo de Fundos' },
      { code: 'CPTS11', desired_percentage_value: 10, amount: 552, description: 'Papel' },
      { code: 'KNCR11', desired_percentage_value: 10, amount: 33, description: 'Papel' },
      { code: 'KNRI11', desired_percentage_value: 12.5, amount: 39, description: 'Tijolo - Híbrido' },
      { code: 'HGLG11', desired_percentage_value: 5, amount: 15, description: 'Tijolo - Imóveis Industriais e Logísticos' },
      { code: 'VISC11', desired_percentage_value: 15, amount: 65, description: 'Tijolo - Shoppings' },
      { code: 'XPML11', desired_percentage_value: 5, amount: 21, description: 'Tijolo - Shoppings' },
      { code: 'LVBI11', desired_percentage_value: 5, amount: 22, description: 'Tijolo - Imóveis Industriais e Logísticos' },
      { code: 'FIIB11', desired_percentage_value: 15, amount: 13, description: 'Tijolo - Imóveis Industriais e Logísticos (wege dos fundos) - Híbrido' },
    ];

    for (const asset of reitAssets) {
      const already = await trx('financial_asset').where({ code: asset.code }).first();
      if (!already) {
        await trx('financial_asset').insert({
          code: asset.code,
          description: asset.description,
          desired_percentage_value: asset.desired_percentage_value,
          amount: asset.amount,
          type_id: reFundsBr.id,
          group_id: (reGroup as any).id,
        });
      }
    }

    // --- ETF Cripto BR ---
    const etfCriptoBr = await trx('financial_asset_type')
      .where({ code: 'etf-cripto-br' })
      .first();
    if (!etfCriptoBr) throw new Error('Tipo etf-cripto-br não encontrado.');

    let criptoGroup = await trx('invest_group')
      .where({ type_id: etfCriptoBr.id, desired_percentage_value: 5 })
      .first();
    if (!criptoGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: etfCriptoBr.id, desired_percentage_value: 5 })
        .returning(['id']);
      criptoGroup = created as any;
    }

    const hashExists = await trx('financial_asset').where({ code: 'HASH11' }).first();
    if (!hashExists) {
      await trx('financial_asset').insert({
        code: 'HASH11',
        description: 'ETF de BTC + outras criptos',
        desired_percentage_value: 100,
        amount: 174,
        type_id: etfCriptoBr.id,
        group_id: (criptoGroup as any).id,
      });
    }

    // --- Reservation Money ---
    const reservationMoneyType = await trx('financial_asset_type')
      .where({ code: 'reservation-money' })
      .first();
    if (!reservationMoneyType) throw new Error('Tipo reservation-money não encontrado.');

    let reservationGroup = await trx('invest_group')
      .where({ type_id: reservationMoneyType.id, desired_percentage_value: 10 })
      .first();
    if (!reservationGroup) {
      const [created] = await trx('invest_group')
        .insert({ type_id: reservationMoneyType.id, desired_percentage_value: 10 })
        .returning(['id']);
      reservationGroup = created as any;
    }

    const reservationExists = await trx('financial_asset').where({ code: 'RESERVA' }).first();
    if (!reservationExists) {
      await trx('financial_asset').insert({
        code: 'RESERVA',
        description: 'Reserva (Nubank + Itau)',
        current_market_value: 29609,
        desired_percentage_value: 100,
        amount: 1,
        type_id: reservationMoneyType.id,
        group_id: (reservationGroup as any).id,
      });
    }
  });
}
