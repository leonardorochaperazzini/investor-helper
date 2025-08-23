import { PrismaClient } from '@prisma/client';
import { IFinancialAssetRepository, UpdateFinancialAssetDTO } from '../../application/repositories/IFinancialAssetRepository';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { AssetTypeCode } from '../../domain/value_objects/AssetType';

export class PrismaFinancialAssetRepository implements IFinancialAssetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByTypeCode(typeCode: AssetTypeCode): Promise<FinancialAsset[]> {
    const assets = await this.prisma.financialAsset.findMany({
      where: {
        financialAssetType: {
          code: typeCode,
        },
      },
      include: {
        financialAssetType: true,
        investGroup: true,
      },
    });

    return assets.map(this.mapToEntity);
  }

  async findByCode(code: string): Promise<FinancialAsset | null> {
    const asset = await this.prisma.financialAsset.findFirst({
      where: { code },
      include: {
        financialAssetType: true,
        investGroup: true,
      },
    });

    if (!asset) return null;
    return this.mapToEntity(asset);
  }

  async findAll(): Promise<FinancialAsset[]> {
    const assets = await this.prisma.financialAsset.findMany({
      include: {
        financialAssetType: true,
        investGroup: true,
      },
    });

    return assets.map(this.mapToEntity);
  }

  async updateCurrentMarketValue(id: number, value: number): Promise<void> {
    await this.prisma.financialAsset.update({
      where: { id },
      data: { currentMarketValue: value },
    });
  }

  async updateFinancialAsset(id: number, data: UpdateFinancialAssetDTO): Promise<FinancialAsset> {
    const updated = await this.prisma.financialAsset.update({
      where: { id },
      data: {
        description: data.description,
        desiredPercentageValue: data.desiredPercentageValue,
        amount: data.amount,
        groupId: data.groupId
      },
      include: {
        financialAssetType: true,
        investGroup: true
      }
    });

    return this.mapToEntity(updated);
  }

  // Helper to convert Prisma model to domain entity
  private mapToEntity(data: any): FinancialAsset {
    return {
      id: data.id,
      code: data.code,
      description: data.description,
      amount: data.amount,
      currentMarketValue: data.currentMarketValue || 0,
      desiredPercentageValue: data.desiredPercentageValue,
      typeId: data.typeId,
      groupId: data.groupId,
      type: data.financialAssetType
        ? {
            id: data.financialAssetType.id,
            code: data.financialAssetType.code,
            description: data.financialAssetType.description,
            country: data.financialAssetType.country,
          }
        : undefined,
      group: data.investGroup
        ? {
            id: data.investGroup.id,
            typeId: data.investGroup.typeId,
            desiredPercentageValue: data.investGroup.desiredPercentageValue,
          }
        : undefined,
    };
  }
}
