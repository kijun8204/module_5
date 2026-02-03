from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    """회원가입 요청 스키마"""
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    """로그인 요청 스키마 (OAuth2 폼 사용 시 불필요)"""
    username: str
    password: str


class UserResponse(BaseModel):
    """사용자 응답 스키마"""
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """토큰 응답 스키마"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """토큰 데이터 스키마"""
    username: Optional[str] = None
