import { PrismaClient } from '@prisma/client';
import { IFinancialAssetTypeRepository, UpdateCurrencyPriceDTO } from '../../application/repositories/IFinancialAssetTypeRepository';
import { FinancialAssetType } from '../../domain/entities/FinancialAssetType';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export class PrismaFinancialAssetTypeRepository implements IFinancialAssetTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<FinancialAssetType[]> {
    const types = await this.prisma.financialAssetType.findMany();
    return types.map(this.mapToEntity);
  }

  async findById(id: number): Promise<FinancialAssetType | null> {
    const type = await this.prisma.financialAssetType.findUnique({
      where: { id }
    });

    if (!type) return null;
    return this.mapToEntity(type);
  }

  async findByCode(code: AssetTypeCode): Promise<FinancialAssetType | null> {
    const type = await this.prisma.financialAssetType.findUnique({
      where: { code }
    });

    if (!type) return null;
    return this.mapToEntity(type);
  }

  async updateCurrencyPrice(code: AssetTypeCode, data: UpdateCurrencyPriceDTO): Promise<boolean> {
    try {
      await this.prisma.financialAssetType.update({
        where: { code },
        data: {
          currencyPrice: data.currencyPrice
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating currency price:', error);
      return false;
    }
  }

  async findByCountry(country: string): Promise<FinancialAssetType[]> {
    const types = await this.prisma.financialAssetType.findMany({
      where: { country }
    });
    return types.map(this.mapToEntity);
  }

  // Helper to convert Prisma model to domain entity
  private mapToEntity(data: any): FinancialAssetType {
    return {
      id: data.id,
      code: data.code,
      description: data.description,
      country: data.country,
      currencyPrice: data.currencyPrice
    };
  }
}
