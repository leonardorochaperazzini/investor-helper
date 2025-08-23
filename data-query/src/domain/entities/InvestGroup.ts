export interface InvestGroup {
  id: number;
  typeId: number;
  desiredPercentageValue?: number;
  type?: {
    id: number;
    code: string;
    description?: string;
    country?: string;
  };
  financialAssets?: Array<{
    id: number;
    code: string;
    description?: string;
    currentMarketValue?: number;
    amount?: number;
    desiredPercentageValue?: number;
  }>;
}
