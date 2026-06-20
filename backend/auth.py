"""Lightweight admin auth for The Neoverse.

Single-admin pattern: a shared ADMIN_PASSWORD (env var) issues a signed JWT.
No user registration. Suitable for a personal living-archive site.

IMPORTANT: All env vars are read at CALL time (not at module import time).
This means rotating ADMIN_PASSWORD / JWT_SECRET in .env and restarting the
backend always takes effect — even though auth.py is imported before
server.py calls load_dotenv().
"""
from __future__ import annotations

import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

JWT_ALG = "HS256"


def _admin_password() -> str:
    # Fail fast if not configured. We deliberately do NOT ship a hardcoded
    # fallback so a missing env var can never authenticate anyone.
    val = os.environ.get("ADMIN_PASSWORD")
    if not val:
        raise RuntimeError(
            "ADMIN_PASSWORD is not set. Configure it in /app/backend/.env "
            "(see README) before the admin panel can be used."
        )
    return val


def _jwt_secret() -> str:
    val = os.environ.get("JWT_SECRET")
    if not val:
        raise RuntimeError(
            "JWT_SECRET is not set. Configure a long random string in "
            "/app/backend/.env before issuing admin tokens."
        )
    return val


def _jwt_ttl_seconds() -> int:
    return int(os.environ.get("JWT_TTL_SECONDS", "86400"))


bearer_scheme = HTTPBearer(auto_error=False)


def verify_admin_password(password: str) -> bool:
    # Constant-time comparison to resist timing side-channel attacks.
    return hmac.compare_digest((password or "").encode("utf-8"),
                               _admin_password().encode("utf-8"))


def create_admin_token() -> tuple[str, int]:
    ttl = _jwt_ttl_seconds()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "admin",
        "role": "admin",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=ttl)).timestamp()),
    }
    token = jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALG)
    return token, ttl


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc


async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token"
        )
    payload = decode_token(creds.credentials)
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
        )
    return payload
