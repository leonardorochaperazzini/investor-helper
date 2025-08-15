import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { IFinancialAssetRepository } from '../repositories/IFinancialAssetRepository';
import { IPriceProviderResolver } from '../ports/IPriceProviderResolver';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export class UpdateAssetCurrentPriceService {
  constructor(
    private readonly repository: IFinancialAssetRepository,
    private readonly priceResolver: IPriceProviderResolver
  ) {}

  async execute(asset: FinancialAsset, typeCode: AssetTypeCode): Promise<void> {
    const provider = this.priceResolver.resolve(typeCode);
    const price = await provider.getCurrentPrice(asset.code);
    await this.repository.updateCurrentMarketValue(asset.id, price);
  }
}
