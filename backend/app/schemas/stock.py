from __future__ import annotations
from pydantic import BaseModel


class StockInfo(BaseModel):
    """개별 종목 정보"""
    ticker: str  # 종목코드
    name: str  # 종목명
    current_price: int  # 현재가
    change: int  # 전일대비
    change_rate: float  # 등락률 (%)
    volume: int  # 거래량


class StockListResponse(BaseModel):
    """종목 리스트 응답"""
    stocks: list[StockInfo]
    count: int
