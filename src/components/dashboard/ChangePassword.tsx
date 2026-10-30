import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

export function ChangePassword() {
  const { lang } = useT();
  const es = lang === "es";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError(es ? "La nueva contraseña debe tener al menos 6 caracteres." : "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError(es ? "Las contraseñas no coinciden." : "Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setMessage(es ? "Contraseña actualizada." : "Password updated.");
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("current")) {
        setError(es ? "La contraseña actual no es correcta." : "Current password is incorrect.");
      } else {
        setError(es ? "No se pudo cambiar la contraseña." : "Could not change password.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-xl font-semibold text-foreground">
        {es ? "Cambiar contraseña" : "Change password"}
      </h2>
      <p className="mt-1 mb-4 text-sm text-foreground/60">
        {es
          ? "Usa una contraseña tuya después de que activemos tu cuenta."
          : "Set your own password after we activate your account."}
      </p>

      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <div>
          <Label htmlFor="current-pw">
            {es ? "Contraseña actual" : "Current password"}
          </Label>
          <Input
            id="current-pw"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div>
          <Label htmlFor="new-pw">
            {es ? "Nueva contraseña" : "New password"}
          </Label>
          <Input
            id="new-pw"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 rounded-xl"
            minLength={6}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirm-pw">
            {es ? "Confirmar nueva contraseña" : "Confirm new password"}
          </Label>
          <Input
            id="confirm-pw"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 rounded-xl"
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-primary">{message}</p>}

        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {saving ? "…" : es ? "Guardar contraseña" : "Save password"}
        </Button>
      </form>
    </section>
  );
}