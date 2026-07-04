import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";

interface PsychologistFormProps {
  intake: any;
  setIntake: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PsychologistForm({
  intake,
  setIntake,
  onSubmit,
  onBack,
  isSubmitting,
}: PsychologistFormProps) {
  const { t } = useT();

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* PERSONAL INFORMATION */}
      <section className="rounded-2xl bg-accent/30 p-6">
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

      {/* PROFESSIONAL INFORMATION */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.professionalInfo")}
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>{t("signup.professionalLicense")}</Label>
            <Input
              className="mt-2 rounded-xl"
              required
              value={intake.license}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  license: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.licenseCountry")}</Label>
            <Input
              className="mt-2 rounded-xl"
              required
              value={intake.licenseCountry}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  licenseCountry: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.yearsExperience")}</Label>
            <Input
              type="number"
              className="mt-2 rounded-xl"
              required
              value={intake.yearsExperience}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  yearsExperience: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>{t("signup.degree")}</Label>
            <Input
              className="mt-2 rounded-xl"
              value={intake.degree}
              onChange={(e) =>
                setIntake({
                  ...intake,
                  degree: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.specialties")}
        </h3>

        <Textarea
          className="min-h-32 rounded-xl"
          placeholder="Trauma, Anxiety, Depression, Couples Therapy..."
          value={intake.specialties}
          onChange={(e) =>
            setIntake({
              ...intake,
              specialties: e.target.value,
            })
          }
        />
      </section>

      {/* LANGUAGES */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.languages")}
        </h3>

        <Input
          className="rounded-xl"
          placeholder="English, Spanish..."
          value={intake.languages}
          onChange={(e) =>
            setIntake({
              ...intake,
              languages: e.target.value,
            })
          }
        />
      </section>

      {/* CONTACT */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        {/* Using the closest available translation for the Contact heading since "Contact Information" wasn't explicitly in the dictionary */}
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.contactMethod")}
        </h3>

        <div className="grid gap-5 md:grid-cols-[130px_1fr]">
          <div>
            <Label>Code</Label>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3"
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

        <div className="mt-6">
          <Label>{t("signup.contactMethod")}</Label>

          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { value: "whatsapp", label: t("signup.whatsapp") },
              { value: "email", label: t("signup.emailOption") },
              { value: "phone", label: t("signup.phoneOption") },
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
                  className="sr-only"
                  type="radio"
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
        </div>
      </section>

      {/* WHY BREATHE */}
      <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-6 font-display text-2xl">
          {t("signup.biography")}
        </h3>

        <Textarea
          className="min-h-36 rounded-xl"
          placeholder="..."
          value={intake.motivation}
          onChange={(e) =>
            setIntake({
              ...intake,
              motivation: e.target.value,
            })
          }
        />
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
          {isSubmitting ? "..." : t("signup.submitPsychologist")}
        </Button>
      </div>
    </form>
  );
}