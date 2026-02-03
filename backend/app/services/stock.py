from __future__ import annotations
from datetime import datetime, timedelta
from pykrx import stock
from app.schemas.stock import StockInfo


# 코스피 시총 TOP 10 종목 코드
KOSPI_TOP10_TICKERS = [
    "005930",  # 삼성전자
    "000660",  # SK하이닉스
    "373220",  # LG에너지솔루션
    "207940",  # 삼성바이오로직스
    "005380",  # 현대차
    "000270",  # 기아
    "068270",  # 셀트리온
    "105560",  # KB금융
    "055550",  # 신한지주
    "005490",  # POSCO홀딩스
]


class StockService:
    """주식 데이터 조회 서비스"""

    @staticmethod
    def get_latest_trading_date() -> str:
        """최근 거래일 조회 (주말/공휴일 고려)"""
        today = datetime.now()
        # 최근 7일 중 거래일 찾기
        for i in range(7):
            check_date = today - timedelta(days=i)
            date_str = check_date.strftime("%Y%m%d")
            try:
                # 해당 날짜에 데이터가 있는지 확인
                df = stock.get_market_ohlcv_by_ticker(date_str, market="KOSPI")
                if not df.empty:
                    return date_str
            except Exception:
                continue
        # 기본값으로 오늘 반환
        return today.strftime("%Y%m%d")

    @staticmethod
    def get_kospi_top10() -> list[StockInfo]:
        """코스피 시총 TOP 10 종목 현재가 조회"""
        result = []
        trading_date = StockService.get_latest_trading_date()

        # 전일 거래일 계산 (최근 5일 중에서 찾기)
        today = datetime.strptime(trading_date, "%Y%m%d")
        prev_trading_date = None
        for i in range(1, 8):
            check_date = today - timedelta(days=i)
            date_str = check_date.strftime("%Y%m%d")
            try:
                df = stock.get_market_ohlcv_by_ticker(date_str, market="KOSPI")
                if not df.empty:
                    prev_trading_date = date_str
                    break
            except Exception:
                continue

        for ticker in KOSPI_TOP10_TICKERS:
            try:
                # 종목명 조회
                name = stock.get_market_ticker_name(ticker)

                # 최근 2일 OHLCV 데이터 조회 (현재가 및 전일 대비 계산)
                if prev_trading_date:
                    df = stock.get_market_ohlcv_by_date(
                        fromdate=prev_trading_date,
                        todate=trading_date,
                        ticker=ticker
                    )
                else:
                    df = stock.get_market_ohlcv_by_date(
                        fromdate=trading_date,
                        todate=trading_date,
                        ticker=ticker
                    )

                if df.empty:
                    continue

                # 최신 데이터 (현재가)
                current_row = df.iloc[-1]
                current_price = int(current_row["종가"])
                volume = int(current_row["거래량"])

                # 전일 대비 계산
                if len(df) >= 2:
                    prev_row = df.iloc[-2]
                    prev_price = int(prev_row["종가"])
                    change = current_price - prev_price
                    change_rate = round((change / prev_price) * 100, 2)
                else:
                    change = 0
                    change_rate = 0.0

                stock_info = StockInfo(
                    ticker=ticker,
                    name=name,
                    current_price=current_price,
                    change=change,
                    change_rate=change_rate,
                    volume=volume
                )
                result.append(stock_info)

            except Exception as e:
                # 개별 종목 조회 실패 시 스킵
                print(f"종목 {ticker} 조회 실패: {e}")
                continue

        return result
