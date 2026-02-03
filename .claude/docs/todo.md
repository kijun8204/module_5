# TODO List

이 문서는 프로젝트에서 구현해야 할 기능들을 추적합니다.

---

## [완료] Feature 1: 로그인/회원가입 기능

### DB (db-agent)
- [x] User 모델 설계 (`backend/app/models/user.py`)
- [x] User CRUD 함수 (`backend/app/crud/user.py`)

### BE (be-agent)
- [x] Pydantic 스키마 (`backend/app/schemas/auth.py`)
- [x] 인증 유틸리티 (`backend/app/utils/auth.py`)
- [x] 인증 API 엔드포인트 (`backend/app/routers/auth.py`)
- [x] 의존성 설치 (python-jose, passlib, python-multipart)
- [x] 환경변수 설정 (.env)

### FE (fe-agent)
- [x] TypeScript 타입 정의 (`frontend/src/types/auth.ts`)
- [x] API 호출 함수 (`frontend/src/lib/api/auth.ts`)
- [x] 인증 Context (`frontend/src/contexts/AuthContext.tsx`)
- [x] 로그인 페이지 (`frontend/src/app/login/page.tsx`)
- [x] 회원가입 페이지 (`frontend/src/app/register/page.tsx`)
- [x] 대시보드 페이지 (`frontend/src/app/dashboard/page.tsx`)
- [x] 메인 페이지 로그인 리다이렉트

---

## Feature 2: 주식 현황 기능

코스피 시총 TOP 10 종목의 현재가격을 테이블 형태로 보여주는 기능

### BE (be-agent)

#### 2.1 주식 API 엔드포인트
- [ ] 주식 라우터 작성 (`backend/app/routers/stocks.py`)
  - [ ] `GET /api/stocks/kospi-top10` - 코스피 시총 TOP 10 현재가 조회
- [ ] 주식 스키마 작성 (`backend/app/schemas/stock.py`)
  - [ ] `StockInfo` - 종목 정보 (종목코드, 종목명, 현재가, 등락률 등)
  - [ ] `StockListResponse` - 종목 리스트 응답

#### 2.2 외부 API 연동
- [ ] 주식 데이터 서비스 작성 (`backend/app/services/stock.py`)
  - [ ] 한국투자증권 API 또는 공공데이터 API 연동
  - [ ] 또는 yfinance, pykrx 라이브러리 활용
  - [ ] 코스피 시총 TOP 10 종목 데이터 조회

#### 2.3 의존성 설치
- [ ] `requirements.txt`에 의존성 추가
  - [ ] `pykrx` 또는 `yfinance` (주식 데이터)
  - [ ] `httpx` 또는 `aiohttp` (비동기 HTTP 클라이언트, 필요시)

### FE (fe-agent)

#### 2.4 주식 관련 타입 정의
- [ ] TypeScript 인터페이스 작성 (`frontend/src/types/stock.ts`)
  - [ ] `Stock` - 종목 정보
  - [ ] `StockListResponse` - 종목 리스트 응답

#### 2.5 API 호출 함수
- [ ] 주식 API 함수 작성 (`frontend/src/lib/api/stock.ts`)
  - [ ] `getKospiTop10()` - 코스피 TOP 10 조회

#### 2.6 주식 현황 페이지
- [ ] 주식 현황 페이지 작성 (`frontend/src/app/stocks/page.tsx`)
  - [ ] 페이지 제목 (주식 현황)
  - [ ] 코스피 시총 TOP 10 테이블
    - [ ] 순위
    - [ ] 종목코드
    - [ ] 종목명
    - [ ] 현재가
    - [ ] 전일대비 (등락률)
    - [ ] 거래량 (선택)
  - [ ] 로딩 상태 표시
  - [ ] 에러 처리

#### 2.7 네비게이션 메뉴 추가
- [ ] 사이드바 또는 헤더에 "주식 현황" 메뉴 추가
- [ ] 로그인한 사용자만 접근 가능하도록 설정

---

## 작업 순서 (권장)

1. **BE**: 주식 스키마 정의 (2.1)
2. **BE**: 외부 API 연동 서비스 (2.2, 2.3)
3. **BE**: 주식 API 엔드포인트 (2.1)
4. **FE**: 타입 정의 및 API 함수 (2.4, 2.5)
5. **FE**: 주식 현황 페이지 (2.6)
6. **FE**: 네비게이션 메뉴 추가 (2.7)

---

## 참고사항

### 코스피 시총 TOP 10 종목 (2024년 기준)
1. 삼성전자 (005930)
2. SK하이닉스 (000660)
3. LG에너지솔루션 (373220)
4. 삼성바이오로직스 (207940)
5. 현대차 (005380)
6. 기아 (000270)
7. 셀트리온 (068270)
8. KB금융 (105560)
9. 신한지주 (055550)
10. POSCO홀딩스 (005490)

### 주식 데이터 소스 옵션
- **pykrx**: 한국거래소 데이터 (무료, 간편)
- **FinanceDataReader**: 다양한 금융 데이터 (무료)
- **한국투자증권 OpenAPI**: 실시간 데이터 (API 키 필요)
- **공공데이터포털**: 금융위원회 API (API 키 필요)
