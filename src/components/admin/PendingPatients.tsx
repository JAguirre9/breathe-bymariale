import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

type PendingPatient = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: string;
  patientProfile?: {
    preferredName: string | null;
    patientID: string | null;
    patientIDType: string | null;
    phoneCode: string | null;
    phoneNumber: string | null;
    age: number | null;
    feelings: string | null;
    priorSessions: string | null;
    contactMethod: string | null;
  } | null;
};

type Activated = { name: string; email: string; password: string };

// Random temporary password, e.g. "Breathe-4821-kxqp"
function makePassword() {
  const letters = "abcdefghjkmnpqrstuvwxyz";
  let tail = "";
  for (let i = 0; i < 4; i++) {
    tail += letters[Math.floor(Math.random() * letters.length)];
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Breathe-${num}-${tail}`;
}

export function PendingPatients({ onActivated }: { onActivated?: () => void }) {
  const { lang } = useT();
  const es = lang === "es";

  const [patients, setPatients] = useState<PendingPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activated, setActivated] = useState<Activated | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch("/admin/patients/pending")
      .then((data) => setPatients(data.patients || []))
      .catch((err) => {
        console.error(err);
        setError(es ? "No se pudo cargar la lista." : "Could not load the list.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = async (p: PendingPatient) => {
    const password = (passwords[p.id] || "").trim();
    if (password.length < 6) {
      setError(
        es
          ? "La contraseña debe tener al menos 6 caracteres."
          : "The password must be at least 6 characters."
      );
      return;
    }
    setError("");
    setBusyId(p.id);
    try {
      await apiFetch(`/admin/patients/${p.id}/activate`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setPatients((prev) => prev.filter((x) => x.id !== p.id));
      setActivated({
        name: `${p.firstName}${p.lastName ? " " + p.lastName : ""}`,
        email: p.email,
        password,
      });
      setCopied(false);
      onActivated?.();
    } catch (err) {
      console.error(err);
      setError(
        es ? "No se pudo activar al paciente." : "Could not activate the patient."
      );
    } finally {
      setBusyId(null);
    }
  };

  const copyCredentials = async () => {
    if (!activated) return;
    const text = `Email: ${activated.email}\n${es ? "Contraseña" : "Password"}: ${activated.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mb-6 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          {es ? "Pacientes pendientes" : "Pending patients"}
          {patients.length > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">
              {patients.length}
            </span>
          )}
        </h2>
        <Button variant="ghost" size="sm" onClick={load}>
          {es ? "Actualizar" : "Refresh"}
        </Button>
      </div>
      <p className="mb-4 text-sm text-foreground/60">
        {es
          ? "Quienes se registraron y esperan acceso. Crea una contraseña temporal, actívalos y envíasela por tu canal de contacto."
          : "People who signed up and are waiting for access. Set a temporary password, activate them, and send it through their contact method."}
      </p>

      {error && (
        <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {activated && (
        <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <p className="font-medium text-foreground">
            {es
              ? `${activated.name} fue activado/a. Envíale estos datos ahora (la contraseña no se vuelve a mostrar):`
              : `${activated.name} is active. Send them these details now (the password is not shown again):`}
          </p>
          <p className="mt-2 font-mono text-foreground">Email: {activated.email}</p>
          <p className="font-mono text-foreground">
            {es ? "Contraseña" : "Password"}: {activated.password}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="rounded-full" onClick={copyCredentials}>
              {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Copiar" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => setActivated(null)}
            >
              {es ? "Cerrar" : "Dismiss"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-foreground/50">{es ? "Cargando..." : "Loading..."}</p>
      ) : patients.length === 0 ? (
        <p className="text-sm text-foreground/50">
          {es ? "No hay pacientes pendientes." : "No pending patients."}
        </p>
      ) : (
        <ul className="space-y-4">
          {patients.map((p) => {
            const pr = p.patientProfile;
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-border/50 bg-background/50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {p.firstName} {p.lastName || ""}
                      {pr?.preferredName ? ` (${pr.preferredName})` : ""}
                    </p>
                    <p className="text-sm text-foreground/60">{p.email}</p>
                  </div>
                  <p className="text-xs text-foreground/50">
                    {new Date(p.createdAt).toLocaleDateString(es ? "es-ES" : "en-US")}
                  </p>
                </div>

                {pr && (
                  <div className="mt-3 space-y-1 text-sm text-foreground/70">
                    {(pr.phoneNumber || pr.contactMethod) && (
                      <p>
                        <span className="text-foreground/50">
                          {es ? "Contacto: " : "Contact: "}
                        </span>
                        {pr.phoneCode} {pr.phoneNumber}
                        {pr.contactMethod ? ` · ${pr.contactMethod}` : ""}
                      </p>
                    )}
                    {pr.age != null && (
                      <p>
                        <span className="text-foreground/50">{es ? "Edad: " : "Age: "}</span>
                        {pr.age}
                      </p>
                    )}
                    {pr.patientID && (
                      <p>
                        <span className="text-foreground/50">
                          {es ? "Identificación: " : "ID: "}
                        </span>
                        {pr.patientIDType ? `${pr.patientIDType} ` : ""}
                        {pr.patientID}
                      </p>
                    )}
                    {pr.feelings && (
                      <p>
                        <span className="text-foreground/50">
                          {es ? "Cómo se siente: " : "How they feel: "}
                        </span>
                        {pr.feelings}
                      </p>
                    )}
                    {pr.priorSessions && (
                      <p>
                        <span className="text-foreground/50">
                          {es ? "Terapia previa: " : "Prior therapy: "}
                        </span>
                        {pr.priorSessions}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Input
                    type="text"
                    value={passwords[p.id] || ""}
                    onChange={(e) =>
                      setPasswords((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    placeholder={es ? "Contraseña temporal" : "Temporary password"}
                    className="min-w-[200px] flex-1 rounded-xl font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setPasswords((prev) => ({ ...prev, [p.id]: makePassword() }))
                    }
                  >
                    {es ? "Generar" : "Generate"}
                  </Button>
                  <Button
                    type="button"
                    disabled={busyId === p.id}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => activate(p)}
                  >
                    {busyId === p.id
                      ? es ? "Activando..." : "Activating..."
                      : es ? "Activar" : "Activate"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}