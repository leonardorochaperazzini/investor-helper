import { IPriceProvider } from '../../../application/ports/IPriceProvider';
import { BrapiClient } from '../common/BrapiClient';

export class EtfBrPriceService implements IPriceProvider {
  private readonly client = new BrapiClient();

  async getCurrentPrice(code: string): Promise<number> {
    try {
      return await this.client.getQuotePrice(code);
    } catch (_e) {
      throw new Error(`Failed to fetch price from BRAPI for ${code} - reason: ${String(_e)}`);
    }
  }
}
