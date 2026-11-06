import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";
import { servicePrices } from "@/data/servicePrices";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - Breathe" },
      { name: "description", content: "Therapy services tailored to your pace and needs." },
    ],
  }),
  component: Services,
});

function Services() {
  const { t, lang } = useT();

  const [overrides, setOverrides] = useState<
      Record<string, { price: number | null; duration: string | null }>
    >({});

    useEffect(() => {
      apiFetch("/content/services")
        .then((data) => {
          const map: Record<string, { price: number | null; duration: string | null }> = {};
          for (const s of data.services || []) map[s.slug] = s;
          setOverrides(map);
        })
        .catch(console.error); // si falla, se muestran los precios por defecto
    }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("svc.title1")} <span className="italic text-primary">{t("svc.title2")}</span>
        </h1>
        <p className="mt-4 max-w-xl text-foreground/70">{t("svc.subtitle")}</p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {servicePrices.map((s) => {
            const price = overrides[s.id]?.price ?? s.price;
            const duration = overrides[s.id]?.duration ?? s.duration;
            return (
              <div key={s.id} className="rounded-3xl p-10" style={{ backgroundColor: s.bg }}>
                <h3 className="font-display text-3xl text-foreground">{t(s.titleKey)}</h3>
                <p className="mt-3 text-foreground/70">{t(s.copyKey)}</p>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{formatPrice(price)}</p>
                    {duration && (
                      <p className="mt-1 text-sm text-foreground/60">{duration}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}