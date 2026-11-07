import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientFormProps {
  intake: any;
  setIntake: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PatientForm({
  intake,
  setIntake,
  onSubmit,
  onBack,
  isSubmitting,
}: PatientFormProps) {
  const { t } = useT();
  const [idHelpOpen, setIdHelpOpen] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* PERSONAL INFORMATION */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.personalInfo")}
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>{t("signup.firstName")}</Label>
            <Input
              className="mt-2 rounded-xl"
              required
              value={intake.firstName}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  firstName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.lastName")}</Label>
            <Input
              className="mt-2 rounded-xl"
              required
              value={intake.lastName}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  lastName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.preferredName")}</Label>
            <Input
              className="mt-2 rounded-xl"
              value={intake.preferredName}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  preferredName: e.target.value,
                })
              }
            />
          </div>

          {/* IDENTIFICATION (type + number + help tooltip) */}
          <div>
            <div className="flex items-center gap-1.5">
              <Label>{t("signup.patientID")}</Label>

              <TooltipProvider delayDuration={100}>
                <Tooltip open={idHelpOpen} onOpenChange={setIdHelpOpen}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={t("signup.patientID.help")}
                      onClick={() => setIdHelpOpen(true)}
                      className="rounded-full text-foreground/50 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-64 text-center">
                    {t("signup.patientID.help")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-2 flex h-9 w-full overflow-hidden rounded-xl border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
              <select
                aria-label="Tipo de documento"
                className="h-full shrink-0 border-0 border-r border-input bg-muted/40 pl-3 pr-1 text-sm focus-visible:outline-none"
                value={intake.patientIDType}
                onChange={(e) =>
                  setIntake({
                    ...intake,
                    patientIDType: e.target.value,
                  })
                }
              >
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="TI">TI</option>
                <option value="PA">PA</option>
              </select>

              <Input
                className="h-full min-w-0 flex-1 rounded-none border-0 shadow-none focus-visible:ring-0"
                value={intake.patientID}
                maxLength={30}
                autoComplete="off"
                onChange={(e) =>
                  setIntake({
                    ...intake,
                    patientID: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>{t("signup.email")}</Label>
            <Input
              type="email"
              className="mt-2 rounded-xl"
              required
              value={intake.email}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  email: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        {/* Reusing "contactMethod" or similar for Contact section title */}
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.contactMethod")}
        </h3>

        <div className="grid gap-5 md:grid-cols-[130px_1fr]">
          <div>
            <Label>Code</Label>
            <select
              className="mt-2 h-9 w-full rounded-xl border border-input bg-background px-3"
              value={intake.phoneCode}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  phoneCode: e.target.value,
                })
              }
            >
              <option value="+57">🇨🇴 +57</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+52">🇲🇽 +52</option>
            </select>
          </div>

          <div>
            <Label>{t("signup.phone")}</Label>
            <Input
              className="mt-2 rounded-xl"
              required
              value={intake.phoneNumber}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* ABOUT YOU */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.biography")}
        </h3>

        <div className="space-y-6">
          <div>
            <Label>{t("signup.age")}</Label>
            <Input
              type="number"
              min={1}
              max={120}
              className="mt-2 rounded-xl w-36"
              value={intake.age}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  age: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.feelings")}</Label>
            <Textarea
              className="mt-2 min-h-32 rounded-xl"
              value={intake.feelings}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  feelings: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* PRIOR THERAPY */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.previousTherapy")}
        </h3>

        <div className="flex gap-3">
          {[
            { value: "yes", label: t("signup.yes") },
            { value: "no", label: t("signup.no") },
          ].map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border px-5 py-3 transition ${
                intake.priorSessions === option.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={intake.priorSessions === option.value}
                onChange={() =>
                  setIntake({
                    ...intake,
                    priorSessions: option.value,
                  })
                }
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      {/* CONTACT METHOD */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.contactMethod")}
        </h3>

        <div className="flex flex-wrap gap-3">
          {[
            {
              value: "whatsapp",
              label: t("signup.whatsapp"),
            },
            {
              value: "email",
              label: t("signup.emailOption"),
            },
            {
              value: "phone",
              label: t("signup.phoneOption"),
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border px-5 py-3 transition ${
                intake.contactMethod === option.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={intake.contactMethod === option.value}
                onChange={() =>
                  setIntake({
                    ...intake,
                    contactMethod: option.value,
                  })
                }
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full py-6"
          onClick={onBack}
        >
          ← {t("signup.back")}
        </Button>

        <Button
          type="submit"
          className="flex-1 rounded-full py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : t("signup.submitPatient")}
        </Button>
      </div>
    </form>
  );
}