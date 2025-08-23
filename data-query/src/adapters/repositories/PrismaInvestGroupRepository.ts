import { PrismaClient } from '@prisma/client';
import { IInvestGroupRepository, UpdateInvestGroupDTO } from '../../application/repositories/IInvestGroupRepository';
import { InvestGroup } from '../../domain/entities/InvestGroup';

export class PrismaInvestGroupRepository implements IInvestGroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<InvestGroup[]> {
    const groups = await this.prisma.investGroup.findMany({
      include: {
        financialAssetType: true,
        financialAssets: true,
      },
    });

    return groups.map(this.mapToEntity);
  }

  async findById(id: number): Promise<InvestGroup | null> {
    const group = await this.prisma.investGroup.findUnique({
      where: { id },
      include: {
        financialAssetType: true,
        financialAssets: true,
      },
    });

    if (!group) return null;
    return this.mapToEntity(group);
  }

  async findByTypeId(typeId: number): Promise<InvestGroup[]> {
    const groups = await this.prisma.investGroup.findMany({
      where: { typeId },
      include: {
        financialAssetType: true,
        financialAssets: true,
      },
    });

    return groups.map(this.mapToEntity);
  }

  async update(id: number, data: UpdateInvestGroupDTO): Promise<boolean> {
    try {
      await this.prisma.investGroup.update({
        where: { id },
        data: {
          desiredPercentageValue: data.desiredPercentageValue,
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating invest group:', error);
      return false;
    }
  }

  // Helper to convert Prisma model to domain entity
  private mapToEntity(data: any): InvestGroup {
    return {
      id: data.id,
      typeId: data.typeId,
      desiredPercentageValue: data.desiredPercentageValue,
      type: data.financialAssetType
        ? {
            id: data.financialAssetType.id,
            code: data.financialAssetType.code,
            description: data.financialAssetType.description,
            country: data.financialAssetType.country,
          }
        : undefined,
      financialAssets: data.financialAssets
        ? data.financialAssets.map((asset: any) => ({
            id: asset.id,
            code: asset.code,
            description: asset.description,
            currentMarketValue: asset.currentMarketValue,
            amount: asset.amount,
            desiredPercentageValue: asset.desiredPercentageValue,
          }))
        : undefined,
    };
  }
}
