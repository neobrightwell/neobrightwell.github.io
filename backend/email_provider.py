"""Email provider adapter interface.

The Invocation always persists subscribers to the local DB. An optional
external provider (Resend, ConvertKit, Mailchimp, etc.) can be wired in
later by implementing the `subscribe` method and registering the adapter
in `get_provider()` based on env vars.
"""
from __future__ import annotations

import os
from typing import Optional, Tuple


class EmailProvider:
    name: str = "database"

    async def subscribe(self, email: str, first_name: Optional[str]) -> Tuple[bool, Optional[str]]:
        """Return (success, provider_status). Default is no-op."""
        return True, "stored_locally"


class DatabaseOnlyProvider(EmailProvider):
    name = "database"


# Future providers (stubs)
class ResendProvider(EmailProvider):
    name = "resend"

    def __init__(self, api_key: str, audience_id: Optional[str] = None) -> None:
        self.api_key = api_key
        self.audience_id = audience_id

    async def subscribe(self, email: str, first_name: Optional[str]) -> Tuple[bool, Optional[str]]:
        # Implementation deferred until credentials are provided. For now, log-only.
        return True, "queued_for_resend"


def get_provider() -> EmailProvider:
    name = (os.environ.get("EMAIL_PROVIDER") or "database").lower()
    if name == "resend" and os.environ.get("RESEND_API_KEY"):
        return ResendProvider(
            api_key=os.environ["RESEND_API_KEY"],
            audience_id=os.environ.get("RESEND_AUDIENCE_ID"),
        )
    return DatabaseOnlyProvider()
