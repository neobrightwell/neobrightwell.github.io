"""Seed initial Neoverse data.

RESPECTS USER'S DIRECTIVE: do not invent major lore, lyrics, biographies, or
mythology. Only generate structural/atmospheric scaffolding so the world
renders correctly. Every long-form field is left as an empty string or a
clearly marked '[ insert real content ]' placeholder for the admin to fill in.
"""
from __future__ import annotations

import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from models import (
    Album,
    LibraryEntry,
    RoadhousePost,
    Symbol,
    VisualArt,
)

INSERT = ""  # leave blank — admin can fill via CMS
NOTE = "[ insert real content via admin — lore, lyrics, and notes belong to Neo Brightwell ]"

ALBUMS = [
    Album(
        slug="neon-rodeo",
        title="Neon Rodeo",
        atmosphere="neon-rodeo",
        year=INSERT,
        epigraph=INSERT,
        subtitle="The desert highway.",
        lore=NOTE,
        themes=["the road", "remembrance", "survival"],
        visual_symbolism=INSERT,
        sort_order=10,
    ),
    Album(
        slug="an-american-reckoning",
        title="An American Reckoning",
        atmosphere="an-american-reckoning",
        year=INSERT,
        epigraph=INSERT,
        subtitle="The fire and the testimony.",
        lore=NOTE,
        themes=["fire", "witness", "truth"],
        visual_symbolism=INSERT,
        sort_order=20,
    ),
    Album(
        slug="we-didnt-survive-to-be-quiet",
        title="We Didn’t Survive to Be Quiet",
        atmosphere="we-didnt-survive-to-be-quiet",
        year=INSERT,
        epigraph=INSERT,
        subtitle="The archive of survivors.",
        lore=NOTE,
        themes=["survival", "remembrance", "the witness"],
        visual_symbolism=INSERT,
        sort_order=30,
    ),
    Album(
        slug="burn-bright-stay-free",
        title="Burn Bright, Stay Free",
        atmosphere="burn-bright-stay-free",
        year=INSERT,
        epigraph=INSERT,
        subtitle="Liberation. Endurance. Transformation.",
        lore=NOTE,
        themes=["liberation", "transformation", "radical hope"],
        visual_symbolism=INSERT,
        sort_order=40,
    ),
]

SYMBOLS = [
    Symbol(
        slug="selune",
        name="Sélune",
        short_definition="The crescent witness.",
        full_description=NOTE,
        themes=["remembrance", "the witness", "transformation"],
        sort_order=10,
    ),
    Symbol(
        slug="crescent-and-star",
        name="The Crescent and Star",
        short_definition="A pairing of light and longing.",
        full_description=NOTE,
        themes=["remembrance", "return"],
        sort_order=20,
    ),
    Symbol(
        slug="liminality-glyph",
        name="The Liminality Glyph",
        short_definition="Threshold and passage.",
        full_description=NOTE,
        themes=["transformation", "return"],
        sort_order=30,
    ),
    Symbol(
        slug="the-eye",
        name="The Eye",
        short_definition="The witness who refuses to look away.",
        full_description=NOTE,
        themes=["the witness", "truth"],
        sort_order=40,
    ),
    Symbol(
        slug="the-archive",
        name="The Archive",
        short_definition="The place where survivors keep what they refuse to forget.",
        full_description=NOTE,
        themes=["remembrance", "survival"],
        sort_order=50,
    ),
    Symbol(
        slug="the-road",
        name="The Road",
        short_definition="The motion that becomes meaning.",
        full_description=NOTE,
        themes=["the road", "return"],
        sort_order=60,
    ),
    Symbol(
        slug="fire",
        name="Fire",
        short_definition="What clears the ground for what comes next.",
        full_description=NOTE,
        themes=["fire", "transformation"],
        sort_order=70,
    ),
    Symbol(
        slug="the-witness",
        name="The Witness",
        short_definition="The one who testifies, the one who survives.",
        full_description=NOTE,
        themes=["the witness", "truth", "survival"],
        sort_order=80,
    ),
]

LIBRARY_PLACEHOLDERS = [
    LibraryEntry(
        slug="a-letter-never-sent",
        title="A Letter Never Sent",
        type="poem",
        subtitle="— recovered fragment, accession unknown",
        epigraph=INSERT,
        body=NOTE,
        tags=["recovered", "placeholder"],
        sort_order=10,
    ),
    LibraryEntry(
        slug="on-survival-as-a-discipline",
        title="On Survival as a Discipline",
        type="essay",
        epigraph=INSERT,
        body=NOTE,
        tags=["essay", "placeholder"],
        sort_order=20,
    ),
]

ROADHOUSE_PLACEHOLDERS = [
    RoadhousePost(
        slug="the-archive-is-open",
        title="The Archive is open",
        type="news",
        excerpt="The doors of the Neoverse are unlocked. Wander as you will.",
        body=NOTE,
        sort_order=10,
    ),
    RoadhousePost(
        slug="transmission-zero",
        title="Transmission Zero",
        type="release",
        excerpt="A first dispatch from the road — details forthcoming.",
        body=NOTE,
        sort_order=20,
    ),
]

OBSERVATORY_PLACEHOLDERS = [
    VisualArt(
        slug="plate-i",
        title="Plate I — Threshold",
        image_url="https://images.unsplash.com/photo-1605571925268-bd3129e7df97?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        medium="Photography",
        description=NOTE,
        sort_order=10,
    ),
    VisualArt(
        slug="plate-ii",
        title="Plate II — The Crescent",
        image_url="https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        medium="Photography",
        description=NOTE,
        sort_order=20,
    ),
    VisualArt(
        slug="plate-iii",
        title="Plate III — The Archive",
        image_url="https://images.unsplash.com/photo-1546199881-3454b82b832b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        medium="Photography",
        description=NOTE,
        sort_order=30,
    ),
]


async def main():
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    print(f"Seeding into {db_name} ...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    async def upsert(coll: str, doc):
        d = doc.model_dump()
        await db[coll].update_one({"slug": d["slug"]}, {"$setOnInsert": d}, upsert=True)

    for a in ALBUMS:
        await upsert("albums", a)
    for s in SYMBOLS:
        await upsert("symbols", s)
    for entry in LIBRARY_PLACEHOLDERS:
        await upsert("library", entry)
    for r in ROADHOUSE_PLACEHOLDERS:
        await upsert("roadhouse", r)
    for v in OBSERVATORY_PLACEHOLDERS:
        await upsert("observatory", v)

    print("Seed complete.")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
