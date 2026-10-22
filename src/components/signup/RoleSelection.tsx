import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/lib/i18n";

type UserRole = "PATIENT" | "PSYCHOLOGIST";

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  setSelectedRole: React.Dispatch<
    React.SetStateAction<UserRole | null>
  >;
}

export function RoleSelection({
  selectedRole,
  setSelectedRole,
}: RoleSelectionProps) {
  const { t } = useT();

  return (
    <section className="space-y-8">

      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold">
          {t("signup.title")}
        </h2>

        <p className="mt-3 text-foreground/70">
          {t("signup.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">

        {/* Patient Card */}

        <Card
          onClick={() => setSelectedRole("PATIENT")}
          className={`cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]
          ${
            selectedRole === "PATIENT"
              ? "border-primary bg-primary/10"
              : "border-border"
          }`}
        >
          <CardContent className="flex flex-col items-center p-8 text-center">

            <div className="mb-5 text-6xl">
              🫂
            </div>

            <h3 className="font-display text-2xl">
              {t("signup.patient")}
            </h3>

            <p className="mt-4 text-sm text-foreground/70">
              {t("signup.patient.description")}
            </p>

          </CardContent>
        </Card>

        {/* Deactivate while MVP
        
        //Psychologist Card 

        <Card
          onClick={() => setSelectedRole("PSYCHOLOGIST")}
          className={`cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]
          ${
            selectedRole === "PSYCHOLOGIST"
              ? "border-primary bg-primary/10"
              : "border-border"
          }`}
        >
          <CardContent className="flex flex-col items-center p-8 text-center">

            <div className="mb-5 text-6xl">
              👩‍⚕️
            </div>

            <h3 className="font-display text-2xl">
              {t("signup.psychologist")}
            </h3>

            <p className="mt-4 text-sm text-foreground/70">
              {t("signup.psychologist.description")}
            </p>

          </CardContent>
        </Card>
          */}
      </div>
          
      {selectedRole && (
        <div className="flex justify-center pt-4">

          <Button
            size="lg"
            className="rounded-full px-12 py-6"
            onClick={() => setSelectedRole(selectedRole)}
          >
            {t("home.cta.start")}
          </Button>

        </div>
      )}

    </section>
  );
}