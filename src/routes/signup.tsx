import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";

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
    meta: [
      {
        title: "Sign Up | Breathe",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [selectedRole, setSelectedRole] =
    useState<UserRole | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [intake, setIntake] =
    useState<SignupIntake>(defaultSignupIntake);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
      style={{
        background: "var(--gradient-hero)",
      }}
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

            {selectedRole === "PATIENT" && (
              <PatientForm
                intake={intake}
                setIntake={setIntake}
                onSubmit={handlePatientSubmit}
                isSubmitting={isSubmitting}
                onBack={() => setSelectedRole(null)}
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
            )} */}
          </>
        )}

      </main>
    </div>
  );
}