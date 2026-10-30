import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { API_URL, apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch - Breathe" },
      { name: "description", content: "Soft apparel and objects to carry the calm." },
    ],
  }),
  component: Merch,
});

type MerchItem = {
  id: string;
  nameEn: string;
  nameEs: string;
  captionEn: string | null;
  captionEs: string | null;
  imageUrl: string | null;
  bgColor: string | null;
};

// Used when an item has no colour of its own
const FALLBACK_COLORS = [
  "var(--note-4)",
  "var(--note-2)",
  "var(--note-3)",
  "var(--note-1)",
];

function fullImageUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function Merch() {
  const { t, lang } = useT();
  const [items, setItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/content/merch")
      .then((data) => setItems(data.merch || []))
      .catch((err) => {
        console.error(err);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Escape closes the enlarged card
  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("merch.title1")}{" "}
          <span className="italic text-primary">{t("merch.title2")}</span>
        </h1>
        <p className="mt-4 max-w-xl text-foreground/70">{t("merch.subtitle")}</p>

        {failed && <p className="mt-14 text-foreground/60">{t("merch.error")}</p>}
        {!loading && !failed && items.length === 0 && (
          <p className="mt-14 text-foreground/60">{t("merch.empty")}</p>
        )}

        <div className="relative mt-14">
          {/* Backdrop when something is focused */}
          {focused && (
            <button
              type="button"
              aria-label={t("merch.close")}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setFocused(null)}
            />
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {items.map((item, index) => {
              const isFocused = focused === item.id;
              const name = lang === "es" ? item.nameEs : item.nameEn;
              const caption = lang === "es" ? item.captionEs : item.captionEn;
              const bg = item.bgColor || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isFocused}
                  onClick={() => setFocused(isFocused ? null : item.id)}
                  className={`
                    relative rounded-3xl p-8 text-left transition-all duration-500 ease-out
                    ${
                      isFocused
                        ? "z-50 scale-110 shadow-2xl md:scale-125"
                        : focused
                          ? "scale-95 opacity-40 blur-[1px]"
                          : "hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                    }
                  `}
                  style={{ backgroundColor: bg }}
                >
                  {item.imageUrl ? (
                    <img
                      src={fullImageUrl(item.imageUrl)!}
                      alt={name}
                      loading="lazy"
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="aspect-square rounded-2xl bg-card/60" />
                  )}
                  <h3 className="mt-5 font-display text-xl text-foreground">{name}</h3>
                  {caption && (
                    <p
                      className={`mt-2 text-sm text-foreground/70 ${
                        isFocused ? "" : "line-clamp-2"
                      }`}
                    >
                      {caption}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}