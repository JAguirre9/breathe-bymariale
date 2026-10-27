import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin - Breathe" }] }),
  component: AdminPage,
});

type Patient = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
};

// Roles allowed on this page. Add "PSYCHOLOGIST" here when specialists get access.
const ALLOWED_ROLES = ["ADMIN"];

function AdminPage() {
  const { t } = useT();
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  // New task form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Access check + load patients.
  // This only decides what to show; the API enforces the real permissions.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("breathe.user");
    if (!raw) {
      router.navigate({ to: "/login" });
      return;
    }
    const u = JSON.parse(raw);
    if (!ALLOWED_ROLES.includes(u.role)) {
      router.navigate({ to: "/dashboard" });
      return;
    }

    apiFetch("/admin/patients")
      .then((data) => setPatients(data.patients || []))
      .catch((err) => {
        console.error(err);
        setError(t("admin.error"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Load the selected patient's tasks
  useEffect(() => {
    setEditingId(null);
    if (!patientId) {
      setTasks([]);
      return;
    }
    apiFetch(`/tasks/patient/${patientId}`)
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => {
        console.error(err);
        setError(t("admin.error"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !newTitle.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          patientId,
          title: newTitle.trim(),
          description: newDesc.trim() || null,
        }),
      });
      setTasks((prev) => [data.task, ...prev]);
      setNewTitle("");
      setNewDesc("");
    } catch (err) {
      console.error(err);
      setError(t("admin.error"));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    setError("");
    try {
      const data = await apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim() || null,
        }),
      });
      setTasks((prev) => prev.map((tk) => (tk.id === id ? data.task : tk)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.error"));
    }
  };

  const removeTask = async (id: string) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    setError("");
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((tk) => tk.id !== id));
    } catch (err) {
      console.error(err);
      setError(t("admin.error"));
    }
  };

  const patientLabel = (p: Patient) =>
    `${p.firstName}${p.lastName ? " " + p.lastName : ""} (${p.email})`;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          {t("admin.title")}
        </h1>
        <p className="mt-1 mb-8 text-sm text-foreground/60">
          {t("admin.subtitle")}
        </p>

        {error && (
          <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Patient picker */}
        <section className="mb-6 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
          <label className="mb-2 block text-sm font-medium text-foreground">
            {t("admin.patient")}
          </label>
          {patients.length === 0 ? (
            <p className="text-sm text-foreground/50">{t("admin.noPatients")}</p>
          ) : (
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("admin.selectPatient")}</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {patientLabel(p)}
                </option>
              ))}
            </select>
          )}
        </section>

        {patientId && (
          <>
            {/* New task */}
            <form
              onSubmit={addTask}
              className="mb-6 space-y-3 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <h2 className="font-display text-xl font-semibold">
                {t("admin.newTask")}
              </h2>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t("admin.taskTitle")}
                className="rounded-xl"
              />
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={t("admin.taskDesc")}
                className="rounded-xl"
              />
              <Button
                type="submit"
                disabled={saving || !newTitle.trim()}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t("admin.addTask")}
              </Button>
            </form>

            {/* Task list */}
            <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
              {tasks.length === 0 ? (
                <p className="text-sm text-foreground/50">
                  {t("admin.tasks.empty")}
                </p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
                    >
                      {editingId === task.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="rounded-xl"
                          />
                          <Textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="rounded-xl"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEdit(task.id)}>
                              {t("admin.save")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              {t("admin.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${
                                task.done
                                  ? "line-through text-foreground/50"
                                  : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="mt-0.5 text-xs text-foreground/60">
                                {task.description}
                              </p>
                            )}
                            {task.done && (
                              <p className="mt-1 text-xs font-medium text-primary">
                                ✓ {t("admin.done")}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(task)}
                            >
                              {t("admin.edit")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTask(task.id)}
                              className="text-foreground/50 hover:text-destructive"
                            >
                              {t("admin.delete")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}