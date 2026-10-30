import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_URL, apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

type MerchItem = {
  id: string;
  nameEn: string;
  nameEs: string;
  captionEn: string | null;
  captionEs: string | null;
  imageUrl: string | null;
  sortOrder: number;
  published: boolean;
};

type FormState = {
  nameEn: string;
  nameEs: string;
  captionEn: string;
  captionEs: string;
  imageUrl: string;
  sortOrder: string;
  published: boolean;
};

const emptyForm: FormState = {
  nameEn: "",
  nameEs: "",
  captionEn: "",
  captionEs: "",
  imageUrl: "",
  sortOrder: "0",
  published: true,
};

/** Turn /uploads/... into a full URL the browser can load */
function fullImageUrl(url: string | null | undefined) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function MerchEditor() {
  const { t, lang } = useT();
  const [items, setItems] = useState<MerchItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    apiFetch("/content/admin/merch")
      .then((data) => setItems(data.merch || []))
      .catch((err) => {
        console.error(err);
        setError(t("admin.merch.error"));
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (item: MerchItem) => {
    setEditingId(item.id);
    setForm({
      nameEn: item.nameEn,
      nameEs: item.nameEs,
      captionEn: item.captionEn || "",
      captionEs: item.captionEs || "",
      imageUrl: item.imageUrl || "",
      sortOrder: String(item.sortOrder),
      published: item.published,
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`${API_URL}/content/admin/merch/upload`, {
        method: "POST",
        credentials: "include",
        body, // do NOT set Content-Type; browser sets multipart boundary
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      set("imageUrl", data.imageUrl as string);
    } catch (err) {
      console.error(err);
      setError(t("admin.merch.error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !form.nameEn.trim() || !form.nameEs.trim()) return;
    setSaving(true);
    setError("");

    const payload = {
      nameEn: form.nameEn.trim(),
      nameEs: form.nameEs.trim(),
      captionEn: form.captionEn.trim() || null,
      captionEs: form.captionEs.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
      published: form.published,
    };

    try {
      if (editingId) {
        await apiFetch(`/content/admin/merch/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/content/admin/merch", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      reset();
      await load();
    } catch (err) {
      console.error(err);
      setError(t("admin.merch.error"));
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: MerchItem) => {
    setError("");
    try {
      await apiFetch(`/content/admin/merch/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !item.published }),
      });
      await load();
    } catch (err) {
      console.error(err);
      setError(t("admin.merch.error"));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(t("admin.merch.confirmDelete"))) return;
    setError("");
    try {
      await apiFetch(`/content/admin/merch/${id}`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (err) {
      console.error(err);
      setError(t("admin.merch.error"));
    }
  };

  const previewSrc = fullImageUrl(form.imageUrl);

  return (
    <section className="mb-6 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-xl font-semibold">{t("admin.merch.title")}</h2>

      {error && (
        <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={form.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            placeholder={t("admin.merch.nameEn")}
            className="rounded-xl"
          />
          <Input
            value={form.nameEs}
            onChange={(e) => set("nameEs", e.target.value)}
            placeholder={t("admin.merch.nameEs")}
            className="rounded-xl"
          />
          <Textarea
            value={form.captionEn}
            onChange={(e) => set("captionEn", e.target.value)}
            placeholder={t("admin.merch.captionEn")}
            className="rounded-xl"
          />
          <Textarea
            value={form.captionEs}
            onChange={(e) => set("captionEs", e.target.value)}
            placeholder={t("admin.merch.captionEs")}
            className="rounded-xl"
          />
        </div>

        {/* Photo from laptop */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {lang === "es" ? "Foto del producto" : "Product photo"}
          </label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            disabled={uploading}
            className="rounded-xl"
          />
          <p className="mt-1 text-xs text-foreground/50">
            {uploading
              ? lang === "es"
                ? "Subiendo…"
                : "Uploading…"
              : lang === "es"
                ? "JPEG, PNG, WebP o GIF · máximo 5 MB"
                : "JPEG, PNG, WebP or GIF · max 5 MB"}
          </p>
          {previewSrc && (
            <img
              src={previewSrc}
              alt=""
              className="mt-2 h-24 w-24 rounded-xl object-cover"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            {t("admin.merch.sortOrder")}
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              className="w-24 rounded-xl"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            {t("admin.merch.published")}
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={saving || uploading || !form.nameEn.trim() || !form.nameEs.trim()}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {editingId ? t("admin.merch.save") : t("admin.merch.add")}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={reset}>
              {t("admin.merch.cancel")}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-sm text-foreground/50">{t("admin.merch.empty")}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
              >
                {item.imageUrl ? (
                  <img
                    src={fullImageUrl(item.imageUrl)}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-card/60" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {lang === "es" ? item.nameEs : item.nameEn}
                  </p>
                  {!item.published && (
                    <p className="text-xs text-foreground/50">
                      {t("admin.merch.hidden")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => togglePublished(item)}>
                    {item.published ? t("admin.merch.hide") : t("admin.merch.show")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                    {t("admin.merch.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(item.id)}
                    className="text-foreground/50 hover:text-destructive"
                  >
                    {t("admin.merch.delete")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}