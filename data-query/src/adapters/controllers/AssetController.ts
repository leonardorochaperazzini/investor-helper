import express from 'express';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';
import { AssetTypeCode, AssetType } from '../../domain/value_objects/AssetType';
import { IFinancialAssetRepository, UpdateFinancialAssetDTO } from '../../application/repositories/IFinancialAssetRepository';
import { IInvestGroupRepository } from '../../application/repositories/IInvestGroupRepository';
import { UpdateFinancialAssetService } from '../../application/services/UpdateFinancialAssetService';
import { PrismaClient } from '@prisma/client';
import { PrismaInvestGroupRepository } from '../repositories/PrismaInvestGroupRepository';

export class AssetController {
  private readonly router = express.Router();
  private readonly updateAssetService: UpdateFinancialAssetService;
  private readonly groupRepository: IInvestGroupRepository;

  constructor(
    private readonly repository: IFinancialAssetRepository,
    private readonly prisma: PrismaClient
  ) {
    this.groupRepository = new PrismaInvestGroupRepository(prisma);
    this.updateAssetService = new UpdateFinancialAssetService(repository, this.groupRepository);
    this.setupRoutes();
  }

  private setupRoutes() {
    /**
     * @swagger
     * /api/assets:
     *   get:
     *     summary: Get all assets
     *     tags: [Assets]
     *     responses:
     *       200:
     *         description: List of all financial assets
     */
    this.router.get('/', this.getAllAssets.bind(this));

    /**
     * @swagger
     * /api/assets/types:
     *   get:
     *     summary: Get all asset types
     *     tags: [Assets]
     *     responses:
     *       200:
     *         description: List of all asset types
     */
    this.router.get('/types', this.getAllAssetTypes.bind(this));

    /**
     * @swagger
     * /api/assets/type/{typeCode}:
     *   get:
     *     summary: Get assets by type
     *     tags: [Assets]
     *     parameters:
     *       - in: path
     *         name: typeCode
     *         schema:
     *           type: string
     *         required: true
     *         description: Asset type code
     *     responses:
     *       200:
     *         description: List of assets of specified type
     */
    this.router.get('/type/:typeCode', this.getAssetsByType.bind(this));

    /**
     * @swagger
     * /api/assets/{code}:
     *   get:
     *     summary: Get asset by code
     *     tags: [Assets]
     *     parameters:
     *       - in: path
     *         name: code
     *         schema:
     *           type: string
     *         required: true
     *         description: Asset code
     *     responses:
     *       200:
     *         description: Asset details
     *       404:
     *         description: Asset not found
     */
    this.router.get('/:code', this.getAssetByCode.bind(this));
    
    /**
     * @swagger
     * /api/assets/{id}:
     *   put:
     *     summary: Atualiza os atributos de um ativo financeiro
     *     tags: [Assets]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do ativo financeiro
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                 type: string
     *               desiredPercentageValue:
     *                 type: number
     *               amount:
     *                 type: number
     *               groupId:
     *                 type: integer
     *                 nullable: true
     *     responses:
     *       200:
     *         description: Ativo atualizado com sucesso
     *       404:
     *         description: Ativo ou grupo não encontrado
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro interno
     */
    this.router.put('/:id', this.updateAsset.bind(this));
  }

  getRouter() {
    return this.router;
  }

  private async getAllAssets(req: express.Request, res: express.Response) {
    try {
      const assets = await this.repository.findAll();
      res.json(assets);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async getAllAssetTypes(req: express.Request, res: express.Response) {
    try {
      // Retorna todos os tipos de assets do enum AssetType
      const assetTypes = Object.entries(AssetType).map(([key, code]) => ({
        key,
        code,
        description: this.getAssetTypeDescription(code as AssetTypeCode)
      }));
      
      res.json(assetTypes);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async getAssetByCode(req: express.Request, res: express.Response) {
    try {
      const { code } = req.params;
      const asset = await this.repository.findByCode(code);
      
      if (!asset) {
        return res.status(404).json({ error: `Asset with code ${code} not found` });
      }
      
      res.json(asset);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async getAssetsByType(req: express.Request, res: express.Response) {
    try {
      const { typeCode } = req.params;
      const assets = await this.repository.findByTypeCode(typeCode as AssetTypeCode);
      res.json(assets);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Helper para obter descrições mais amigáveis dos tipos de assets
  private getAssetTypeDescription(typeCode: AssetTypeCode): string {
    const descriptions: Record<AssetTypeCode, string> = {
      'stock-br': 'Ações Brasil',
      'stock-us': 'Ações EUA',
      'etf-br': 'ETFs Brasil',
      'etf-us': 'ETFs EUA',
      'etf-cripto-br': 'ETFs de Criptomoedas Brasil',
      'real-estate-funds-br': 'Fundos Imobiliários Brasil',
      'reit-us': 'REITs EUA',
      'fixed-income-br': 'Renda Fixa Brasil',
      'fixed-income-us': 'Renda Fixa EUA',
      'reservation-money': 'Reserva de Emergência',
      'fgts-br': 'FGTS Brasil'
    };
    
    return descriptions[typeCode] || typeCode;
  }

  private handleError(error: unknown, res: express.Response) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('not found')) {
      return res.status(404).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
  
  private async updateAsset(req: express.Request, res: express.Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data: UpdateFinancialAssetDTO = req.body;
      
      // Validações básicas
      if (data.desiredPercentageValue !== undefined && (isNaN(data.desiredPercentageValue) || data.desiredPercentageValue < 0 || data.desiredPercentageValue > 100)) {
        return res.status(400).json({ error: 'Percentual desejado deve ser um número entre 0 e 100' });
      }

      if (data.amount !== undefined && (isNaN(data.amount) || data.amount < 0)) {
        return res.status(400).json({ error: 'Quantidade deve ser um número positivo' });
      }

      const updatedAsset = await this.updateAssetService.execute(id, data);
      res.json({
        message: 'Ativo atualizado com sucesso',
        asset: updatedAsset
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
