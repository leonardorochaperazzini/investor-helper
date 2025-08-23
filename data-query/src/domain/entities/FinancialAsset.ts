export interface FinancialAssetType {
  id: number;
  code: string;
  description: string;
  country: string;
}

export interface InvestGroup {
  id: number;
  typeId: number;
  desiredPercentageValue: number;
}

export interface FinancialAsset {
  id: number;
  code: string;
  description: string | null;
  desiredPercentageValue: number | null;
  currentMarketValue: number | null;
  amount: number | null;
  typeId: number;
  groupId: number | null;
  type?: FinancialAssetType;
  group?: InvestGroup;
}
