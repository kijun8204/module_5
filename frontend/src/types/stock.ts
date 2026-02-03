/**
 * 주식 종목 정보
 */
export interface Stock {
  ticker: string;
  name: string;
  current_price: number;
  change: number;
  change_rate: number;
  volume: number;
}

/**
 * 주식 목록 응답
 */
export interface StockListResponse {
  stocks: Stock[];
  count: number;
}
