import { SyncAssetsByTypeService } from '../../application/services/SyncAssetsByTypeService';
import { AssetTypeCode } from '../../domain/value-objects/AssetType';

export class PriceSyncController {
  constructor(private readonly syncService: SyncAssetsByTypeService) {}

  async syncByTypeCode(typeCode: AssetTypeCode): Promise<void> {
    await this.syncService.execute(typeCode);
  }
}
