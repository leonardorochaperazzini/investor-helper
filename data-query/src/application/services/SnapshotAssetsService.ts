import { IFinancialAssetRepository } from '../repositories/IFinancialAssetRepository';
import { PrismaClient } from '@prisma/client';

export class SnapshotAssetsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly repository: IFinancialAssetRepository
  ) {}

  async execute(): Promise<void> {
    const assets = await this.repository.findAll();

    if (assets.length === 0) return;

    // Load group desired values for assets that have groupId
    const groupIds = Array.from(new Set(assets.map((a) => a.groupId).filter((id): id is number => id != null)));
    const groups = await this.prisma.investGroup.findMany({
      where: { id: { in: groupIds } },
      select: { id: true, desiredPercentageValue: true },
    });
    const groupDesiredById = new Map<number, number | null>(
      groups.map((g: { id: number; desiredPercentageValue: number | null }) => [g.id, g.desiredPercentageValue ?? null])
    );

    // Load type codes for assets
    const typeIds = Array.from(new Set(assets.map((a) => a.typeId)));
    const types = await this.prisma.financialAssetType.findMany({
      where: { id: { in: typeIds } },
      select: { id: true, code: true },
    });
    const typeCodeById = new Map<number, string>(
      types.map((t: { id: number; code: string }) => [t.id, t.code])
    );

    // Use date only
    const today = new Date();
    const insertedDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    await this.prisma.financialAssetHistory.createMany({
      data: assets.map((a) => ({
        code: a.code,
        desiredPercentageValue: a.desiredPercentageValue ?? null,
        marketValue: a.currentMarketValue ?? null,
        amount: a.amount ?? null,
        typeCode: typeCodeById.get(a.typeId) ?? null,
        groupdesiredPercentageValue: a.groupId != null ? (groupDesiredById.get(a.groupId) ?? null) : null,
        insertedDate,
      })),
      skipDuplicates: true,
    });
  }
}
