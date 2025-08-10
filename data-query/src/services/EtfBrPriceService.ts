import axios from 'axios';
import { IAssetPriceService } from '../interfaces/IAssetPriceService';

export class EtfBrPriceService implements IAssetPriceService {
  async get_current_price(code: string): Promise<number> {
    
    try {
      const token = process.env.BRAPI_TOKEN;
      const url = `https://brapi.dev/api/quote/${encodeURIComponent(code)}`;
      const { data } = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const item = data?.results?.[0];
      if (item?.regularMarketPrice) {
        return Number(item.regularMarketPrice);
      } else {
        throw new Error(`Price not found for ${code}`);
      }
    } catch (_e) {
      throw new Error(`Failed to fetch price from BRAPI for ${code} - reason: ${String(_e)}`);
    }
  }
}
