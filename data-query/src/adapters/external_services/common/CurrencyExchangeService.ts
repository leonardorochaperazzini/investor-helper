import axios from 'axios';

interface CurrencyResponse {
  USDBRL: {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
  }
}

export class CurrencyExchangeService {
  private static readonly API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

  /**
   * Busca o valor atual do dólar em relação ao real
   * @returns O valor do dólar em reais
   */
  public static async getUsdToBrlRate(): Promise<number> {
    try {
      const response = await axios.get<CurrencyResponse>(this.API_URL);
      
      // Obter o valor do bid (compra) como número
      const rate = parseFloat(response.data.USDBRL.bid);
      
      if (isNaN(rate) || rate <= 0) {
        throw new Error('Valor de câmbio inválido recebido da API');
      }
      
      console.log(`Taxa de câmbio USD-BRL atualizada: ${rate}`);
      return rate;
    } catch (error) {
      console.error('Erro ao buscar taxa de câmbio:', error);
      // Em caso de falha, retorna um valor padrão para não quebrar a aplicação
      return 5.0;
    }
  }
}
