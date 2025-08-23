import { IFinancialAssetRepository, UpdateFinancialAssetDTO } from '../repositories/IFinancialAssetRepository';
import { IInvestGroupRepository } from '../repositories/IInvestGroupRepository';
import { FinancialAsset } from '../../domain/entities/FinancialAsset';

export class UpdateFinancialAssetService {
  constructor(
    private readonly repository: IFinancialAssetRepository,
    private readonly groupRepository: IInvestGroupRepository
  ) {}

  async execute(id: number, data: UpdateFinancialAssetDTO): Promise<FinancialAsset> {
    // Verificar se o ativo existe
    const asset = await this.repository.findByCode(id.toString());
    if (!asset) {
      throw new Error(`Financial asset with ID ${id} not found`);
    }

    // Se um groupId for fornecido, verificar se o grupo existe
    if (data.groupId !== undefined) {
      if (data.groupId !== null) {
        const group = await this.groupRepository.findById(data.groupId);
        if (!group) {
          throw new Error(`Invest group with ID ${data.groupId} not found`);
        }
        
        // Verificar se o grupo é compatível com o tipo de ativo
        if (group.typeId !== asset.typeId) {
          throw new Error(`Invest group with ID ${data.groupId} is not compatible with the asset type`);
        }
      }
    }

    // Atualizar o ativo
    return await this.repository.updateFinancialAsset(id, data);
  }
}
