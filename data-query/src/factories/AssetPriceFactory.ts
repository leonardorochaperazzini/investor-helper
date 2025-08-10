import { IAssetPriceService } from '../interfaces/IAssetPriceService';
import { EtfBrPriceService } from '../services/EtfBrPriceService';

export type AssetTypeCode =
  | 'stock-br'
  | 'stock-us'
  | 'etf-us'
  | 'etf-br'
  | 'real-estate-funds-br'
  | 'reit-us'
  | 'fixed-income-br'
  | 'fixed-income-us'
  | 'reservation-money'
  | 'etf-cripto-br';

export class AssetPriceFactory {
  create(typeCode: AssetTypeCode): IAssetPriceService {
    switch (typeCode) {
      case 'etf-br':
        return new EtfBrPriceService();
      default:
        throw new Error(`Tipo de ativo não suportado: ${typeCode}`);
    }
  }
}
