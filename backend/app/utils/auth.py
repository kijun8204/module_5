import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import get_user_by_username
from app.schemas import TokenData

# .env 파일 로드
load_dotenv()

# 환경변수
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-for-development")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# 비밀번호 해싱 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 스키마
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    """비밀번호를 해싱합니다."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 해싱된 비밀번호를 비교합니다."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT 액세스 토큰을 생성합니다.

    Args:
        data: 토큰에 포함할 데이터 (예: {"sub": username})
        expires_delta: 토큰 만료 시간 (기본값: ACCESS_TOKEN_EXPIRE_MINUTES)

    Returns:
        JWT 토큰 문자열
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[TokenData]:
    """JWT 토큰을 디코딩합니다.

    Args:
        token: JWT 토큰 문자열

    Returns:
        TokenData 또는 None (토큰이 유효하지 않은 경우)
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return TokenData(username=username)
    except JWTError:
        return None


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """현재 인증된 사용자를 반환합니다.

    FastAPI 의존성 주입으로 사용:
        @router.get("/me")
        def get_me(current_user: User = Depends(get_current_user)):
            return current_user

    Args:
        token: JWT 토큰 (Authorization 헤더에서 자동 추출)
        db: 데이터베이스 세션

    Returns:
        User 모델 객체

    Raises:
        HTTPException 401: 인증 실패 시
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = decode_access_token(token)
    if token_data is None or token_data.username is None:
        raise credentials_exception

    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
