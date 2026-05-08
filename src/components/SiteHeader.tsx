import { Link } from "@tanstack/react-router";
import logo from "@/assets/breathe-logo.png";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/start", label: "Start your therapy" },
] as const;

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Breathe" className="h-9 w-9" />
          <span className="text-2xl font-display font-semibold tracking-tight text-foreground">
            Breathe
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
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
          <Button asChild variant="ghost" className="rounded-full text-foreground hover:bg-accent">
            <Link to="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
          >
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
