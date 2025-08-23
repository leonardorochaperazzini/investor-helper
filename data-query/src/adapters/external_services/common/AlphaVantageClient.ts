import axios, { AxiosInstance } from 'axios';

export class AlphaVantageClient {
  private readonly http: AxiosInstance;
  private readonly apiKey?: string;

  constructor(apiKey: string | undefined = process.env.ALPHAVANTAGE_API_KEY) {
    this.apiKey = apiKey;
    this.http = axios.create({ baseURL: 'https://www.alphavantage.co/query' });
  }

  async getQuotePrice(symbol: string): Promise<number> {
    const params = {
      function: 'GLOBAL_QUOTE',
      symbol: encodeURIComponent(symbol),
      apikey: this.apiKey,
    };

    const { data } = await this.http.get('', { params });
    
    // Verifica se a resposta tem o formato esperado
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      return Number(data['Global Quote']['05. price']);
    }
    
    throw new Error(`Price not found for ${symbol}`);
  }
}
