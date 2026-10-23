import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/breathe-logo.png";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useT();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // Check if user is logged in
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("breathe.user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const logout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore network errors on logout
  }

  localStorage.removeItem("breathe.user");
  setUser(null);
  router.navigate({ to: "/" });
};

  const nav = [
    { to: "/services", label: t("nav.services") },
    { to: "/resources", label: t("nav.resources") },
    { to: "/start", label: t("nav.start") },
    { to: "/merch", label: t("nav.merch") },
  ] as const;

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Breathe" className="h-12 w-12" />
          <span className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Breathe
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />

          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-foreground hover:bg-accent"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                onClick={logout}
                variant="ghost"
                className="rounded-full text-foreground hover:bg-accent"
              >
                {t("dash.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-foreground hover:bg-accent"
              >
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
              >
                <Link to="/signup">{t("nav.signup")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}