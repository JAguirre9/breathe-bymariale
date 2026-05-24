import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import { signUpUserFn } from "../lib/db.functions"; 

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Breathe" }] }),
  component: Signup,
});

function Signup() {
  const { t } = useT();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await (signUpUserFn as any)({ data: { name, email, password } });

      if (result.success) {
        alert(t("auth.signup.success") || "Account registered successfully!");
        router.navigate({ to: "/login" });
      } else {
        if (result.errorCode === "EMAIL_ALREADY_EXISTS") {
          alert(t("auth.error.emailExists") || "This email is already registered.");
        } else {
          alert(result.errorMessage || t("auth.error.generic") || "An error occurred during registration.");
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(`Connection Error: ${error.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 pt-40 pb-24">
        <div className="rounded-3xl bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("auth.create")}</h1>
          <p className="mt-2 text-sm text-foreground/60">{t("auth.create.sub")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input 
                id="name" 
                className="mt-1.5 rounded-xl" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              {loading ? "Registering..." : t("auth.signup")}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-foreground/60">
            {t("auth.have")}{" "}
            <Link to="/login" className="font-medium text-primary">
              {t("auth.login")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}