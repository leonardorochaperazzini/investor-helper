import { IFinancialAssetRepository } from '../repositories/IFinancialAssetRepository';
import { UpdateAssetCurrentPriceService } from './UpdateAssetCurrentPriceService';
import { IPriceProviderResolver } from '../ports/IPriceProviderResolver';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { IFinancialAssetTypeRepository } from '../repositories/IFinancialAssetTypeRepository';
import { UpdateCurrencyRateService } from './UpdateCurrencyRateService';

export class SyncAssetsByTypeService {
  private readonly updateService: UpdateAssetCurrentPriceService;
  private readonly updateCurrencyService: UpdateCurrencyRateService | null;

  constructor(
    private readonly repository: IFinancialAssetRepository,
    priceResolver: IPriceProviderResolver,
    private readonly typeRepository?: IFinancialAssetTypeRepository
  ) {
    this.updateService = new UpdateAssetCurrentPriceService(repository, priceResolver);
    this.updateCurrencyService = typeRepository ? new UpdateCurrencyRateService(typeRepository) : null;
  }

  async execute(typeCode: AssetTypeCode): Promise<FinancialAsset[]> {
    // Se o tipo de ativo for dos EUA, atualize a taxa de câmbio primeiro
    if (typeCode.includes('-us') && this.updateCurrencyService) {
      try {
        console.log(`Atualizando taxa de câmbio antes de sincronizar ativos do tipo ${typeCode}...`);
        await this.updateCurrencyService.execute();
      } catch (error) {
        console.error('Erro ao atualizar taxa de câmbio:', error);
        // Continue mesmo se falhar, usando a taxa existente
      }
    }

    const assets = await this.repository.findByTypeCode(typeCode);
    const updatedAssets: FinancialAsset[] = [];

    for (const asset of assets) {
      try {
        const updatedAsset = await this.updateService.execute(asset, typeCode);
        updatedAssets.push(updatedAsset);
        console.log(`Ativo: ${asset.code} | Preço atualizado`);
      } catch (err) {
        console.error(`Erro ao atualizar preço de ${asset.code}:`, err);
      }
    }

    return updatedAssets;
  }

  async getAllAssets(): Promise<FinancialAsset[]> {
    return await this.repository.findAll();
  }

  async getAssetByCode(code: string): Promise<FinancialAsset | null> {
    return await this.repository.findByCode(code);
  }

  async getAssetsByType(typeCode: AssetTypeCode): Promise<FinancialAsset[]> {
    return await this.repository.findByTypeCode(typeCode);
  }
}
