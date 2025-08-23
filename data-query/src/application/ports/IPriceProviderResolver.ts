import { IPriceProvider } from './IPriceProvider';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export interface IPriceProviderResolver {
  resolve(typeCode: AssetTypeCode): IPriceProvider;
}
