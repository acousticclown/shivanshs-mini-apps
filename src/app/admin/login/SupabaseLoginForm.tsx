"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseLoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("magic");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createClient();
      if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (err) throw err;
        setMessage("Check your email for the magic link.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        window.location.href = next;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {mode === "password" && (
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      {error && <p className="text-sm text-[var(--warn)]">{error}</p>}
      {message && <p className="text-sm text-accent-deep">{message}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending
          ? "Working…"
          : mode === "magic"
            ? "Send magic link"
            : "Sign in"}
      </button>
      <button
        type="button"
        className="w-full text-center text-sm font-semibold text-ink-soft hover:text-ink"
        onClick={() => setMode(mode === "magic" ? "password" : "magic")}
      >
        Use {mode === "magic" ? "password" : "magic link"} instead
      </button>
    </form>
  );
}
