from __future__ import annotations
from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """ID로 사용자 조회"""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    """username으로 사용자 조회"""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    """email로 사용자 조회"""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, username: str, email: str, hashed_password: str) -> User:
    """새 사용자 생성"""
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, **kwargs) -> User | None:
    """사용자 정보 수정

    Args:
        db: 데이터베이스 세션
        user_id: 수정할 사용자 ID
        **kwargs: 수정할 필드 (username, email, hashed_password, is_active)

    Returns:
        수정된 User 객체 또는 None (사용자가 없는 경우)
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        return None

    allowed_fields = {"username", "email", "hashed_password", "is_active"}
    for key, value in kwargs.items():
        if key in allowed_fields and value is not None:
            setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user
