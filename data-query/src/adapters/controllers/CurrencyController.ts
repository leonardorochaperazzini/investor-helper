import express from 'express';
import { PrismaClient } from '@prisma/client';
import { UpdateCurrencyRateService } from '../../application/services/UpdateCurrencyRateService';
import { PrismaFinancialAssetTypeRepository } from '../repositories/PrismaFinancialAssetTypeRepository';
import { IFinancialAssetTypeRepository } from '../../application/repositories/IFinancialAssetTypeRepository';

export class CurrencyController {
  private readonly router = express.Router();
  private readonly updateCurrencyService: UpdateCurrencyRateService;
  private readonly typeRepository: IFinancialAssetTypeRepository;

  constructor(prisma: PrismaClient) {
    this.typeRepository = new PrismaFinancialAssetTypeRepository(prisma);
    this.updateCurrencyService = new UpdateCurrencyRateService(this.typeRepository);
    this.setupRoutes();
  }

  private setupRoutes() {
    /**
     * @swagger
     * /api/currency/update:
     *   post:
     *     summary: Atualiza a taxa de câmbio (USD-BRL) para todos os tipos de ativos estrangeiros
     *     tags: [Currency]
     *     responses:
     *       200:
     *         description: Taxa de câmbio atualizada com sucesso
     *       500:
     *         description: Erro ao atualizar taxa de câmbio
     */
    this.router.post('/update', this.updateCurrencyRate.bind(this));

    /**
     * @swagger
     * /api/currency/rate:
     *   get:
     *     summary: Obtém a taxa de câmbio atual (USD-BRL)
     *     tags: [Currency]
     *     responses:
     *       200:
     *         description: Taxa de câmbio atual
     *       500:
     *         description: Erro ao obter taxa de câmbio
     */
    this.router.get('/rate', this.getCurrentRate.bind(this));
  }

  getRouter() {
    return this.router;
  }

  private async updateCurrencyRate(req: express.Request, res: express.Response) {
    try {
      const result = await this.updateCurrencyService.execute();
      
      res.json({
        message: 'Taxa de câmbio atualizada com sucesso',
        usdRate: result.usdRate,
        updatedTypes: result.updatedTypes
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async getCurrentRate(req: express.Request, res: express.Response) {
    try {
      const { CurrencyExchangeService } = await import('../../adapters/external_services/common/CurrencyExchangeService');
      const rate = await CurrencyExchangeService.getUsdToBrlRate();
      
      res.json({
        usdRate: rate,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: express.Response) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
