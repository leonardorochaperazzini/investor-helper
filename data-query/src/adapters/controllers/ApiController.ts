import express from 'express';
import { SyncController } from './SyncController';
import { AssetController } from './AssetController';
import { CurrencyController } from './CurrencyController';
import { GroupController } from './GroupController';

export class ApiController {
  private readonly router = express.Router();

  constructor(
    private readonly syncController: SyncController,
    private readonly assetController: AssetController,
    private readonly currencyController: CurrencyController,
    private readonly groupController: GroupController
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    // Mount asset routes
    this.router.use('/assets', this.assetController.getRouter());
    
    // Mount sync routes
    this.router.use('/sync', this.syncController.getRouter());
    
    // Mount currency routes
    this.router.use('/currency', this.currencyController.getRouter());
    
    // Mount group routes
    this.router.use('/groups', this.groupController.getRouter());
  }

  getRouter() {
    return this.router;
  }
}
