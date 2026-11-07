import {
  createFileRoute,
  Link,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

import { RoleSelection } from "@/components/signup/RoleSelection";
import { PatientForm } from "@/components/signup/PatientForm";
import { PsychologistForm } from "@/components/signup/PsychologistForm";
import { SuccessMessage } from "@/components/signup/SuccessMessage";

import {
  UserRole,
  SignupIntake,
  defaultSignupIntake,
} from "@/lib/signup-types";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign Up | Breathe" }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      role: search.role === "patient" ? "patient" : undefined,
    };
  },
  component: SignupPage,
});

function SignupPage() {
  const { lang } = useT();
  const es = lang === "es";
  const router = useRouter();
  const { role } = useSearch({ from: "/signup" });

  // Si viene de /start con ?role=patient → salta la card
  const cameFromStart = role === "patient";

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    role === "patient" ? "PATIENT" : null
  );

  const [consented, setConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [intake, setIntake] = useState<SignupIntake>(defaultSignupIntake);

  const API_URL = import.meta.env.VITE_API_URL || "https://api.breathecol.com";

  async function handlePatientSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/intake/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: intake.firstName,
          lastName: intake.lastName,
          preferredName: intake.preferredName,
          email: intake.email,
          patientID: intake.patientID,
          phoneCode: intake.phoneCode,
          phoneNumber: intake.phoneNumber,
          contactMethod: intake.contactMethod,
          age: intake.age,
          feelings: intake.feelings,
          priorSessions: intake.priorSessions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.error || "Could not submit form");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePsychologistSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("PSYCHOLOGIST");
      console.table(intake);
      /**
       * Future:
       * POST /api/intake/psychologist
       */
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gradient-hero)" }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pt-40 pb-24">
        {isSuccess ? (
          <SuccessMessage role={selectedRole!} />
        ) : (
          <>
            {!selectedRole && (
              <RoleSelection
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            )}

            {selectedRole === "PATIENT" && !consented && (
              <ConsentStep
                es={es}
                onAccept={() => setConsented(true)}
                onBack={() => {
                  if (cameFromStart) {
                    router.navigate({ to: "/start" });
                  } else {
                    setSelectedRole(null);
                  }
                }}
              />
            )}

            {selectedRole === "PATIENT" && consented && (
              <PatientForm
                intake={intake}
                setIntake={setIntake}
                onSubmit={handlePatientSubmit}
                isSubmitting={isSubmitting}
                onBack={() => {
                  if (cameFromStart) {
                    router.navigate({ to: "/start" });
                  } else {
                    setSelectedRole(null);
                    setConsented(false);
                  }
                }}
              />
            )}

            {/*
            {selectedRole === "PSYCHOLOGIST" && (
              <PsychologistForm
                intake={intake}
                setIntake={setIntake}
                onSubmit={handlePsychologistSubmit}
                isSubmitting={isSubmitting}
                onBack={() => setSelectedRole(null)}
              />
            )}
            */}
          </>
        )}
      </main>
    </div>
  );
}

function ConsentStep({
  es,
  onAccept,
  onBack,
}: {
  es: boolean;
  onAccept: () => void;
  onBack: () => void;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-2xl font-semibold text-foreground">
        {es ? "Antes de empezar" : "Before we begin"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        {es
          ? "Vamos a guardar tus datos personales y lo que escribas en tu diario para acompañar tu proceso. Tu especialista podrá verlos; ningún otro paciente."
          : "We will store your personal details and what you write in your journal to support your care. Your specialist can see them; no other patient can."}
      </p>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--primary)]"
        />
        <span>
          {es ? "He leído y acepto la " : "I have read and accept the "}
          <Link
            to="/privacy"
            target="_blank"
            className="font-medium text-primary underline"
          >
            {es ? "Política de privacidad" : "Privacy Policy"}
          </Link>
          {es
            ? " y autorizo el tratamiento de mis datos."
            : " and consent to the processing of my data."}
        </span>
      </label>

      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={onBack}
        >
          {es ? "Atrás" : "Back"}
        </Button>
        <Button
          type="button"
          disabled={!checked}
          onClick={onAccept}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {es ? "Continuar" : "Continue"}
        </Button>
      </div>
    </div>
  );
}