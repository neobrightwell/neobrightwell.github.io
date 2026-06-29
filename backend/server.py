"""The Neoverse — FastAPI server.

Serves the public archive (albums, library, symbols, roadhouse, observatory),
the Invocation email signup, and admin CRUD endpoints (single-admin JWT auth).
"""
from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

# Load .env BEFORE importing local modules so they see env vars at import time.
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from auth import (
    create_admin_token,
    require_admin,
    verify_admin_password,
)
from db_utils import serialize_doc, serialize_docs
from email_provider import get_provider
from models import (
    AdminLoginRequest,
    AdminLoginResponse,
    Album,
    AlbumIn,
    InvocationCreate,
    LibraryEntry,
    LibraryEntryIn,
    PageContent,
    PageContentIn,
    RoadhousePost,
    RoadhousePostIn,
    Subscriber,
    Symbol,
    SymbolIn,
    VisualArt,
    VisualArtIn,
    now_iso,
)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="The Neoverse", version="1.0.0")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("neoverse")


# ============================================================
# Health
# ============================================================
@api_router.get("/")
async def root():
    return {"message": "The Neoverse — archive online.", "status": "ok"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok"}
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=503, detail=str(exc)) from exc


# ============================================================
# Admin auth
# ============================================================
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(body: AdminLoginRequest):
    if not verify_admin_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    token, ttl = create_admin_token()
    return AdminLoginResponse(access_token=token, expires_in=ttl)


@api_router.get("/admin/me")
async def admin_me(admin: dict = Depends(require_admin)):
    return {"role": admin.get("role"), "sub": admin.get("sub")}


# ============================================================
# Generic CRUD factory
# ============================================================
def _build_filter(status_param: Optional[str]) -> dict:
    if status_param == "all":
        return {}
    if status_param == "draft":
        return {"status": "draft"}
    return {"status": "published"}


async def _ensure_unique_slug(collection: str, slug: str, exclude_id: Optional[str] = None):
    query: dict = {"slug": slug}
    if exclude_id:
        query["id"] = {"$ne": exclude_id}
    existing = await db[collection].find_one(query)
    if existing:
        raise HTTPException(status_code=409, detail=f"slug '{slug}' already exists")


# ----- Albums -----
@api_router.get("/albums")
async def list_albums(status_param: Optional[str] = Query(default=None, alias="status")):
    q = _build_filter(status_param)
    docs = await db.albums.find(q, {"_id": 0}).sort([("sort_order", 1), ("created_at", -1)]).to_list(1000)
    return serialize_docs(docs)


@api_router.get("/albums/{slug}")
async def get_album(slug: str):
    doc = await db.albums.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Album not found")
    return serialize_doc(doc)


@api_router.post("/admin/albums", response_model=Album)
async def create_album(payload: AlbumIn, admin: dict = Depends(require_admin)):
    await _ensure_unique_slug("albums", payload.slug)
    album = Album(**payload.model_dump())
    await db.albums.insert_one(album.model_dump())
    return album


@api_router.put("/admin/albums/{album_id}", response_model=Album)
async def update_album(album_id: str, payload: AlbumIn, admin: dict = Depends(require_admin)):
    existing = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Album not found")
    if payload.slug != existing.get("slug"):
        await _ensure_unique_slug("albums", payload.slug, exclude_id=album_id)
    merged = {**existing, **payload.model_dump(), "id": album_id, "updated_at": now_iso()}
    await db.albums.replace_one({"id": album_id}, merged)
    return Album(**merged)


@api_router.delete("/admin/albums/{album_id}")
async def delete_album(album_id: str, admin: dict = Depends(require_admin)):
    res = await db.albums.delete_one({"id": album_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    return {"deleted": True}


# ----- Library entries -----
@api_router.get("/library")
async def list_library(
    status_param: Optional[str] = Query(default=None, alias="status"),
    type_filter: Optional[str] = Query(default=None, alias="type"),
    tag: Optional[str] = None,
):
    q = _build_filter(status_param)
    if type_filter:
        q["type"] = type_filter
    if tag:
        q["tags"] = tag
    docs = await db.library.find(q, {"_id": 0}).sort([("sort_order", 1), ("created_at", -1)]).to_list(1000)
    return serialize_docs(docs)


@api_router.get("/library/{slug}")
async def get_library_entry(slug: str):
    doc = await db.library.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Library entry not found")
    return serialize_doc(doc)


@api_router.post("/admin/library", response_model=LibraryEntry)
async def create_library_entry(payload: LibraryEntryIn, admin: dict = Depends(require_admin)):
    await _ensure_unique_slug("library", payload.slug)
    entry = LibraryEntry(**payload.model_dump())
    await db.library.insert_one(entry.model_dump())
    return entry


@api_router.put("/admin/library/{entry_id}", response_model=LibraryEntry)
async def update_library_entry(entry_id: str, payload: LibraryEntryIn, admin: dict = Depends(require_admin)):
    existing = await db.library.find_one({"id": entry_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Library entry not found")
    if payload.slug != existing.get("slug"):
        await _ensure_unique_slug("library", payload.slug, exclude_id=entry_id)
    merged = {**existing, **payload.model_dump(), "id": entry_id, "updated_at": now_iso()}
    await db.library.replace_one({"id": entry_id}, merged)
    return LibraryEntry(**merged)


@api_router.delete("/admin/library/{entry_id}")
async def delete_library_entry(entry_id: str, admin: dict = Depends(require_admin)):
    res = await db.library.delete_one({"id": entry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Library entry not found")
    return {"deleted": True}


# ----- Symbols -----
@api_router.get("/symbols")
async def list_symbols(status_param: Optional[str] = Query(default=None, alias="status")):
    q = _build_filter(status_param)
    docs = await db.symbols.find(q, {"_id": 0}).sort([("sort_order", 1), ("name", 1)]).to_list(1000)
    return serialize_docs(docs)


@api_router.get("/symbols/{slug}")
async def get_symbol(slug: str):
    doc = await db.symbols.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Symbol not found")
    return serialize_doc(doc)


@api_router.post("/admin/symbols", response_model=Symbol)
async def create_symbol(payload: SymbolIn, admin: dict = Depends(require_admin)):
    await _ensure_unique_slug("symbols", payload.slug)
    sym = Symbol(**payload.model_dump())
    await db.symbols.insert_one(sym.model_dump())
    return sym


@api_router.put("/admin/symbols/{symbol_id}", response_model=Symbol)
async def update_symbol(symbol_id: str, payload: SymbolIn, admin: dict = Depends(require_admin)):
    existing = await db.symbols.find_one({"id": symbol_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Symbol not found")
    if payload.slug != existing.get("slug"):
        await _ensure_unique_slug("symbols", payload.slug, exclude_id=symbol_id)
    merged = {**existing, **payload.model_dump(), "id": symbol_id, "updated_at": now_iso()}
    await db.symbols.replace_one({"id": symbol_id}, merged)
    return Symbol(**merged)


@api_router.delete("/admin/symbols/{symbol_id}")
async def delete_symbol(symbol_id: str, admin: dict = Depends(require_admin)):
    res = await db.symbols.delete_one({"id": symbol_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Symbol not found")
    return {"deleted": True}


# ----- Roadhouse posts -----
@api_router.get("/roadhouse")
async def list_roadhouse(
    status_param: Optional[str] = Query(default=None, alias="status"),
    type_filter: Optional[str] = Query(default=None, alias="type"),
):
    q = _build_filter(status_param)
    if type_filter:
        q["type"] = type_filter
    docs = await db.roadhouse.find(q, {"_id": 0}).sort([("event_date", -1), ("created_at", -1)]).to_list(1000)
    return serialize_docs(docs)


@api_router.get("/roadhouse/{slug}")
async def get_roadhouse_post(slug: str):
    doc = await db.roadhouse.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Roadhouse post not found")
    return serialize_doc(doc)


@api_router.post("/admin/roadhouse", response_model=RoadhousePost)
async def create_roadhouse_post(payload: RoadhousePostIn, admin: dict = Depends(require_admin)):
    await _ensure_unique_slug("roadhouse", payload.slug)
    post = RoadhousePost(**payload.model_dump())
    await db.roadhouse.insert_one(post.model_dump())
    return post


@api_router.put("/admin/roadhouse/{post_id}", response_model=RoadhousePost)
async def update_roadhouse_post(post_id: str, payload: RoadhousePostIn, admin: dict = Depends(require_admin)):
    existing = await db.roadhouse.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Roadhouse post not found")
    if payload.slug != existing.get("slug"):
        await _ensure_unique_slug("roadhouse", payload.slug, exclude_id=post_id)
    merged = {**existing, **payload.model_dump(), "id": post_id, "updated_at": now_iso()}
    await db.roadhouse.replace_one({"id": post_id}, merged)
    return RoadhousePost(**merged)


@api_router.delete("/admin/roadhouse/{post_id}")
async def delete_roadhouse_post(post_id: str, admin: dict = Depends(require_admin)):
    res = await db.roadhouse.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Roadhouse post not found")
    return {"deleted": True}


# ----- Visual art (Observatory) -----
@api_router.get("/observatory")
async def list_visual_art(status_param: Optional[str] = Query(default=None, alias="status")):
    q = _build_filter(status_param)
    docs = await db.observatory.find(q, {"_id": 0}).sort([("sort_order", 1), ("created_at", -1)]).to_list(1000)
    return serialize_docs(docs)


@api_router.get("/observatory/{slug}")
async def get_visual_art(slug: str):
    doc = await db.observatory.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return serialize_doc(doc)


@api_router.post("/admin/observatory", response_model=VisualArt)
async def create_visual_art(payload: VisualArtIn, admin: dict = Depends(require_admin)):
    await _ensure_unique_slug("observatory", payload.slug)
    art = VisualArt(**payload.model_dump())
    await db.observatory.insert_one(art.model_dump())
    return art


@api_router.put("/admin/observatory/{art_id}", response_model=VisualArt)
async def update_visual_art(art_id: str, payload: VisualArtIn, admin: dict = Depends(require_admin)):
    existing = await db.observatory.find_one({"id": art_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Artwork not found")
    if payload.slug != existing.get("slug"):
        await _ensure_unique_slug("observatory", payload.slug, exclude_id=art_id)
    merged = {**existing, **payload.model_dump(), "id": art_id, "updated_at": now_iso()}
    await db.observatory.replace_one({"id": art_id}, merged)
    return VisualArt(**merged)


@api_router.delete("/admin/observatory/{art_id}")
async def delete_visual_art(art_id: str, admin: dict = Depends(require_admin)):
    res = await db.observatory.delete_one({"id": art_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return {"deleted": True}


# ============================================================
# Invocation (email signup)
# ============================================================
class InvocationResponse(BaseModel):
    ok: bool
    message: str
    already_subscribed: bool = False


@api_router.post("/invocation", response_model=InvocationResponse)
async def create_invocation(body: InvocationCreate):
    email_norm = body.email.strip().lower()
    existing = await db.subscribers.find_one({"email": email_norm}, {"_id": 0})
    if existing:
        return InvocationResponse(
            ok=True,
            already_subscribed=True,
            message="A light is already on for you in the archive.",
        )

    provider = get_provider()
    success, provider_status = await provider.subscribe(email_norm, body.first_name)

    sub = Subscriber(
        email=email_norm,
        first_name=(body.first_name or None),
        source=body.source,
        provider=provider.name,
        provider_status=provider_status,
    )
    await db.subscribers.insert_one(sub.model_dump())

    return InvocationResponse(
        ok=True,
        already_subscribed=False,
        message="A signal received. The archive keeps watch.",
    )


@api_router.get("/admin/subscribers")
async def list_subscribers(admin: dict = Depends(require_admin)):
    docs = await db.subscribers.find({}, {"_id": 0}).sort([("created_at", -1)]).to_list(5000)
    return serialize_docs(docs)


# ============================================================
# Page-level editable copy
# ============================================================
ALLOWED_PAGE_SLUGS = {
    "home", "archive", "library", "symbols", "roadhouse",
    "observatory", "invocation",
}


@api_router.get("/pages/{slug}")
async def get_page_content(slug: str):
    """Public endpoint. Returns `{slug, fields}` or `{slug, fields: {}}` when
    the page hasn't been customized yet — the frontend falls back to its
    hardcoded copy in that case."""
    if slug not in ALLOWED_PAGE_SLUGS:
        raise HTTPException(status_code=404, detail="Unknown page")
    doc = await db.page_content.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        return {"slug": slug, "fields": {}}
    return serialize_doc(doc)


@api_router.put("/admin/pages/{slug}", response_model=PageContent)
async def put_page_content(
    slug: str,
    payload: PageContentIn,
    admin: dict = Depends(require_admin),
):
    if slug not in ALLOWED_PAGE_SLUGS:
        raise HTTPException(status_code=404, detail="Unknown page")
    existing = await db.page_content.find_one({"slug": slug}, {"_id": 0})
    if existing:
        merged = {
            **existing,
            "fields": payload.fields or {},
            "updated_at": now_iso(),
        }
        await db.page_content.replace_one({"slug": slug}, merged)
        return PageContent(**merged)
    new_doc = PageContent(slug=slug, fields=payload.fields or {})
    await db.page_content.insert_one(new_doc.model_dump())
    return new_doc


# ============================================================
# Wire up
# ============================================================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        await db.subscribers.create_index("email", unique=True)
        await db.albums.create_index("slug", unique=True)
        await db.library.create_index("slug", unique=True)
        await db.symbols.create_index("slug", unique=True)
        await db.roadhouse.create_index("slug", unique=True)
        await db.observatory.create_index("slug", unique=True)
        await db.page_content.create_index("slug", unique=True)
        logger.info("Neoverse indexes ensured.")
    except Exception as exc:  # pragma: no cover
        logger.warning("Could not ensure indexes: %s", exc)


@app.on_event("shutdown")
async def shutdown():
    client.close()
