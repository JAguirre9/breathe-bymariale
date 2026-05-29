import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { submitIntakeFn } from "@/lib/db.functions";
export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Before we begin - Breathe" }] }),
  component: IntakeForm,
});

function IntakeForm() {
  const { t } = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [intake, setIntake] = useState({
    preferredName: "",
    age: "",
    feelings: "",
    priorSessions: "",
    contactMethod: "whatsapp",
    phoneCode: "+57",
    phoneNumber: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rawUser = localStorage.getItem("breathe.user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user || !user.id) {
      alert("Could not identify user. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        userId: String(user.id),
        preferredName: intake.preferredName,
        age: Number(intake.age),
        feelings: intake.feelings,
        priorSessions: intake.priorSessions,
        contactMethod: intake.contactMethod,
        phone: `${intake.phoneCode} ${intake.phoneNumber}`
      };

      const result = await submitIntakeFn({ data: payload as any });
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("Error: " + (result.errorMessage || "Could not save"));
      }
    } catch (error: any) {
      console.error(error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col px-6 pt-40 pb-24">
        
        {!isSuccess ? (
          <section className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
            <h2 className="mb-1 font-display text-2xl font-semibold text-foreground">
              {t("reg.form.begin")}
            </h2>
            <p className="mb-8 text-sm text-foreground/60">
              {t("reg.form.questions")}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="pname">{t("reg.form.called")}</Label>
                <Input
                  id="pname"
                  required
                  value={intake.preferredName}
                  onChange={(e) => setIntake({ ...intake, preferredName: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              
              <div>
                <Label htmlFor="age">{t("reg.form.age")}</Label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  required
                  value={intake.age}
                  onChange={(e) => setIntake({ ...intake, age: e.target.value })}
                  className="mt-1.5 rounded-xl sm:w-32"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">{t("reg.form.phNum")}</Label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    value={intake.phoneCode}
                    onChange={(e) => setIntake({ ...intake, phoneCode: e.target.value })}
                    className="flex h-10 w-28 items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+52">🇲🇽 +52</option>
                  </select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={intake.phoneNumber}
                    onChange={(e) => setIntake({ ...intake, phoneNumber: e.target.value })}
                    className="flex-1 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="feelings">{t("reg.form.feelings")}</Label>
                <Textarea
                  id="feelings"
                  required
                  value={intake.feelings}
                  onChange={(e) => setIntake({ ...intake, feelings: e.target.value })}
                  className="mt-1.5 min-h-28 rounded-xl"
                />
              </div>
              
              <div>
                <Label>{t("reg.form.priorSess")}</Label>
                <div className="mt-2 flex gap-3">
                  {["yes", "no"].map((v) => (
                    <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-sm capitalize ${intake.priorSessions === v ? "border-primary bg-primary/15 text-primary" : "border-border"}`}>
                      <input type="radio" name="prior" value={v} className="sr-only" checked={intake.priorSessions === v} onChange={() => setIntake({ ...intake, priorSessions: v })} required />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>{t("reg.form.contact")}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{v: "whatsapp", l: "WhatsApp"}, {v: "email", l: "Email"}, {v: "phone", l: "Phone call"}].map((o) => (
                    <label key={o.v} className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${intake.contactMethod === o.v ? "border-primary bg-primary/15 text-primary" : "border-border"}`}>
                      <input type="radio" name="contact" value={o.v} className="sr-only" checked={intake.contactMethod === o.v} onChange={() => setIntake({ ...intake, contactMethod: o.v })} />
                      {o.l}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <p className="mb-4 text-sm italic text-foreground/70">{t("reg.form.thanks")}</p>
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-full py-6 text-lg">
                  {isSubmitting ? "Submitting..." : t("reg.form.submit")}
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-foreground/60">
              {t("reg.form.alreadyAccount")}{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Log in here</Link>
            </p>
          </section>
        ) : (
          <section className="rounded-3xl bg-card p-12 text-center shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-3xl font-semibold">Form Submitted</h2>
            <Link to="/"><Button variant="outline" className="rounded-full">Back to home</Button></Link>
          </section>
        )}
      </main>
    </div>
  );
}