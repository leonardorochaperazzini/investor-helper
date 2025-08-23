import { IFinancialAssetTypeRepository, UpdateCurrencyPriceDTO } from '../repositories/IFinancialAssetTypeRepository';
import { CurrencyExchangeService } from '../../adapters/external_services/common/CurrencyExchangeService';

export class UpdateCurrencyRateService {
  constructor(private readonly typeRepository: IFinancialAssetTypeRepository) {}

  /**
   * Atualiza a taxa de câmbio para todos os tipos de ativos estrangeiros
   */
  async execute(): Promise<{ usdRate: number, updatedTypes: string[] }> {
    // Buscar a taxa atual do dólar
    const usdRate = await CurrencyExchangeService.getUsdToBrlRate();
    
    // Buscar todos os tipos de ativos dos EUA
    const usTypes = await this.typeRepository.findByCountry('US');
    
    // Atualizar a taxa para cada tipo de ativo
    const updatePromises = usTypes.map(type => 
      this.typeRepository.updateCurrencyPrice(type.code as any, { currencyPrice: usdRate })
    );
    
    await Promise.all(updatePromises);
    
    return {
      usdRate,
      updatedTypes: usTypes.map(type => type.code),
    };
  }
}
