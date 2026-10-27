import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources - Breathe" },
      { name: "description", content: "Gentle reads on mental wellbeing." },
    ],
  }),
  component: Resources,
});

type ResourceItem = {
  id: string;
  titleEn: string;
  titleEs: string;
  bodyEn: string;
  bodyEs: string;
  minutes: number;
  bgColor: string;
  sortOrder: number;
};

// Fallback while API is empty / offline
const FALLBACK: ResourceItem[] = [
  {
    id: "fallback-1",
    titleEn: "A small guide to slowing down",
    titleEs: "Una pequeña guía para ir más despacio",
    bodyEn:
      "Slowing down is not laziness. It is a quiet act of care. Start with one breath, one pause, one moment without rushing.",
    bodyEs:
      "Ir más despacio no es pereza. Es un acto silencioso de cuidado. Empieza con una respiración, una pausa, un momento sin prisa.",
    minutes: 5,
    bgColor: "var(--note-3)",
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    titleEn: "When anxiety knocks softly",
    titleEs: "Cuando la ansiedad llama suavemente",
    bodyEn:
      "Anxiety often arrives as a soft knock. Notice it, name it, and give it space instead of fighting it. You are safe here.",
    bodyEs:
      "La ansiedad a menudo llega como un golpecito suave. Nómbrala, dale espacio en lugar de pelear con ella. Aquí estás a salvo.",
    minutes: 7,
    bgColor: "var(--note-2)",
    sortOrder: 1,
  },
  {
    id: "fallback-3",
    titleEn: "The art of choosing rest",
    titleEs: "El arte de elegir el descanso",
    bodyEn:
      "Rest is not something you earn. It is something your nervous system needs. Choosing rest is choosing yourself.",
    bodyEs:
      "El descanso no es algo que debas ganar. Es algo que tu sistema nervioso necesita. Elegir descansar es elegirte a ti.",
    minutes: 4,
    bgColor: "var(--note-4)",
    sortOrder: 2,
  },
  {
    id: "fallback-4",
    titleEn: "Sleep, breath and morning light",
    titleEs: "Sueño, respiración y luz de la mañana",
    bodyEn:
      "Morning light, a few slow breaths, and a soft intention. Small rituals can gently reshape how the day begins.",
    bodyEs:
      "Luz de la mañana, unas respiraciones lentas y una intención suave. Los pequeños rituales pueden transformar cómo empieza el día.",
    minutes: 6,
    bgColor: "var(--note-1)",
    sortOrder: 3,
  },
];

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
  const { t, lang } = useT();
  const [posts, setPosts] = useState<ResourceItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const PER_PAGE = 4;

  useEffect(() => {
    apiFetch("/content/resources")
      .then((data) => {
        if (data.resources?.length) {
          setPosts(data.resources);
        }
      })
      .catch(() => {
        // keep fallback
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = posts.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-24">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {t("res.title1")}{" "}
          <span className="italic text-primary">{t("res.title2")}</span>
        </h1>

        {loading && (
          <p className="mt-8 text-sm text-foreground/50">…</p>
        )}

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {visible.map((p) => (
            <FlipCard
              key={p.id}
              title={lang === "es" ? p.titleEs : p.titleEn}
              minutes={p.minutes}
              bg={p.bgColor}
              body={lang === "es" ? p.bodyEs : p.bodyEn}
              clickToRead={t("res.clickToRead")}
              clickToClose={t("res.clickToClose")}
            />
          ))}
        </div>
        
        {/* Pagination — only when there is more than one page */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={safePage === 0}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              ←
            </button>

            <span className="text-sm text-foreground/60">
              {safePage + 1} / {totalPages}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={safePage >= totalPages - 1}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}