import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import marialePhoto from "@/assets/mariale.jpeg";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Conócenos - Breathe" },
      {
        name: "description",
        content:
          "Conoce a Mariale, fundadora de Breathe, la historia del espacio y agenda tu primera sesión.",
      },
    ],
  }),
  component: Start,
});

function Start() {
  const { t } = useT();

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-36 pb-24">
        <div className="flex flex-col items-center text-center">
          {/* Foto */}
          <div className="mb-10 overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <img
              src={marialePhoto}
              alt="Mariale Marulanda"
              className="h-64 w-64 object-cover md:h-72 md:w-72"
            />
          </div>

          {/* Título */}
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            {t("start.title1")}{" "}
            <span className="italic text-primary">{t("start.title2")}</span>
          </h1>
        </div>

        {/* Bio */}
        <section className="mt-14 rounded-3xl bg-card/60 p-8 shadow-[var(--shadow-card)] md:p-10">
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {t("start.bio.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("start.bio.p1")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("start.bio.p2")}
          </p>
        </section>

        {/* Cómo nació Breathe */}
        <section className="mt-8 rounded-3xl bg-card/60 p-8 shadow-[var(--shadow-card)] md:p-10">
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {t("start.story.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("start.story.p1")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("start.story.p2")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("start.story.p3")}
          </p>
        </section>

        {/* CTA al final */}
        <div className="mt-12 flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-10 py-7 text-base text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
          >
            <Link to="/signup" search={{ role: "patient" }}>
              {t("start.cta")}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}