import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  role: "PATIENT" | "PSYCHOLOGIST";
}

export function SuccessMessage({
  role,
}: SuccessMessageProps) {
  const title =
    role === "PATIENT"
      ? "Thank you for reaching out 💜"
      : "Thank you for applying 💜";

  const description =
    role === "PATIENT"
      ? "One of our care coordinators will review your information and contact you within the next 24-48 hours to schedule your first session."
      : "Our clinical team will review your application. If your profile matches our current needs, we'll contact you for the next step.";

  return (
    <section className="rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-card)]">

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">

        <span className="text-4xl">
          ✓
        </span>

      </div>

      <h2 className="font-display text-3xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-foreground/70 leading-7">
        {description}
      </p>

      <div className="mt-10">

        <Link to="/">
          <Button className="rounded-full px-10">
            Return Home
          </Button>
        </Link>

      </div>

    </section>
  );
}