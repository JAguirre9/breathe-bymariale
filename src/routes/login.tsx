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

const API_URL = import.meta.env.VITE_API_URL || "https://api.breathecol.com";

function Login() {
  const { t } = useT();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.error.invalidCredentials"));
        return;
      }

      // Keep a small local copy for UI (name in header/dashboard)
      if (data.user) {
        localStorage.setItem(
          "breathe.user",
          JSON.stringify({
            id: data.user.id,
            name: data.user.firstName || data.user.username,
            email: data.user.email,
            role: data.user.role,
          })
        );
      }

      router.navigate({
        to: data.user?.role === "ADMIN" ? "/admin" : "/dashboard",
      });
    } catch {
      setError(t("auth.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 pt-40 pb-24">
        <div className="rounded-3xl bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t("auth.welcome")}
          </h1>
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

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-primary py-6 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "..." : t("auth.login")}
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
