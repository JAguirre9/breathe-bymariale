import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Breathe" },
      { name: "description", content: "Therapy services tailored to your pace and needs." },
    ],
  }),
  component: Services,
});

const services = [
  { title: "Individual therapy", copy: "One-on-one sessions in a confidential space.", bg: "var(--note-4)" },
  { title: "Couples therapy", copy: "Reconnect, communicate, and grow together.", bg: "var(--note-2)" },
  { title: "Group sessions", copy: "Heal in community with curated small groups.", bg: "var(--note-3)" },
  { title: "Mindfulness coaching", copy: "Breathwork and mindfulness for daily calm.", bg: "var(--note-1)" },
];

function Services() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Care, <span className="italic text-primary">your way.</span>
        </h1>
        <p className="mt-4 max-w-xl text-foreground/70">
          Choose a path that meets you where you are.
        </p>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="rounded-3xl p-10" style={{ backgroundColor: s.bg }}>
              <h3 className="font-display text-3xl text-foreground">{s.title}</h3>
              <p className="mt-3 text-foreground/70">{s.copy}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
