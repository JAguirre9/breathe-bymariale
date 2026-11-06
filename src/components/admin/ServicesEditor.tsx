import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { servicePrices } from "@/data/servicePrices";

type Row = { price: string; duration: string };

export function ServicesEditor() {
  const { t, lang } = useT();
  const es = lang === "es";
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(
      servicePrices.map((s) => [
        s.id,
        { price: String(s.price), duration: s.duration ?? "" },
      ])
    )
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const errorText = es
    ? "No se pudo guardar. Inténtalo de nuevo."
    : "Could not save. Please try again.";

  useEffect(() => {
    apiFetch("/content/services")
      .then((data) => {
        setRows((prev) => {
          const next = { ...prev };
          for (const s of data.services || []) {
            if (!next[s.slug]) continue;
            next[s.slug] = {
              price: s.price != null ? String(s.price) : next[s.slug].price,
              duration: s.duration ?? next[s.slug].duration,
            };
          }
          return next;
        });
      })
      .catch((err) => {
        console.error(err);
        setError(errorText);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (id: string, key: keyof Row, value: string) => {
    setSavedId(null);
    setRows((r) => ({ ...r, [id]: { ...r[id], [key]: value } }));
  };

  const save = async (id: string) => {
    const row = rows[id];
    setSavingId(id);
    setSavedId(null);
    setError("");
    try {
      await apiFetch(`/content/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          price: row.price.trim() === "" ? null : Number(row.price),
          duration: row.duration.trim() || null,
        }),
      });
      setSavedId(id);
    } catch (err) {
      console.error(err);
      setError(errorText);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="mb-6 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-xl font-semibold">
        {es ? "Precios de servicios" : "Service prices"}
      </h2>

      {error && (
        <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {servicePrices.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
          >
            <p className="min-w-40 flex-1 text-sm font-medium text-foreground">
              {t(s.titleKey)}
            </p>
            <label className="flex items-center gap-2 text-sm">
              {es ? "Precio (COP)" : "Price (COP)"}
              <Input
                type="number"
                min={0}
                step={1000}
                value={rows[s.id].price}
                onChange={(e) => setField(s.id, "price", e.target.value)}
                className="w-32 rounded-xl"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              {es ? "Duración" : "Duration"}
              <Input
                value={rows[s.id].duration}
                onChange={(e) => setField(s.id, "duration", e.target.value)}
                placeholder="60 min"
                className="w-28 rounded-xl"
              />
            </label>
            <Button
              size="sm"
              onClick={() => save(s.id)}
              disabled={savingId === s.id}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {savedId === s.id
                ? es ? "Guardado" : "Saved"
                : es ? "Guardar" : "Save"}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}