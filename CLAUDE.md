# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

풀스택 웹 애플리케이션으로 프론트엔드(Next.js)와 백엔드(FastAPI)가 분리된 구조입니다.

## 기술 스택

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS (App Router 사용)
- **Backend**: Python 3.12 + FastAPI
- **Database**: SQLite (SQLAlchemy ORM)

## 환경 요구사항

- **Python**: 3.12+
- **Node.js**: 18+
- **Package Manager**: npm

> 상세한 설치 및 포팅 가이드는 [Porting Guide](.claude/docs/Porting_guide.md)를 참조하세요.

## 주요 명령어

### 백엔드 (localhost:8000)

```bash
# 가상환경 활성화 (Windows)
cd backend && .venv\Scripts\activate

# 가상환경 활성화 (Mac/Linux)
cd backend && source .venv/bin/activate

# 개발 서버 실행 (핫 리로드)
uvicorn app.main:app --reload

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화 (자동 - 서버 첫 실행 시)
# app.db 파일 삭제 후 서버 재시작하면 재생성
```

### 프론트엔드 (localhost:3000)

```bash
cd frontend

# 개발 서버 실행
npm run dev

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 아키텍처

### API 프록시
프론트엔드의 `/api/*` 요청은 `next.config.js`의 rewrites 설정을 통해 백엔드(localhost:8000)로 프록시됩니다.

### 백엔드 구조

```
backend/
├── requirements.txt      # Python 의존성
├── app.db               # SQLite 데이터베이스 (자동 생성)
└── app/
    ├── main.py          # FastAPI 앱 진입점, CORS, 라우터 등록
    ├── database.py      # SQLAlchemy 엔진, 세션, Base, get_db()
    ├── models/
    │   ├── __init__.py  # 모델 export (__all__)
    │   └── example.py   # Example ORM 모델 (샘플)
    ├── schemas/
    │   ├── __init__.py  # 스키마 export (__all__)
    │   └── example.py   # Pydantic 스키마 (요청/응답)
    └── routers/
        ├── __init__.py
        └── examples.py  # /api/examples CRUD 엔드포인트
```

**주요 설계:**
- CRUD 로직은 현재 routers에 직접 구현됨 (향후 crud/ 폴더 분리 권장)
- 비즈니스 로직은 routers에 포함 (향후 services/ 폴더 분리 권장)
- 의존성 주입: `get_db()` 함수를 FastAPI Depends로 사용

### 프론트엔드 구조

```
frontend/
├── package.json          # 의존성 및 스크립트
├── next.config.js        # API 프록시 설정
├── tsconfig.json         # TypeScript 설정 (@/* alias)
├── tailwind.config.ts    # Tailwind CSS 설정
└── src/
    └── app/
        ├── globals.css   # Tailwind 전역 스타일
        ├── layout.tsx    # Root 레이아웃
        └── page.tsx      # 홈페이지 (예: /api/health 호출)
```

**주요 설계:**
- 현재는 단순 구조 (components/, lib/, hooks/, types/ 폴더 없음)
- 향후 확장 시 다음 폴더 구조 권장:
  - `components/`: 재사용 가능한 React 컴포넌트
  - `lib/`: API 호출 함수, 유틸리티
  - `hooks/`: 커스텀 React 훅
  - `types/`: TypeScript 인터페이스

## API 문서
백엔드 실행 후 http://localhost:8000/docs 에서 Swagger UI로 API 문서 확인 가능합니다.

## 데이터베이스

- **DB 파일**: `backend/app.db` (서버 첫 실행 시 자동 생성)
- **ORM**: SQLAlchemy 2.0
- **자동 마이그레이션**: `Base.metadata.create_all(bind=engine)` (main.py:8)
- **세션 관리**: `get_db()` 의존성 주입 함수 사용
- **SQLite 설정**: `check_same_thread=False` (멀티스레드 지원)

### 데이터베이스 초기화

```bash
# DB 초기화가 필요한 경우
cd backend
rm app.db  # 기존 DB 삭제
uvicorn app.main:app --reload  # 서버 재시작 시 자동 생성
```

## 에이전트 구조

이 프로젝트는 도메인별 전문 에이전트를 사용합니다.

### 메인 에이전트 역할

메인 에이전트는 **조율자(Coordinator)** 역할만 수행합니다:

- 사용자 요청 분석 및 작업 분해
- 적절한 서브에이전트에게 작업 위임
- 서브에이전트 결과 검토 및 통합
- **skill을 직접 사용하지 않음** (서브에이전트만 skill 사용)

단, 다음과 같은 간단한 작업은 메인 에이전트가 직접 처리:
- 파일 읽기/탐색
- git 명령어 실행
- 문서 수정 (CLAUDE.md, README 등)
- 단순 설정 파일 수정

### 서브에이전트 및 담당 Skills

| 에이전트 | 담당 영역 | Skills |
|----------|----------|--------|
| `db-agent` | DB 모델, CRUD, 쿼리 최적화 | DB-model, DB-crud, DB-test, DB-refactor |
| `be-agent` | API 엔드포인트, 스키마, 비즈니스 로직 | BE-endpoint, BE-refactor, BE-test |
| `fe-agent` | 페이지, 컴포넌트, API 연동, 스타일링 | FE-page, FE-api, FE-refactor, FE-test |

### 작업 순서 (권장)

새 기능 개발 시 다음 순서로 진행합니다:

```
1. DB (db-agent)  →  2. BE (be-agent)  →  3. FE (fe-agent)
   모델/CRUD 정의       API 엔드포인트        화면/연동 구현
```

**이유**: 데이터 구조가 먼저 정의되어야 API 설계가 가능하고, API가 있어야 프론트엔드에서 연동할 수 있습니다.

### 에이전트 간 협업 규칙

1. **영역 침범 금지**: 각 에이전트는 자신의 담당 영역만 수정합니다.
   - db-agent는 `backend/app/models/`, `backend/app/database.py` (향후 `crud/` 폴더)만 수정
   - be-agent는 `backend/app/routers/`, `backend/app/schemas/` (향후 `services/` 폴더)만 수정
   - fe-agent는 `frontend/src/` 하위만 수정

2. **다른 도메인 작업 발견 시**: 직접 수행하지 않고 메인 에이전트에게 보고하여 해당 에이전트 호출을 요청합니다.
   - 예: be-agent가 DB 모델 변경이 필요하면 → "db-agent에게 User 모델 수정 필요" 보고

3. **작업 완료 보고**: 각 에이전트는 작업 완료 시 수정한 파일 목록을 반환합니다.

4. **의존성 명시**: 다른 에이전트의 작업에 의존하는 경우 명확히 알립니다.
   - 예: "be-agent 작업 전 db-agent의 User 모델 생성이 필요합니다"

## 개발 시 주의사항

### 백엔드

- **모델 변경 시**: `app.db` 삭제 후 서버 재시작 (자동 마이그레이션)
- **라우터 추가 시**: `main.py`에 `app.include_router()` 등록 필요
- **CORS 설정**: 프론트엔드 도메인이 `http://localhost:3000`으로 고정됨
- **의존성 주입**: DB 세션은 `Depends(get_db)` 패턴 사용

### 프론트엔드

- **API 호출**: `/api/*` 경로는 자동으로 백엔드(`localhost:8000`)로 프록시됨
- **TypeScript**: Path alias `@/*` 사용 가능 (예: `@/components/Button`)
- **스타일링**: Tailwind CSS 클래스 사용 (globals.css에 import됨)
- **환경변수**: `.env.local` 파일 사용 (`NEXT_PUBLIC_` 접두사 필요)

## 예제 코드

### 백엔드 API 추가 예시

1. **모델 정의** (`models/user.py`):
```python
from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
```

2. **스키마 정의** (`schemas/user.py`):
```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str

class UserResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True
```

3. **라우터 구현** (`routers/users.py`):
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

4. **라우터 등록** (`main.py`):
```python
from app.routers import users
app.include_router(users.router)
```

### 프론트엔드 API 호출 예시

```typescript
// app/users/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")  // 자동으로 localhost:8000으로 프록시됨
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

## 참고 문서

- [Porting Guide](.claude/docs/Porting_guide.md) - 설치 및 환경 설정
- [DB Agent](.claude/agents/db-agent.md) - 데이터베이스 개발 가이드
- [BE Agent](.claude/agents/be-agent.md) - 백엔드 API 개발 가이드
- [FE Agent](.claude/agents/fe-agent.md) - 프론트엔드 개발 가이드
