export interface FinancialAssetType {
  id: number;
  code: string;
  description?: string;
  country?: string;
  currencyPrice: number;
}
