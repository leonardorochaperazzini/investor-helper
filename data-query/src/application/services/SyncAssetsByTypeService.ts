import { IFinancialAssetRepository } from '../repositories/IFinancialAssetRepository';
import { UpdateAssetCurrentPriceService } from './UpdateAssetCurrentPriceService';
import { IPriceProviderResolver } from '../ports/IPriceProviderResolver';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export class SyncAssetsByTypeService {
  private readonly updateService: UpdateAssetCurrentPriceService;

  constructor(
    private readonly repository: IFinancialAssetRepository,
    priceResolver: IPriceProviderResolver
  ) {
    this.updateService = new UpdateAssetCurrentPriceService(repository, priceResolver);
  }

  async execute(typeCode: AssetTypeCode): Promise<void> {
    const assets = await this.repository.findByTypeCode(typeCode);

    for (const asset of assets) {
      try {
        await this.updateService.execute(asset, typeCode);
        console.log(`Ativo: ${asset.code} | Preço atualizado`);
      } catch (err) {
        console.error(`Erro ao atualizar preço de ${asset.code}:`, err);
      }
    }
  }
}
