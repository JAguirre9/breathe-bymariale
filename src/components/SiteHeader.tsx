import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/breathe-logo.png";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useT();
  const router = useRouter();
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("breathe.user");
    setUser(null);
    setMenuOpen(false);
    router.navigate({ to: "/" });
  };

  const nav = [
    { to: "/services", label: t("nav.services") },
    { to: "/resources", label: t("nav.resources") },
    { to: "/start", label: t("nav.start") },
    { to: "/merch", label: t("nav.merch") },
  ] as const;

  const homeLink = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const homeLabel = user?.role === "ADMIN" ? "Admin" : "Dashboard";

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Breathe" className="h-12 w-12" />
          <span className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Breathe
          </span>
        </Link>

        {/* Desktop nav */}
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

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full text-foreground hover:bg-accent"
                >
                  <Link to={homeLink}>{homeLabel}</Link>
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

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="border-t border-border/40 bg-card/95 px-6 py-4 shadow-[var(--shadow-card)] backdrop-blur md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-foreground/90 hover:bg-accent"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-3">
            {user ? (
              <>
                <Button asChild variant="ghost" className="justify-start rounded-xl">
                  <Link to={homeLink} onClick={() => setMenuOpen(false)}>
                    {homeLabel}
                  </Link>
                </Button>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="justify-start rounded-xl"
                >
                  {t("dash.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="justify-start rounded-xl">
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    {t("nav.login")}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    {t("nav.signup")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}