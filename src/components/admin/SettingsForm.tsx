"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/types/registry";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    brand_name: initial.brand_name,
    tagline: initial.tagline,
    intro: initial.intro,
    primary_cta_label: initial.primary_cta_label,
    primary_cta_href: initial.primary_cta_href,
    secondary_cta_label: initial.secondary_cta_label,
    secondary_cta_href: initial.secondary_cta_href,
    footer_text: initial.footer_text,
    accent: initial.theme?.accent ?? "#0F766E",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        theme: { accent: form.accent, ink: "#111827" },
      }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    setMessage("Saved — public site will reflect these values.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {(
        [
          ["brand_name", "Brand name"],
          ["tagline", "Tagline"],
          ["primary_cta_label", "Primary CTA label"],
          ["primary_cta_href", "Primary CTA href"],
          ["secondary_cta_label", "Secondary CTA label"],
          ["secondary_cta_href", "Secondary CTA href"],
          ["footer_text", "Footer text"],
          ["accent", "Accent color"],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label className="label" htmlFor={key}>
            {label}
          </label>
          <input
            id={key}
            className="input"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required={key === "brand_name"}
          />
        </div>
      ))}
      <div>
        <label className="label" htmlFor="intro">
          Intro
        </label>
        <textarea
          id="intro"
          className="textarea"
          value={form.intro}
          onChange={(e) => setForm({ ...form, intro: e.target.value })}
        />
      </div>
      {error && <p className="text-sm text-[var(--warn)]">{error}</p>}
      {message && <p className="text-sm text-accent-deep">{message}</p>}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
