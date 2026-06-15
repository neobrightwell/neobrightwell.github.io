import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { ADMIN } from "@/constants/testIds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrescentGlyph } from "@/components/neoverse/Glyphs";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(password);
      navigate("/admin");
    } catch (err) {
      setError("That key did not fit the lock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        data-testid={ADMIN.login_form}
        className="w-full max-w-md rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-8 space-y-5"
      >
        <div className="flex items-center gap-3 text-[rgba(199,168,106,0.92)]">
          <CrescentGlyph size={26} />
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">
            archive keeper
          </p>
        </div>
        <div>
          <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">Step inside.</h1>
          <p className="mt-1 text-[rgba(231,224,214,0.7)]">
            Enter the keeper’s passphrase to tend the archive.
          </p>
        </div>
        <Input
          type="password"
          data-testid={ADMIN.login_password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="passphrase"
          className="bg-[rgba(20,22,27,0.55)] border-[rgba(199,194,184,0.18)]"
          autoFocus
          required
        />
        {error && (
          <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">{error}</p>
        )}
        <Button
          type="submit"
          data-testid={ADMIN.login_submit}
          disabled={loading}
          className="w-full bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] hover:bg-[rgba(127,166,199,1)] font-mono tracking-archival text-[11px]"
        >
          {loading ? "Opening…" : "Open the door"}
        </Button>
        <p className="text-center text-[10.5px] font-mono tracking-archival text-[rgba(199,194,184,0.45)]">
          Single-keeper archive — no public registration.
        </p>
      </form>
    </div>
  );
}
