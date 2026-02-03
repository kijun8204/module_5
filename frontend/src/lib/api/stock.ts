import { StockListResponse } from '@/types/stock';

/**
 * 코스피 시총 TOP 10 조회 API
 * GET /api/stocks/kospi-top10
 */
export async function getKospiTop10(token: string): Promise<StockListResponse> {
  const res = await fetch('/api/stocks/kospi-top10', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '주식 정보를 가져올 수 없습니다.');
  }

  return res.json();
}
