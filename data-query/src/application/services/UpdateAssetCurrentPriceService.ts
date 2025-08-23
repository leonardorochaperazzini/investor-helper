import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { IFinancialAssetRepository } from '../repositories/IFinancialAssetRepository';
import { IPriceProviderResolver } from '../ports/IPriceProviderResolver';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export class UpdateAssetCurrentPriceService {
  constructor(
    private readonly repository: IFinancialAssetRepository,
    private readonly priceResolver: IPriceProviderResolver
  ) {}

  async execute(asset: FinancialAsset, typeCode: AssetTypeCode): Promise<FinancialAsset> {
    try {
      const provider = this.priceResolver.resolve(typeCode);
      const price = await provider.getCurrentPrice(asset.code);
      await this.repository.updateCurrentMarketValue(asset.id, price);
      
      // Return updated asset
      return {
        ...asset,
        currentMarketValue: price
      };
    } catch (error) {
      console.error(`Error updating price for ${asset.code}:`, error);
      // Return original asset if update fails
      return asset;
    }
  }
}
