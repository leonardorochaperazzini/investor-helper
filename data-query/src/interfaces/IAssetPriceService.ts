export interface IAssetPriceService {
  get_current_price(code: string): Promise<number>;
}
