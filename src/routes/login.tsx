import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in - Breathe" }] }),
  component: Login,
});

function Login() {
  const { t } = useT();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "breathe.user",
        JSON.stringify({ id: "local-user", name: email.split("@")[0] || "You", email }),
      );
    }
    router.navigate({ to: "/dashboard" });
  };

  const useMockUser = () => {
    if (typeof window === "undefined") return;
    const mock = { id: "mock-user-1", name: "Test Consultant", email: "test@breathe.local" };
    localStorage.setItem("breathe.user", JSON.stringify(mock));
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 pt-40 pb-24">
        <div className="rounded-3xl bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("auth.welcome")}</h1>
          <p className="mt-2 text-sm text-foreground/60">{t("auth.welcome.sub")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                className="mt-1.5 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                className="mt-1.5 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-primary py-6 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : t("auth.login")}
            </Button>

            {import.meta.env.VITE_SHOW_MOCK_USER === "true" && (
              <Button
                type="button"
                variant="outline"
                onClick={useMockUser}
                className="w-full rounded-full"
              >
                Use mock user (dev)
              </Button>
            )}
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
