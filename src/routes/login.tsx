import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Breathe" }] }),
  component: Login,
});

function Login() {
  const { t } = useT();
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 pt-40 pb-24">
        <div className="rounded-3xl bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("auth.welcome")}</h1>
          <p className="mt-2 text-sm text-foreground/60">{t("auth.welcome.sub")}</p>
          <form className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" className="mt-1.5 rounded-xl" />
            </div>
            <Button className="mt-2 w-full rounded-full bg-primary py-6 text-primary-foreground hover:bg-primary/90">
              {t("auth.login")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-foreground/60">
            {t("auth.new")}{" "}
            <Link to="/signup" className="font-medium text-primary">
              {t("auth.create.link")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
