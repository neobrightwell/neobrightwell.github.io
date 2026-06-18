/* InvocationForm — literary email signup, decomposed into:
 *   InvocationSuccess  — in-world confirmation state
 *   InvocationIntro    — title + tagline (only in expanded variant)
 *   InvocationFields   — name + email inputs
 *   useInvocation      — submission hook (validation, request, status)
 */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INVOCATION } from "@/constants/testIds";
import { submitInvocation } from "@/api/client";
import { CrescentGlyph } from "./Glyphs";

const EMAIL_RX = /^\S+@\S+\.\S+$/;

function useInvocation(source) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const submit = async ({ email, firstName }) => {
    setError(null);
    if (!EMAIL_RX.test(email.trim())) {
      setError("That doesn’t look like an email address.");
      return false;
    }
    setLoading(true);
    try {
      const res = await submitInvocation({
        email: email.trim(),
        first_name: firstName.trim() || null,
        source,
      });
      setStatus({ ok: true, message: res.message, already: !!res.already_subscribed });
      return true;
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "The transmission did not reach the archive. Try again in a moment.";
      setError(typeof detail === "string" ? detail : "Something interrupted the signal.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, status, error, submit };
}

function InvocationSuccess({ already }) {
  return (
    <div
      data-testid={INVOCATION.success}
      className="relative overflow-hidden rounded-xl border border-[rgba(199,168,106,0.35)] bg-[rgba(20,22,27,0.6)] p-6"
    >
      <div className="flex items-center gap-3 mb-3 text-[rgba(199,168,106,0.95)]">
        <CrescentGlyph size={26} />
        <p className="font-mono tracking-archival text-[10.5px]">A signal received</p>
      </div>
      <p className="font-serif text-2xl text-[rgba(231,224,214,0.95)] leading-tight mb-2">
        {already
          ? "A light is already on for you in the archive."
          : "The archive keeps watch."}
      </p>
      <p className="text-[rgba(231,224,214,0.7)] leading-relaxed">
        {already
          ? "You are already among the witnesses. Transmissions will continue."
          : "Look for the next transmission when the road is ready to speak again."}
      </p>
    </div>
  );
}

function InvocationIntro() {
  return (
    <div>
      <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-1">
        The Invocation
      </p>
      <h3 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">
        Leave a light on in the archive.
      </h3>
      <p className="text-[rgba(231,224,214,0.7)] mt-2 leading-relaxed">
        Receive transmissions from the road — new music, poems, artwork, and dispatches
        from the Neoverse.
      </p>
    </div>
  );
}

function InvocationFields({ email, setEmail, firstName, setFirstName, compact }) {
  const inputClass =
    "bg-[rgba(20,22,27,0.55)] border-[rgba(199,194,184,0.18)] placeholder:text-[rgba(199,194,184,0.4)]";
  return (
    <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-3"}>
      <Input
        data-testid={INVOCATION.first_name}
        type="text"
        placeholder="first name (optional)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={inputClass}
        autoComplete="given-name"
      />
      <Input
        data-testid={INVOCATION.email}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
        autoComplete="email"
      />
    </div>
  );
}

export const InvocationForm = ({ source = "footer", compact = false }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const { loading, status, error, submit } = useInvocation(source);

  if (status?.ok) return <InvocationSuccess already={status.already} />;

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit({ email, firstName });
    if (ok) {
      setEmail("");
      setFirstName("");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      data-testid={INVOCATION.form}
      className={
        compact
          ? "space-y-3"
          : "relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] p-6 space-y-4"
      }
      noValidate
    >
      {!compact && <InvocationIntro />}
      <InvocationFields
        email={email}
        setEmail={setEmail}
        firstName={firstName}
        setFirstName={setFirstName}
        compact={compact}
      />
      {error && (
        <p
          data-testid={INVOCATION.error}
          className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]"
        >
          {error}
        </p>
      )}
      <Button
        type="submit"
        data-testid={INVOCATION.submit}
        disabled={loading}
        className="w-full sm:w-auto bg-[rgba(199,168,106,0.95)] text-[#0B0C0F] hover:bg-[rgba(199,168,106,1)] font-mono tracking-archival text-[11px] px-5"
      >
        {loading ? "Sending…" : "Leave a light on"}
      </Button>
      <p className="font-mono text-[10px] text-[rgba(199,194,184,0.42)] leading-relaxed">
        Your address is kept in the archive only. No selling, no noise — only transmissions.
      </p>
    </form>
  );
};

export default InvocationForm;
