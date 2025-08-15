export const AssetType = {
  StockBr: 'stock-br',
  StockUs: 'stock-us',
  EtfUs: 'etf-us',
  EtfBr: 'etf-br',
  RealEstateFundsBr: 'real-estate-funds-br',
  ReitUs: 'reit-us',
  FixedIncomeBr: 'fixed-income-br',
  FixedIncomeUs: 'fixed-income-us',
  ReservationMoney: 'reservation-money',
  EtfCriptoBr: 'etf-cripto-br',
} as const;

export type AssetTypeCode = typeof AssetType[keyof typeof AssetType];
