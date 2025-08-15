import { IPriceProvider } from './IPriceProvider';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export interface IPriceProviderResolver {
  resolve(typeCode: AssetTypeCode): IPriceProvider;
}
