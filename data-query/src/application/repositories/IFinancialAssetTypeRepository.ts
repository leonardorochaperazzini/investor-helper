import { FinancialAssetType } from '../../domain/entities/FinancialAssetType';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export interface UpdateCurrencyPriceDTO {
  currencyPrice: number;
}

export interface IFinancialAssetTypeRepository {
  findAll(): Promise<FinancialAssetType[]>;
  findById(id: number): Promise<FinancialAssetType | null>;
  findByCode(code: AssetTypeCode): Promise<FinancialAssetType | null>;
  updateCurrencyPrice(code: AssetTypeCode, data: UpdateCurrencyPriceDTO): Promise<boolean>;
  findByCountry(country: string): Promise<FinancialAssetType[]>;
}
