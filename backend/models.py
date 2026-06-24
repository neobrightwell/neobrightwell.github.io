"""Pydantic models for The Neoverse — content types backed by MongoDB.

All documents use UUID strings (not ObjectId) so they are JSON-serializable
and portable across environments. Datetimes are stored as ISO strings.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- shared helpers ----------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class NeoverseBase(BaseModel):
    model_config = ConfigDict(extra="ignore")


class StreamingLink(NeoverseBase):
    platform: str  # e.g. "spotify", "apple_music", "bandcamp", "youtube", "tidal"
    label: Optional[str] = None  # display label override
    url: str


class Song(NeoverseBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    order: int = 0
    duration: Optional[str] = None  # "3:42"
    lyrics: Optional[str] = None
    audio_url: Optional[str] = None  # direct MP3 / preview URL
    embed_html: Optional[str] = None  # optional embed snippet (e.g. Spotify iframe)
    notes: Optional[str] = None


class RecoveredFragment(NeoverseBase):
    label: str  # "frequency" / "coordinates" / "accession"
    value: str  # "98.3 FM" / "34.0522° N, 118.2437° W" / "NB-04-1971"


# ---------- Album ----------
ALBUM_ATMOSPHERES = (
    "neon-rodeo",
    "an-american-reckoning",
    "we-didnt-survive-to-be-quiet",
    "burn-bright-stay-free",
    "default",
)


class AlbumIn(NeoverseBase):
    slug: str
    title: str
    year: Optional[str] = None
    atmosphere: str = "default"  # one of ALBUM_ATMOSPHERES
    epigraph: Optional[str] = None
    subtitle: Optional[str] = None
    lore: Optional[str] = None  # long-form markdown notes
    themes: List[str] = []
    visual_symbolism: Optional[str] = None
    cover_image_url: Optional[str] = None  # external URL or data URI
    hero_image_url: Optional[str] = None
    streaming_links: List[StreamingLink] = []
    songs: List[Song] = []
    recovered_fragments: List[RecoveredFragment] = []
    embed_html: Optional[str] = None  # album-level embed (Spotify/Bandcamp player)
    status: Literal["draft", "published"] = "published"
    sort_order: int = 0


class Album(AlbumIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


# ---------- Library entries (poem / essay / publication) ----------
class LibraryEntryIn(NeoverseBase):
    slug: str
    title: str
    subtitle: Optional[str] = None
    type: Literal["poem", "essay", "manuscript", "publication"] = "poem"
    body: str = ""  # markdown
    epigraph: Optional[str] = None
    publication_credit: Optional[str] = None  # "First published in The Sun, 2023"
    date_written: Optional[str] = None
    tags: List[str] = []
    marginal_notes: List[str] = []
    status: Literal["draft", "published"] = "published"
    sort_order: int = 0


class LibraryEntry(LibraryEntryIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


# ---------- Symbol / mythology ----------
class SymbolIn(NeoverseBase):
    slug: str
    name: str
    short_definition: Optional[str] = None
    full_description: Optional[str] = None  # markdown
    glyph_svg: Optional[str] = None  # inline SVG markup
    image_url: Optional[str] = None  # bitmap glyph URL or data URI (alternative to glyph_svg)
    image_filter: Optional[str] = None  # optional CSS filter, e.g. "invert(1)" for dark-on-light glyphs
    themes: List[str] = []
    related_works: List[str] = []  # album/library slugs
    status: Literal["draft", "published"] = "published"
    sort_order: int = 0


class Symbol(SymbolIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


# ---------- Roadhouse post (news / event / release / press) ----------
class RoadhousePostIn(NeoverseBase):
    slug: str
    title: str
    type: Literal["news", "event", "release", "press", "field_note"] = "news"
    body: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    event_date: Optional[str] = None  # ISO date string
    location: Optional[str] = None
    link: Optional[str] = None  # external link (ticketing / press article)
    link_label: Optional[str] = None
    status: Literal["draft", "published"] = "published"
    sort_order: int = 0


class RoadhousePost(RoadhousePostIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


# ---------- Visual art (Observatory) ----------
class VisualArtIn(NeoverseBase):
    slug: str
    title: str
    image_url: str = ""  # URL or data URI
    medium: Optional[str] = None
    year: Optional[str] = None       # surfaced in UI as "Chronology"
    origin: Optional[str] = None     # provenance / place / publication
    description: Optional[str] = None
    symbolism: Optional[str] = None
    status: Literal["draft", "published"] = "published"
    sort_order: int = 0


class VisualArt(VisualArtIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


# ---------- Invocation / subscribers ----------
class InvocationCreate(NeoverseBase):
    email: EmailStr
    first_name: Optional[str] = None
    source: Optional[str] = None  # e.g. "footer" / "homepage" / "album-page"


class Subscriber(NeoverseBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    first_name: Optional[str] = None
    source: Optional[str] = None
    confirmed: bool = False
    provider: str = "database"  # adapter name; future: "resend" / "mailchimp" / "convertkit"
    provider_status: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


# ---------- Auth ----------
class AdminLoginRequest(NeoverseBase):
    password: str


class AdminLoginResponse(NeoverseBase):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
