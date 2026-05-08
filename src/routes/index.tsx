import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-breathe.jpg";
import logo from "@/assets/breathe-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Breathe — Online therapy to slow down and heal" },
      {
        name: "description",
        content:
          "Breathe is a soft space for online therapy. Connect with caring specialists, at your rhythm, from anywhere.",
      },
      { property: "og:title", content: "Breathe — Online therapy" },
      {
        property: "og:description",
        content: "A soft space for online therapy. Start your journey today.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />

      {/* Floating clouds */}
      <img
        src={logo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-[22%] h-20 w-20 opacity-60 animate-float-slow"
      />
      <img
        src={logo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[60%] h-28 w-28 opacity-40 animate-float-slower"
      />
      <img
        src={logo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[40%] top-[8%] h-12 w-12 opacity-50 animate-float-slow"
      />

      <main className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-36 pb-24 md:grid-cols-2 md:pt-44">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--note-2)] px-4 py-1.5 text-xs font-medium text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Soft. Safe. Yours.
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Breathe in,<br />
            <span className="italic text-primary">heal forward.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70">
            Online therapy designed to feel like a quiet morning. Connect with caring
            specialists, at your rhythm, in a space that holds you gently.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-8 py-6 text-base font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
            >
              <Link to="/start">Start your therapy</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-6 py-6 text-base text-foreground hover:bg-accent"
            >
              <Link to="/services">Explore services →</Link>
            </Button>
          </div>

          <div className="mt-14 grid max-w-md grid-cols-3 gap-6">
            {[
              { n: "+12k", l: "Sessions held" },
              { n: "+200", l: "Specialists" },
              { n: "4.9★", l: "Average rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-semibold text-foreground">{s.n}</div>
                <div className="mt-1 text-xs text-foreground/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[var(--note-4)] blur-2xl opacity-70" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)]">
            <img
              src={hero}
              alt="Person breathing peacefully at sunset"
              className="h-[560px] w-full object-cover"
              width={1024}
              height={1024}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] md:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--note-1)]" />
              <div>
                <div className="text-sm font-medium text-foreground">Session in 24h</div>
                <div className="text-xs text-foreground/60">Match with a specialist today</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modules / quick links */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Services",
              copy: "Individual, couples and group therapy with certified specialists.",
              to: "/services",
              bg: "var(--note-4)",
            },
            {
              title: "Blog",
              copy: "Gentle reads on anxiety, growth, sleep and the in-between.",
              to: "/blog",
              bg: "var(--note-3)",
            },
            {
              title: "Start your therapy",
              copy: "Take a 2-minute matching quiz and meet your specialist.",
              to: "/start",
              bg: "var(--note-2)",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-3xl p-8 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: c.bg }}
            >
              <h3 className="font-display text-2xl font-semibold text-foreground">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">{c.copy}</p>
              <span className="mt-6 inline-flex text-sm font-medium text-foreground/80 group-hover:text-foreground">
                Discover →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
