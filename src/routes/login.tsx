import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Breathe" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 pt-40 pb-24">
        <div className="rounded-3xl bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-foreground/60">Take a breath. We're glad you're here.</p>
          <form className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="mt-1.5 rounded-xl" />
            </div>
            <Button className="mt-2 w-full rounded-full bg-primary py-6 text-primary-foreground hover:bg-primary/90">
              Log in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-foreground/60">
            New here?{" "}
            <Link to="/signup" className="font-medium text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
