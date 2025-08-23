import { InvestGroup } from '../../domain/entities/InvestGroup';

export interface UpdateInvestGroupDTO {
  desiredPercentageValue?: number;
}

export interface IInvestGroupRepository {
  findAll(): Promise<InvestGroup[]>;
  findById(id: number): Promise<InvestGroup | null>;
  findByTypeId(typeId: number): Promise<InvestGroup[]>;
  update(id: number, data: UpdateInvestGroupDTO): Promise<boolean>;
}
