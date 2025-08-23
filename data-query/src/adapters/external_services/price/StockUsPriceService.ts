import { IPriceProvider } from '../../../application/ports/IPriceProvider';
import { AlphaVantageClient } from '../common/AlphaVantageClient';

export class StockUsPriceService implements IPriceProvider {
  private readonly client = new AlphaVantageClient();

  async getCurrentPrice(code: string): Promise<number> {
    try {
      return await this.client.getQuotePrice(code);
    } catch (_e) {
      throw new Error(`Failed to fetch price from Alpha Vantage for ${code} - reason: ${String(_e)}`);
    }
  }
}
