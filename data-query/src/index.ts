import { PrismaClient } from '@prisma/client';
import { PrismaFinancialAssetRepository } from './adapters/repositories/PrismaFinancialAssetRepository';
import { SyncAssetsByTypeService } from './application/services/SyncAssetsByTypeService';
import { PriceSyncController } from './adapters/controllers/PriceSyncController';
import { PriceProviderRegistry } from './adapters/resolvers/PriceProviderRegistry';
import { EtfBrPriceService } from './adapters/external_services/price/EtfBrPriceService';
import { FiiBrPriceService } from './adapters/external_services/price/FiiBrPriceService';
import { EtfCriptoBrPriceService } from './adapters/external_services/price/EtfCriptoBrPriceService';
import { AssetType } from './domain/value-objects/AssetType';
import { SnapshotAssetsService } from './application/services/SnapshotAssetsService';

const prisma = new PrismaClient();

async function bootstrap() {
  const repository = new PrismaFinancialAssetRepository(prisma);

  const registry = new PriceProviderRegistry();
  registry.register(AssetType.EtfBr, new EtfBrPriceService());
  registry.register(AssetType.RealEstateFundsBr, new FiiBrPriceService());
  registry.register(AssetType.EtfCriptoBr, new EtfCriptoBrPriceService());

  const syncService = new SyncAssetsByTypeService(repository, registry);
  const controller = new PriceSyncController(syncService);

  await controller.syncByTypeCode(AssetType.EtfBr);
  await controller.syncByTypeCode(AssetType.RealEstateFundsBr);
  await controller.syncByTypeCode(AssetType.EtfCriptoBr);

  // Snapshot all assets after updating prices
  const snapshot = new SnapshotAssetsService(prisma, repository);
  await snapshot.execute();
}

bootstrap()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
