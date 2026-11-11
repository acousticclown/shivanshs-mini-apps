"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Application, Category } from "@/types/registry";

export function AppForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Application;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    short_description: initial?.short_description ?? "",
    category_id: initial?.category_id ?? "",
    tags: (initial?.tags ?? []).join(", "),
    live_url: initial?.live_url ?? "",
    github_url: initial?.github_url ?? "",
    docs_url: initial?.docs_url ?? "",
    hosting_provider: initial?.hosting_provider ?? "vercel",
    featured: initial?.featured ?? false,
    visibility: initial?.visibility ?? "public",
    publication_status: initial?.publication_status ?? "draft",
    sort_priority: initial?.sort_priority ?? 0,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const payload = {
      ...form,
      category_id: form.category_id || null,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      docs_url: form.docs_url || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sort_priority: Number(form.sort_priority) || 0,
    };
    const res = await fetch(
      initial ? `/api/admin/apps/${initial.id}` : "/api/admin/apps",
      {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    router.push(`/admin/apps/${data.id || initial?.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm("Remove this app from the portal registry? Infra is not deleted."))
      return;
    setPending(true);
    const res = await fetch(`/api/admin/apps/${initial.id}`, {
      method: "DELETE",
    });
    setPending(false);
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    router.push("/admin/apps");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="input"
            required
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!initial) {
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
                );
              }
            }}
          />
        </div>
        <div>
          <label className="label" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            className="input"
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="short_description">
          Short description
        </label>
        <input
          id="short_description"
          className="input"
          maxLength={240}
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="textarea"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category_id">
            Category
          </label>
          <select
            id="category_id"
            className="select"
            value={form.category_id}
            onChange={(e) => set("category_id", e.target.value)}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            className="input"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="live_url">
            Live URL
          </label>
          <input
            id="live_url"
            className="input"
            type="url"
            value={form.live_url}
            onChange={(e) => set("live_url", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="github_url">
            GitHub URL
          </label>
          <input
            id="github_url"
            className="input"
            type="url"
            value={form.github_url}
            onChange={(e) => set("github_url", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label" htmlFor="hosting_provider">
            Hosting
          </label>
          <select
            id="hosting_provider"
            className="select"
            value={form.hosting_provider}
            onChange={(e) =>
              set(
                "hosting_provider",
                e.target.value as typeof form.hosting_provider,
              )
            }
          >
            {["vercel", "railway", "render", "cloudflare", "cursor", "other"].map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="publication_status">
            Publication
          </label>
          <select
            id="publication_status"
            className="select"
            value={form.publication_status}
            onChange={(e) =>
              set(
                "publication_status",
                e.target.value as typeof form.publication_status,
              )
            }
          >
            {["draft", "published", "archived", "hidden"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="visibility">
            Visibility
          </label>
          <select
            id="visibility"
            className="select"
            value={form.visibility}
            onChange={(e) =>
              set("visibility", e.target.value as typeof form.visibility)
            }
          >
            {["public", "unlisted", "private"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sort_priority">
            Sort priority
          </label>
          <input
            id="sort_priority"
            className="input"
            type="number"
            value={form.sort_priority}
            onChange={(e) => set("sort_priority", Number(e.target.value))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        Featured on homepage
      </label>

      {error && <p className="text-sm text-[var(--warn)]">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save app"}
        </button>
        {initial && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onDelete}
            disabled={pending}
          >
            Delete registry record
          </button>
        )}
      </div>
    </form>
  );
}
