import express from 'express';
import { AssetTypeCode, AssetType } from '../../domain/value_objects/AssetType';
import { SyncAssetsByTypeService } from '../../application/services/SyncAssetsByTypeService';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { PrismaClient } from '@prisma/client';
import { SnapshotAssetsService } from '../../application/services/SnapshotAssetsService';
import { PrismaFinancialAssetRepository } from '../repositories/PrismaFinancialAssetRepository';

export class SyncController {
  private readonly router = express.Router();
  private readonly prisma: PrismaClient;
  private readonly repository: PrismaFinancialAssetRepository;

  constructor(
    private readonly syncService: SyncAssetsByTypeService,
    prisma: PrismaClient
  ) {
    this.setupRoutes();
    this.prisma = prisma;
    this.repository = new PrismaFinancialAssetRepository(prisma);
  }

  private setupRoutes() {
    /**
     * @swagger
     * /api/sync/type/{typeCode}:
     *   post:
     *     summary: Sync assets of a specific type
     *     tags: [Sync]
     *     parameters:
     *       - in: path
     *         name: typeCode
     *         schema:
     *           type: string
     *         required: true
     *         description: Asset type code to sync
     *     responses:
     *       200:
     *         description: Assets synced successfully
     *       400:
     *         description: Invalid type code
     */
    this.router.post('/type/:typeCode', this.syncAssetsByType.bind(this));

    /**
     * @swagger
     * /api/sync/all:
     *   post:
     *     summary: Sync all assets
     *     tags: [Sync]
     *     responses:
     *       200:
     *         description: All assets synced successfully
     */
    this.router.post('/all', this.syncAllAssets.bind(this));
  }

  getRouter() {
    return this.router;
  }

  private async syncAssetsByType(req: express.Request, res: express.Response) {
    try {
      const { typeCode } = req.params;
      
      // Validar se o typeCode é válido
      if (!Object.values(AssetType).includes(typeCode as AssetTypeCode)) {
        return res.status(400).json({ 
          error: `Invalid asset type code: ${typeCode}`,
          validTypes: Object.values(AssetType)
        });
      }
      
      const updatedAssets = await this.syncService.execute(typeCode as AssetTypeCode);
      res.json({
        message: `Assets of type ${typeCode} synced successfully`,
        count: updatedAssets.length,
        assets: updatedAssets
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async syncAllAssets(req: express.Request, res: express.Response) {
    try {
      const results: Record<string, any> = {};
      let totalCount = 0;
      
      // Sync all supported asset types
      for (const key of Object.keys(AssetType)) {
        const typeCode = AssetType[key as keyof typeof AssetType];
        try {
          const assets = await this.syncService.execute(typeCode);
          results[typeCode] = {
            count: assets.length,
            success: true
          };
          totalCount += assets.length;
        } catch (error) {
          console.error(`Error syncing ${typeCode}:`, error);
          results[typeCode] = {
            count: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
      
      // Execute snapshot after all syncs are complete
      try {
        console.log('Running snapshot after sync completion...');
        const snapshotService = new SnapshotAssetsService(this.prisma, this.repository);
        await snapshotService.execute();
        console.log('Snapshot completed successfully.');
        
        res.json({
          message: 'All assets synced successfully and snapshot created',
          totalCount,
          results,
          snapshot: {
            status: 'success',
            timestamp: new Date().toISOString()
          }
        });
      } catch (snapshotError) {
        console.error('Error creating snapshot:', snapshotError);
        res.json({
          message: 'All assets synced successfully but snapshot failed',
          totalCount,
          results,
          snapshot: {
            status: 'failed',
            error: snapshotError instanceof Error ? snapshotError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Public methods for internal use
  async syncByTypeCode(typeCode: AssetTypeCode): Promise<FinancialAsset[]> {
    return await this.syncService.execute(typeCode);
  }

  async syncAll(): Promise<Record<string, FinancialAsset[]>> {
    const results: Record<string, FinancialAsset[]> = {};
    
    // Sync all supported asset types
    for (const key of Object.keys(AssetType)) {
      const typeCode = AssetType[key as keyof typeof AssetType];
      try {
        results[typeCode] = await this.syncService.execute(typeCode);
      } catch (error) {
        console.error(`Error syncing ${typeCode}:`, error);
        results[typeCode] = [];
      }
    }
    
    // Execute snapshot after all syncs are complete
    try {
      console.log('Running snapshot after sync completion...');
      const snapshotService = new SnapshotAssetsService(this.prisma, this.repository);
      await snapshotService.execute();
      console.log('Snapshot completed successfully.');
    } catch (error) {
      console.error('Error creating snapshot:', error);
    }
    
    return results;
  }

  private handleError(error: unknown, res: express.Response) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
