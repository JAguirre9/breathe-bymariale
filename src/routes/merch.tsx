import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
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

const items = [
  { k: "merch.item1", bg: "var(--note-4)" },
  { k: "merch.item2", bg: "var(--note-2)" },
  { k: "merch.item3", bg: "var(--note-3)" },
  { k: "merch.item4", bg: "var(--note-1)" },
] as const;

function Merch() {
  const { t } = useT();
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("merch.title1")}{" "}
          <span className="italic text-primary">{t("merch.title2")}</span>
        </h1>
        <p className="mt-4 max-w-xl text-foreground/70">{t("merch.subtitle")}</p>

        <div className="relative mt-14">
          {/* Backdrop when something is focused */}
          {focused && (
            <button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setFocused(null)}
            />
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {items.map((i) => {
              const isFocused = focused === i.k;

              return (
                <button
                  key={i.k}
                  type="button"
                  onClick={() => setFocused(isFocused ? null : i.k)}
                  className={`
                    relative rounded-3xl p-8 text-left transition-all duration-500 ease-out
                    ${isFocused
                      ? "z-50 scale-110 shadow-2xl md:scale-125"
                      : focused
                        ? "scale-95 opacity-40 blur-[1px]"
                        : "hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                    }
                  `}
                  style={{ backgroundColor: i.bg }}
                >
                  <div className="aspect-square rounded-2xl bg-card/60" />
                  <h3 className="mt-5 font-display text-xl text-foreground">
                    {t(i.k)}
                  </h3>
                  <span className="mt-2 inline-block text-xs uppercase tracking-wider text-foreground/60">
                    {t("merch.soon")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
