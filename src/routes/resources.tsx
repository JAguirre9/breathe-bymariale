import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Breathe" },
      { name: "description", content: "Gentle reads on mental wellbeing." },
    ],
  }),
  component: Resources,
});

function Resources() {
  const { t } = useT();
  const posts = [
    { k: "res.post1", e: 5, bg: "var(--note-3)" },
    { k: "res.post2", e: 7, bg: "var(--note-2)" },
    { k: "res.post3", e: 4, bg: "var(--note-4)" },
    { k: "res.post4", e: 6, bg: "var(--note-1)" },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("res.title1")} <span className="italic text-primary">{t("res.title2")}</span>
        </h1>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <article key={p.k} className="rounded-3xl p-10" style={{ backgroundColor: p.bg }}>
              <span className="text-xs uppercase tracking-wider text-foreground/60">
                {p.e} {t("res.read")}
              </span>
              <h3 className="mt-3 font-display text-3xl text-foreground">{t(p.k)}</h3>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
