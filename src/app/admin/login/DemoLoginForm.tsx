"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("shivanshsuryavanshi@gmail.com");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/admin/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, next }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(data.redirect || next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          Admin email
        </label>
        <input
          id="email"
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="mt-2 text-xs text-ink-soft">
          Demo mode (Supabase not configured). Bootstrap emails only.
        </p>
      </div>
      {error && <p className="text-sm text-[var(--warn)]">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
