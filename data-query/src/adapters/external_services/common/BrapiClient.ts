import axios, { AxiosInstance } from 'axios';

export class BrapiClient {
  private readonly http: AxiosInstance;
  private readonly token?: string;

  constructor(token: string | undefined = process.env.BRAPI_TOKEN) {
    this.token = token;
    this.http = axios.create({ baseURL: 'https://brapi.dev/api' });
  }

  async getQuotePrice(code: string): Promise<number> {
    const url = `/quote/${encodeURIComponent(code)}`;
    const headers: Record<string, string> = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const { data } = await this.http.get(url, { headers });
    const item = data?.results?.[0];
    if (item?.regularMarketPrice) return Number(item.regularMarketPrice);
    throw new Error(`Price not found for ${code}`);
  }
}
