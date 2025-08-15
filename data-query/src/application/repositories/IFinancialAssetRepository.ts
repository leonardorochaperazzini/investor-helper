import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export interface IFinancialAssetRepository {
  findByTypeCode(typeCode: AssetTypeCode): Promise<FinancialAsset[]>;
  findAll(): Promise<FinancialAsset[]>;
  updateCurrentMarketValue(id: number, value: number): Promise<void>;
}
