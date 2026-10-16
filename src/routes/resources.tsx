import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources - Breathe" },
      { name: "description", content: "Gentle reads on mental wellbeing." },
    ],
  }),
  component: Resources,
});

const posts = [
  { k: "res.post1", bodyKey: "res.post1.body", e: 5, bg: "var(--note-3)" },
  { k: "res.post2", bodyKey: "res.post2.body", e: 7, bg: "var(--note-2)" },
  { k: "res.post3", bodyKey: "res.post3.body", e: 4, bg: "var(--note-4)" },
  { k: "res.post4", bodyKey: "res.post4.body", e: 6, bg: "var(--note-1)" },
] as const;

function FlipCard({
  title,
  minutes,
  bg,
  body,
  clickToRead,
  clickToClose,
}: {
  title: string;
  minutes: number;
  bg: string;
  body: string;
  clickToRead: string;
  clickToClose: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-64 w-full cursor-pointer text-left [perspective:1000px]"
      aria-label={flipped ? clickToClose : clickToRead}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl p-10 [backface-visibility:hidden]"
          style={{ backgroundColor: bg }}
        >
          <span className="text-xs uppercase tracking-wider text-foreground/60">
            {minutes} min
          </span>
          <h3 className="mt-3 font-display text-3xl text-foreground">{title}</h3>
          <p className="mt-6 text-sm text-foreground/50">{clickToRead}</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: bg }}
        >
          <p className="text-base leading-relaxed text-foreground/90">{body}</p>
          <p className="mt-6 text-sm text-foreground/50">{clickToClose}</p>
        </div>
      </div>
    </button>
  );
}

function Resources() {
  const { t } = useT();

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("res.title1")} <span className="italic text-primary">{t("res.title2")}</span>
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <FlipCard
              key={p.k}
              title={t(p.k)}
              minutes={p.e}
              bg={p.bg}
              body={t(p.bodyKey)}
              clickToRead={t("res.clickToRead")}
              clickToClose={t("res.clickToClose")}
            />
          ))}
        </div>
      </main>
    </div>
  );
}