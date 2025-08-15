export interface IPriceProvider {
  getCurrentPrice(code: string): Promise<number>;
}
