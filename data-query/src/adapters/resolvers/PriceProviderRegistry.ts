import { IPriceProvider } from '../../application/ports/IPriceProvider';
import { IPriceProviderResolver } from '../../application/ports/IPriceProviderResolver';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export class PriceProviderRegistry implements IPriceProviderResolver {
  private readonly map = new Map<AssetTypeCode, IPriceProvider>();

  register(typeCode: AssetTypeCode, provider: IPriceProvider) {
    this.map.set(typeCode, provider);
  }

  resolve(typeCode: AssetTypeCode): IPriceProvider {
    const provider = this.map.get(typeCode);
    if (!provider) {
      throw new Error(`Tipo de ativo não suportado: ${typeCode}`);
    }
    return provider;
  }
}
