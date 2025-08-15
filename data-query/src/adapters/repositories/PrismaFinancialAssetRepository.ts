import { PrismaClient } from '@prisma/client';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { IFinancialAssetRepository } from '../../application/repositories/IFinancialAssetRepository';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export class PrismaFinancialAssetRepository implements IFinancialAssetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByTypeCode(typeCode: AssetTypeCode): Promise<FinancialAsset[]> {
    const rows = await this.prisma.financialAsset.findMany({
      where: { financialAssetType: { code: typeCode } },
      include: { financialAssetType: true },
    });

    return rows.map(
      (r: any) =>
        new FinancialAsset(
          r.id,
          r.code,
          r.description ?? null,
          r.desiredPercentageValue ?? null,
          r.currentMarketValue ?? null,
          r.amount ?? null,
          r.typeId,
          r.groupId ?? null
        )
    );
  }

  async findAll(): Promise<FinancialAsset[]> {
    const rows = await this.prisma.financialAsset.findMany({});
    return rows.map(
      (r: any) =>
        new FinancialAsset(
          r.id,
          r.code,
          r.description ?? null,
          r.desiredPercentageValue ?? null,
          r.currentMarketValue ?? null,
          r.amount ?? null,
          r.typeId,
          r.groupId ?? null
        )
    );
  }

  async updateCurrentMarketValue(id: number, value: number): Promise<void> {
    await this.prisma.financialAsset.update({
      where: { id },
      data: { currentMarketValue: value },
    });
  }
}
