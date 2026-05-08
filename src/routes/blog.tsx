import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Breathe" },
      { name: "description", content: "Gentle reads on mental wellbeing." },
    ],
  }),
  component: Blog,
});

const posts = [
  { t: "A small guide to slowing down", e: "5 min read", bg: "var(--note-3)" },
  { t: "When anxiety knocks softly", e: "7 min read", bg: "var(--note-2)" },
  { t: "The art of choosing rest", e: "4 min read", bg: "var(--note-4)" },
  { t: "Sleep, breath and morning light", e: "6 min read", bg: "var(--note-1)" },
];

function Blog() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Quiet <span className="italic text-primary">reads.</span>
        </h1>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <article key={p.t} className="rounded-3xl p-10" style={{ backgroundColor: p.bg }}>
              <span className="text-xs uppercase tracking-wider text-foreground/60">{p.e}</span>
              <h3 className="mt-3 font-display text-3xl text-foreground">{p.t}</h3>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
