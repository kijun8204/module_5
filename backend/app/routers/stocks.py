from fastapi import APIRouter, HTTPException
from app.schemas.stock import StockListResponse
from app.services.stock import StockService

router = APIRouter(prefix="/api/stocks", tags=["stocks"])


@router.get("/kospi-top10", response_model=StockListResponse)
def get_kospi_top10():
    """코스피 시총 TOP 10 종목 현재가 조회"""
    try:
        stocks = StockService.get_kospi_top10()
        return StockListResponse(
            stocks=stocks,
            count=len(stocks)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"주식 데이터 조회 중 오류가 발생했습니다: {str(e)}"
        )
