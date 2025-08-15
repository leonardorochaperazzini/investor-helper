export class FinancialAsset {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly description: string | null,
    public readonly desiredPercentageValue: number | null,
    public currentMarketValue: number | null,
    public readonly amount: number | null,
    public readonly typeId: number,
    public readonly groupId: number | null
  ) {}
}
