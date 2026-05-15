import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start your therapy — Breathe" },
      { name: "description", content: "Begin your therapy journey in two minutes." },
    ],
  }),
  component: Start,
});

function Start() {
  const { t } = useT();
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
          {t("start.title1")} <span className="italic text-primary">{t("start.title2")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/70">{t("start.subtitle")}</p>
        <Button asChild size="lg" className="mt-10 rounded-full bg-primary px-10 py-7 text-base text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90">
          <Link to="/signup">{t("start.cta")}</Link>
        </Button>
      </main>
    </div>
  );
}
