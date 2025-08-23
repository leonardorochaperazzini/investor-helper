import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaInvestGroupRepository } from '../repositories/PrismaInvestGroupRepository';
import { UpdateInvestGroupService } from '../../application/services/UpdateInvestGroupService';
import { UpdateInvestGroupDTO } from '../../application/repositories/IInvestGroupRepository';

export class GroupController {
  private readonly router = express.Router();
  private readonly updateGroupService: UpdateInvestGroupService;

  constructor(prisma: PrismaClient) {
    const repository = new PrismaInvestGroupRepository(prisma);
    this.updateGroupService = new UpdateInvestGroupService(repository);
    this.setupRoutes();
  }

  private setupRoutes() {
    /**
     * @swagger
     * /api/groups/{id}:
     *   put:
     *     summary: Atualiza os atributos de um grupo de investimento
     *     tags: [Groups]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do grupo de investimento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               desiredPercentageValue:
     *                 type: number
     *     responses:
     *       200:
     *         description: Grupo atualizado com sucesso
     *       404:
     *         description: Grupo não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.put('/:id', this.updateGroup.bind(this));
  }

  getRouter() {
    return this.router;
  }

  private async updateGroup(req: express.Request, res: express.Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data: UpdateInvestGroupDTO = req.body;
      
      // Validações básicas
      if (data.desiredPercentageValue !== undefined && (isNaN(data.desiredPercentageValue) || data.desiredPercentageValue < 0 || data.desiredPercentageValue > 100)) {
        return res.status(400).json({ error: 'Percentual desejado deve ser um número entre 0 e 100' });
      }

      const success = await this.updateGroupService.execute(id, data);
      if (success) {
        res.json({
          message: 'Grupo de investimento atualizado com sucesso'
        });
      } else {
        res.status(500).json({
          error: 'Erro ao atualizar grupo de investimento'
        });
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: express.Response) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('not found')) {
      return res.status(404).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
}
