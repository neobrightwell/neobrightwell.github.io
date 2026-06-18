"""Mongo serialization helpers — strip _id, ensure JSON-safe values."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Iterable, List


def _scrub(value: Any) -> Any:
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _scrub(v) for k, v in value.items() if k != "_id"}
    if isinstance(value, list):
        return [_scrub(v) for v in value]
    return value


def serialize_doc(doc: Dict[str, Any] | None) -> Dict[str, Any] | None:
    # PEP 8: comparisons to singletons (None) MUST use `is` / `is not`, not `==`.
    if doc is None:
        return None
    return _scrub(doc)


def serialize_docs(docs: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # `is not None` is intentional here (PEP 8 §Programming Recommendations).
    return [serialize_doc(d) for d in docs if d is not None]
