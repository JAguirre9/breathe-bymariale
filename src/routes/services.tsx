import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";

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
  const { t } = useT();
  const services = [
    { titleKey: "svc.individual", copyKey: "svc.individual.copy", bg: "var(--note-4)" },
    { titleKey: "svc.couples", copyKey: "svc.couples.copy", bg: "var(--note-2)" },
    { titleKey: "svc.group", copyKey: "svc.group.copy", bg: "var(--note-3)" },
    { titleKey: "svc.mindful", copyKey: "svc.mindful.copy", bg: "var(--note-1)" },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("svc.title1")} <span className="italic text-primary">{t("svc.title2")}</span>
        </h1>
        <p className="mt-4 max-w-xl text-foreground/70">{t("svc.subtitle")}</p>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.titleKey} className="rounded-3xl p-10" style={{ backgroundColor: s.bg }}>
              <h3 className="font-display text-3xl text-foreground">{t(s.titleKey)}</h3>
              <p className="mt-3 text-foreground/70">{t(s.copyKey)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
