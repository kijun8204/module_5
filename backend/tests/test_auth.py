"""Auth API 테스트"""


def test_register_success(client):
    """회원가입 성공 테스트"""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_username(client):
    """중복 username 회원가입 실패 테스트"""
    # 첫 번째 회원가입
    client.post(
        "/api/auth/register",
        json={
            "username": "duplicateuser",
            "email": "first@example.com",
            "password": "password123"
        }
    )

    # 동일한 username으로 두 번째 회원가입 시도
    response = client.post(
        "/api/auth/register",
        json={
            "username": "duplicateuser",
            "email": "second@example.com",
            "password": "password456"
        }
    )

    assert response.status_code == 400
    assert "Username already" in response.json()["detail"]


def test_login_success(client):
    """로그인 성공 테스트"""
    # 회원가입
    client.post(
        "/api/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "loginpassword123"
        }
    )

    # 로그인 (form 형식)
    response = client.post(
        "/api/auth/login",
        data={
            "username": "loginuser",
            "password": "loginpassword123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """잘못된 비밀번호 로그인 실패 테스트"""
    # 회원가입
    client.post(
        "/api/auth/register",
        json={
            "username": "wrongpassuser",
            "email": "wrongpass@example.com",
            "password": "correctpassword"
        }
    )

    # 잘못된 비밀번호로 로그인 시도
    response = client.post(
        "/api/auth/login",
        data={
            "username": "wrongpassuser",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401


def test_get_me_success(client):
    """토큰으로 사용자 정보 조회 성공 테스트"""
    # 회원가입
    client.post(
        "/api/auth/register",
        json={
            "username": "meuser",
            "email": "me@example.com",
            "password": "mepassword123"
        }
    )

    # 로그인하여 토큰 획득
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "meuser",
            "password": "mepassword123"
        }
    )
    token = login_response.json()["access_token"]

    # /me 엔드포인트 호출
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "meuser"


def test_get_me_invalid_token(client):
    """잘못된 토큰으로 사용자 정보 조회 실패 테스트"""
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )

    assert response.status_code == 401
