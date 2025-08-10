import { PrismaClient } from '@prisma/client';
import { AssetPriceFactory } from './factories/AssetPriceFactory';

const prisma = new PrismaClient();
const factory = new AssetPriceFactory();

async function main() {
  const assets = await prisma.financialAsset.findMany({
    where: {
      financialAssetType: {
        code: 'etf-br',
      },
    },
    include: {
      financialAssetType: true,
    },
  });

  for (const asset of assets) {
    try {
      const service = factory.create(asset.financialAssetType.code as any);
      const price = await service.get_current_price(asset.code);
      console.log(`Ativo: ${asset.code} | Preço atual: ${price}`);
    } catch (err) {
      console.error(`Erro ao buscar preço de ${asset.code}:`, err);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
