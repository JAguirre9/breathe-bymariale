import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

interface SuccessMessageProps {
  role: "PATIENT" | "PSYCHOLOGIST";
}

export function SuccessMessage({ role }: SuccessMessageProps) {
  const { t } = useT();

  const title =
    role === "PATIENT"
      ? t("intake.success.title")
      : t("intake.psychologist.success.title");

  const description =
    role === "PATIENT"
      ? t("intake.success.subtitle")
      : t("intake.psychologist.success.subtitle");

  return (
    <section className="rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
        <span className="text-4xl">✓</span>
      </div>

      <h2 className="font-display text-3xl">{title}</h2>

      <p className="mx-auto mt-5 max-w-lg text-foreground/70 leading-7">
        {description}
      </p>

      <div className="mt-10">
        <Link to="/">
          <Button className="rounded-full px-10">
            {/* You can also translate this later if you add a key */}
            Return Home
          </Button>
        </Link>
      </div>
    </section>
  );
}