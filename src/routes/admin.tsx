import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { MerchEditor } from "@/components/admin/MerchEditor";
import { PendingPatients } from "@/components/admin/PendingPatients";
import { ServicesEditor } from "@/components/admin/ServicesEditor";

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

type Resource = {
  id: string;
  titleEn: string;
  titleEs: string;
  bodyEn: string;
  bodyEs: string;
  minutes: number;
  bgColor: string;
  sortOrder: number;
  published: boolean;
};

type JournalEntry = {
  id: string;
  date: string;
  title: string;
  mood: number;
  text: string;
  createdAt: string;
};

type PatientSession = {
  id: string;
  date: string;
  time: string;
  title: string;
  specialist: string | null;
  createdAt: string;
};

const ALLOWED_ROLES = ["ADMIN"];

function AdminPage() {
  const { t } = useT();
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);

  const [sessions, setSessions] = useState<PatientSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [resources, setResources] = useState<Resource[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [resSaving, setResSaving] = useState(false);
  const [editingResId, setEditingResId] = useState<string | null>(null);

  const emptyResForm = {
    titleEn: "",
    titleEs: "",
    bodyEn: "",
    bodyEs: "",
    minutes: 5,
    bgColor: "var(--note-3)",
    sortOrder: 0,
    published: true,
  };
  const [resForm, setResForm] = useState(emptyResForm);

  // Access check + load active patients
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

  // Load resources
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("breathe.user");
    if (!raw) return;
    const u = JSON.parse(raw);
    if (!ALLOWED_ROLES.includes(u.role)) return;

    setResLoading(true);
    apiFetch("/content/admin/resources")
      .then((data) => setResources(data.resources || []))
      .catch((err) => {
        console.error(err);
        setResError(t("admin.error"));
      })
      .finally(() => setResLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load tasks + journal + sessions when a patient is selected
  useEffect(() => {
    setEditingId(null);
    setActiveJournalId(null);

    if (!patientId) {
      setTasks([]);
      setJournalEntries([]);
      setSessions([]);
      return;
    }

    apiFetch(`/tasks/patient/${patientId}`)
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => {
        console.error(err);
        setError(t("admin.error"));
      });

    setJournalLoading(true);
    apiFetch(`/admin/patients/${patientId}/journal`)
      .then((data) => {
        const list: JournalEntry[] = data.entries || [];
        setJournalEntries(list);
        if (list.length > 0) setActiveJournalId(list[0].id);
      })
      .catch((err) => {
        console.error(err);
        setError(t("admin.error"));
      })
      .finally(() => setJournalLoading(false));

    setSessionsLoading(true);
    apiFetch(`/admin/patients/${patientId}/sessions`)
      .then((data) => setSessions(data.sessions || []))
      .catch((err) => {
        console.error(err);
        setError(t("admin.error"));
      })
      .finally(() => setSessionsLoading(false));
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

  const saveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.titleEn.trim() || !resForm.titleEs.trim() || resSaving) return;
    setResSaving(true);
    setResError("");
    try {
      if (editingResId) {
        const data = await apiFetch(`/content/admin/resources/${editingResId}`, {
          method: "PATCH",
          body: JSON.stringify(resForm),
        });
        setResources((prev) =>
          prev.map((r) => (r.id === editingResId ? data.resource : r))
        );
      } else {
        const data = await apiFetch("/content/admin/resources", {
          method: "POST",
          body: JSON.stringify(resForm),
        });
        setResources((prev) =>
          [...prev, data.resource].sort((a, b) => a.sortOrder - b.sortOrder)
        );
      }
      setResForm(emptyResForm);
      setEditingResId(null);
    } catch (err) {
      console.error(err);
      setResError(t("admin.error"));
    } finally {
      setResSaving(false);
    }
  };

  const startEditResource = (r: Resource) => {
    setEditingResId(r.id);
    setResForm({
      titleEn: r.titleEn,
      titleEs: r.titleEs,
      bodyEn: r.bodyEn,
      bodyEs: r.bodyEs,
      minutes: r.minutes,
      bgColor: r.bgColor,
      sortOrder: r.sortOrder,
      published: r.published,
    });
  };

  const cancelEditResource = () => {
    setEditingResId(null);
    setResForm(emptyResForm);
  };

  const removeResource = async (id: string) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    setResError("");
    try {
      await apiFetch(`/content/admin/resources/${id}`, { method: "DELETE" });
      setResources((prev) => prev.filter((r) => r.id !== id));
      if (editingResId === id) cancelEditResource();
    } catch (err) {
      console.error(err);
      setResError(t("admin.error"));
    }
  };

  const patientLabel = (p: Patient) =>
    `${p.firstName}${p.lastName ? " " + p.lastName : ""} (${p.email})`;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-20">
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

        <PendingPatients
          onActivated={() =>
            apiFetch("/admin/patients")
              .then((data) => setPatients(data.patients || []))
              .catch(console.error)
          }
        />

        <section className="mb-6 mt-8 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
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
          <div className="mb-12 grid gap-6 lg:grid-cols-3">
            {/* Tasks */}
            <div className="space-y-6">
              <form
                onSubmit={addTask}
                className="space-y-3 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]"
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
            </div>

            {/* Journal */}
            <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl font-semibold">
                {t("journal.title")}
              </h2>
              <p className="mt-1 mb-4 text-sm text-foreground/60">
                What this patient has written (read-only).
              </p>

              {journalLoading ? (
                <p className="text-sm text-foreground/50">…</p>
              ) : journalEntries.length === 0 ? (
                <p className="text-sm text-foreground/50">{t("journal.empty")}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  <ul className="max-h-48 space-y-2 overflow-y-auto">
                    {journalEntries.map((entry) => {
                      const active = entry.id === activeJournalId;
                      const moods = ["😀", "😌", "😐", "😔", "😭"];
                      return (
                        <li key={entry.id}>
                          <button
                            type="button"
                            onClick={() => setActiveJournalId(entry.id)}
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                              active
                                ? "border-primary/50 bg-primary/10"
                                : "border-border/50 bg-background/50 hover:bg-background"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {moods[entry.mood - 1] ?? "😐"}
                              </span>
                              <span className="truncate text-sm font-medium">
                                {entry.title}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-foreground/50">
                              {entry.date}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                    {(() => {
                      const entry = journalEntries.find(
                        (e) => e.id === activeJournalId
                      );
                      if (!entry) return null;
                      const moods = ["😀", "😌", "😐", "😔", "😭"];
                      return (
                        <>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-2xl">
                              {moods[entry.mood - 1] ?? "😐"}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">
                                {entry.title}
                              </p>
                              <p className="text-xs text-foreground/50">
                                {entry.date}
                              </p>
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                            {entry.text || "—"}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </section>

            {/* Sessions */}
            <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl font-semibold">Sessions</h2>
              <p className="mt-1 mb-4 text-sm text-foreground/60">
                Appointments this patient has scheduled.
              </p>

              {sessionsLoading ? (
                <p className="text-sm text-foreground/50">…</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-foreground/50">
                  No sessions scheduled yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sessions.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {s.date} · {s.time}
                          </p>
                          <p className="mt-0.5 text-sm text-foreground/80">
                            {s.title}
                          </p>
                          {s.specialist && (
                            <p className="mt-0.5 text-xs text-foreground/50">
                              {s.specialist}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-foreground/40">
                        Booked {new Date(s.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {/* Resources CMS */}
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            Resources
          </h2>
          <p className="mt-1 mb-6 text-sm text-foreground/60">
            Edit the cards shown on the Resources page (EN + ES).
          </p>

          {resError && (
            <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {resError}
            </p>
          )}

          <form
            onSubmit={saveResource}
            className="mb-6 space-y-3 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <h3 className="font-display text-xl font-semibold">
              {editingResId ? "Edit resource" : "New resource"}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={resForm.titleEn}
                onChange={(e) =>
                  setResForm({ ...resForm, titleEn: e.target.value })
                }
                placeholder="Title (English)"
                className="rounded-xl"
                required
              />
              <Input
                value={resForm.titleEs}
                onChange={(e) =>
                  setResForm({ ...resForm, titleEs: e.target.value })
                }
                placeholder="Título (Español)"
                className="rounded-xl"
                required
              />
            </div>

            <Textarea
              value={resForm.bodyEn}
              onChange={(e) =>
                setResForm({ ...resForm, bodyEn: e.target.value })
              }
              placeholder="Body (English)"
              className="rounded-xl min-h-24"
              required
            />
            <Textarea
              value={resForm.bodyEs}
              onChange={(e) =>
                setResForm({ ...resForm, bodyEs: e.target.value })
              }
              placeholder="Cuerpo (Español)"
              className="rounded-xl min-h-24"
              required
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                type="number"
                min={1}
                max={60}
                value={resForm.minutes}
                onChange={(e) =>
                  setResForm({
                    ...resForm,
                    minutes: Number(e.target.value) || 5,
                  })
                }
                placeholder="Minutes"
                className="rounded-xl"
              />
              <select
                value={resForm.bgColor}
                onChange={(e) =>
                  setResForm({ ...resForm, bgColor: e.target.value })
                }
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="var(--note-1)">Soft blue</option>
                <option value="var(--note-2)">Peach</option>
                <option value="var(--note-3)">Sky</option>
                <option value="var(--note-4)">Lavender</option>
              </select>
              <Input
                type="number"
                value={resForm.sortOrder}
                onChange={(e) =>
                  setResForm({
                    ...resForm,
                    sortOrder: Number(e.target.value) || 0,
                  })
                }
                placeholder="Sort order"
                className="rounded-xl"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={resForm.published}
                onChange={(e) =>
                  setResForm({ ...resForm, published: e.target.checked })
                }
              />
              Published
            </label>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={resSaving}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingResId ? t("admin.save") : "Add resource"}
              </Button>
              {editingResId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEditResource}
                >
                  {t("admin.cancel")}
                </Button>
              )}
            </div>
          </form>

          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            {resLoading ? (
              <p className="text-sm text-foreground/50">…</p>
            ) : resources.length === 0 ? (
              <p className="text-sm text-foreground/50">
                No resources yet. Add the first one above.
              </p>
            ) : (
              <ul className="space-y-3">
                {resources.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {r.titleEn}
                          {!r.published && (
                            <span className="ml-2 text-xs text-foreground/40">
                              (draft)
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-foreground/60">
                          {r.titleEs} · {r.minutes} min · order {r.sortOrder}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditResource(r)}
                        >
                          {t("admin.edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeResource(r.id)}
                          className="text-foreground/50 hover:text-destructive"
                        >
                          {t("admin.delete")}
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
        <section className="mt-12">
            <ServicesEditor />
            </section>

            <section className="mt-12">
            <MerchEditor />
          </section>
        <section className="mt-12">
          <MerchEditor />
        </section>
      </main>
    </div>
  );
}