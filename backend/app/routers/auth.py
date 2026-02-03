from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import user as user_crud
from app.schemas import UserCreate, UserResponse, Token
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """회원가입

    Args:
        user: 회원가입 정보 (username, email, password)
        db: 데이터베이스 세션

    Returns:
        생성된 사용자 정보

    Raises:
        HTTPException 400: username 또는 email 중복 시
    """
    # 중복 username 체크
    existing_user = user_crud.get_user_by_username(db, username=user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # 중복 email 체크
    existing_email = user_crud.get_user_by_email(db, email=user.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 비밀번호 해싱
    hashed_password = hash_password(user.password)

    # 사용자 생성
    db_user = user_crud.create_user(
        db,
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    return db_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """로그인

    OAuth2 표준에 따라 application/x-www-form-urlencoded 형식으로 요청합니다.
    - username: 사용자명
    - password: 비밀번호

    Args:
        form_data: OAuth2PasswordRequestForm (username, password)
        db: 데이터베이스 세션

    Returns:
        JWT 토큰 (access_token, token_type)

    Raises:
        HTTPException 401: 인증 실패 시
    """
    # 사용자 조회
    user = user_crud.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 비밀번호 검증
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 비활성 사용자 체크
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # JWT 토큰 생성
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    """현재 로그인된 사용자 정보 조회

    Authorization 헤더에 Bearer 토큰이 필요합니다.

    Args:
        current_user: 현재 인증된 사용자 (의존성 주입)

    Returns:
        현재 사용자 정보
    """
    return current_user
