import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export interface UpdateFinancialAssetDTO {
  description?: string;
  desiredPercentageValue?: number;
  amount?: number;
  groupId?: number | null;
}

export interface IFinancialAssetRepository {
  findByTypeCode(typeCode: AssetTypeCode): Promise<FinancialAsset[]>;
  findAll(): Promise<FinancialAsset[]>;
  findByCode(code: string): Promise<FinancialAsset | null>;
  updateCurrentMarketValue(id: number, value: number): Promise<void>;
  updateFinancialAsset(id: number, data: UpdateFinancialAssetDTO): Promise<FinancialAsset>;
}
