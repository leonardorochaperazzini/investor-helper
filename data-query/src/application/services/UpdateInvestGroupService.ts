import { IInvestGroupRepository, UpdateInvestGroupDTO } from '../repositories/IInvestGroupRepository';

export class UpdateInvestGroupService {
  constructor(private readonly repository: IInvestGroupRepository) {}

  async execute(id: number, data: UpdateInvestGroupDTO): Promise<boolean> {
    // Verificar se o grupo existe
    const group = await this.repository.findById(id);
    if (!group) {
      throw new Error(`Invest group with ID ${id} not found`);
    }

    // Atualizar o grupo
    return await this.repository.update(id, data);
  }
}
