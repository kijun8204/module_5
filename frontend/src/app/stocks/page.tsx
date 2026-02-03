'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Stock } from '@/types/stock';
import * as stockApi from '@/lib/api/stock';

export default function StocksPage() {
  return (
    <ProtectedRoute>
      <StocksContent />
    </ProtectedRoute>
  );
}

function StocksContent() {
  const { token } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStocks = async (isInitialLoad: boolean = false) => {
    if (!token) return;

    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      const response = await stockApi.getKospiTop10(token);
      setStocks(response.stocks);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '주식 정보를 불러오는데 실패했습니다.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchStocks(true);
  }, [token]);

  // 1분(60초)마다 자동 새로고침
  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      fetchStocks(false);
    }, 60000); // 60초 = 1분

    // 컴포넌트 언마운트 시 interval 정리
    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  /**
   * 숫자를 천 단위 콤마 형식으로 변환
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  /**
   * 등락률 포맷 (소수점 2자리, % 포함)
   */
  const formatChangeRate = (rate: number): string => {
    const sign = rate > 0 ? '+' : '';
    return `${sign}${rate.toFixed(2)}%`;
  };

  /**
   * 전일대비 포맷 (부호 포함)
   */
  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${formatNumber(change)}`;
  };

  /**
   * 변동에 따른 색상 클래스 반환
   * 한국 주식: 상승 = 빨간색, 하락 = 파란색
   */
  const getChangeColorClass = (change: number): string => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">주식 현황</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchStocks(false)}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                새로고침
              </button>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                대시보드로 돌아가기
              </Link>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-gray-600">코스피 시가총액 TOP 10 종목</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span>1분마다 자동 갱신</span>
              {lastUpdated && (
                <span className="ml-3">
                  마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">주식 정보를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 주식 테이블 */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      순위
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      종목코드
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      종목명
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      현재가
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전일대비
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등락률
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      거래량
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stocks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        표시할 주식 정보가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    stocks.map((stock, index) => (
                      <tr key={stock.ticker} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {stock.ticker}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stock.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {formatNumber(stock.current_price)}원
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getChangeColorClass(stock.change)}`}>
                          {formatChange(stock.change)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getChangeColorClass(stock.change_rate)}`}>
                          {formatChangeRate(stock.change_rate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                          {formatNumber(stock.volume)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 테이블 푸터 */}
            {stocks.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  총 {stocks.length}개 종목
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
