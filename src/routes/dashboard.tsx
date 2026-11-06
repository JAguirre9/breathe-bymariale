import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { JournalSection } from "@/components/dashboard/JournalSection";
import { SessionSpecialists } from "@/components/dashboard/SessionSpecialists";
import { ChangePassword } from "@/components/dashboard/ChangePassword";

const PROFESSIONALS = [
  { id: "mariale", name: "Mariale Marulanda", role: "Founder & Specialist" },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - Breathe" }] }),
  component: Dashboard,
});

type SessionEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  specialist?: string;
};

type SpecialistTask = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
};

function fmtKey(d: Date) {
  // Local date (avoids timezone shift from toISOString)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const { t, lang } = useT();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [tasks, setTasks] = useState<SpecialistTask[]>([]);

  const [evTime, setEvTime] = useState("09:00");
  const [selectedSpecialist, setSelectedSpecialist] = useState(
    PROFESSIONALS[0]?.name || ""
  );
  const [isAdding, setIsAdding] = useState(false);

  // Load user + sessions + tasks (runs once)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("breathe.user");
    if (!raw) {
      router.navigate({ to: "/login" });
      return;
    }

    const u = JSON.parse(raw);
    setUserId(String(u.id));
    setUserName(u.name || u.email || "");

    apiFetch("/sessions")
      .then((data) => {
        const list = (data.sessions || []).map((s: any) => ({
          id: s.id,
          date: s.date,
          time: s.time,
          title: s.title,
          specialist: s.specialist || undefined,
        }));
        setEvents(list);
      })
      .catch((err) => {
        console.error(err);
      });

    apiFetch("/tasks")
      .then((data) => {
        const list = (data.tasks || []).map((tk: any) => ({
          id: tk.id,
          title: tk.title,
          description: tk.description || undefined,
          done: tk.done,
          createdAt: tk.createdAt,
        }));
        setTasks(list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [router]);

  const selectedKey = fmtKey(date);

  const dayEvents = useMemo(
    () =>
      events
        .filter((e) => e.date === selectedKey)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [events, selectedKey]
  );

  const daysWithEvents = useMemo(
    () =>
      Array.from(new Set(events.map((e) => e.date))).map(
        (d) => new Date(d + "T12:00:00") // noon avoids timezone edge cases
      ),
    [events]
  );

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpecialist || isAdding) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedKey + "T12:00:00");

  if (selected < today) {
    alert(t("dash.error.pastDate"));
    return;
  }

  const alreadyHasSession = events.some((ev) => ev.date === selectedKey);
  if (alreadyHasSession) {
    alert(t("dash.error.onePerDay"));
    return;
  }

  const hasSessionToday = dayEvents.length > 0;

// ...

  <Button
    type="submit"
    disabled={isAdding || hasSessionToday}
    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
  >
    {isAdding
      ? "Agendando..."
      : hasSessionToday
        ? "Ya tienes una sesión este día"
        : t("dash.add")}
  </Button>

    setIsAdding(true);

    const tempId = crypto.randomUUID();
    const newEvent: SessionEvent = {
      id: tempId,
      date: selectedKey,
      time: evTime,
      title: `Session with ${selectedSpecialist}`,
      specialist: selectedSpecialist,
    };

    // Optimistic UI update (so the dot appears immediately)
    setEvents((prev) => [...prev, newEvent]);

    try {
      // Persist on the backend
      const data = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify({
          date: selectedKey,
          time: evTime,
          title: newEvent.title,
          specialist: selectedSpecialist,
        }),
      });

      // Swap the temporary id for the real one, so deleting works right away
      const savedId = data.session?.id;
      if (savedId) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === tempId ? { ...ev, id: savedId } : ev))
        );
      }
    } catch (err) {
      console.error("Could not save session", err);
      // Roll back, so the calendar never shows a session that wasn't saved
      setEvents((prev) => prev.filter((ev) => ev.id !== tempId));
    } finally {
      setIsAdding(false);
    }
  };

  const removeEvent = async (id: string) => {
  // Confirmación
  const confirmed = window.confirm(t("dash.session.confirmDelete"));
  if (!confirmed) return;

  // Optimistic UI
  const previous = events;
  setEvents((p) => p.filter((e) => e.id !== id));

  try {
    await apiFetch(`/sessions/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error(err);
    // Rollback si falla
    setEvents(previous);
    alert(t("dash.session.deleteError"));
  }
};

  const toggleTask = async (id: string) => {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;
    const nextDone = !current.done;

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: nextDone } : task))
    );

    try {
      await apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: nextDone }),
      });
    } catch (err) {
      console.error(err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, done: current.done } : task
        )
      );
    }
  };

  const dateLabel = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/60">{t("dash.welcome")}</p>
            <h1 className="font-display text-4xl font-semibold text-foreground">
              {userName || t("dash.title")}
            </h1>
          </div>
        </div>

        {/* Top row: Calendar + Sessions + Tasks */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* 1. Calendar */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-xl font-semibold">
              {t("dash.calendar")}
            </h2>

            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              classNames={{ today: "text-primary font-semibold" }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              modifiers={{
                hasEvent: daysWithEvents,
              }}
              modifiersClassNames={{
                hasEvent:
                  "relative text-primary font-semibold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
              }}
              className="mx-auto"
            />

            <p className="mt-4 text-center text-sm text-foreground/60">
              {dateLabel}
            </p>
          </section>

          {/* 2. Sessions + Schedule form */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-xl font-semibold">
              {t("dash.sessions")}
            </h2>

            <SessionSpecialists />

            {/* Schedule new session */}
            <form
              onSubmit={addEvent}
              className="mb-6 space-y-3 rounded-2xl border border-border/50 bg-background/40 p-4"
            >
              <p className="text-sm font-medium text-foreground">
                Agendar sesión
              </p>

              {/* Selected date from calendar */}
              <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm">
                <span className="text-foreground/60">Fecha seleccionada: </span>
                <span className="font-medium text-primary">{dateLabel}</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={selectedSpecialist}
                  onChange={(e) => setSelectedSpecialist(e.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PROFESSIONALS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <Input
                  type="time"
                  value={evTime}
                  onChange={(e) => setEvTime(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isAdding}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isAdding ? "Agendando..." : t("dash.add")}
              </Button>
            </form>

            {/* List of sessions for the selected day */}
            {dayEvents.length === 0 ? (
              <p className="text-sm text-foreground/50">
                {t("dash.sessions.empty")}
              </p>
            ) : (
              <ul className="space-y-2">
                {dayEvents.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {e.time}
                      </span>
                      <div>
                        <span className="text-foreground">{e.title}</span>
                        {e.specialist && (
                          <p className="text-xs text-foreground/60 mt-0.5">
                            {e.specialist}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvent(e.id)}
                      className="text-foreground/50 hover:text-destructive"
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 3. Tasks left by the Specialist */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-1 font-display text-xl font-semibold">
              {t("dash.tasks.title")}
            </h2>
            <p className="mb-4 text-sm text-foreground/60">
              {t("dash.tasks.subtitle")}
            </p>

            {tasks.length === 0 ? (
              <p className="text-sm text-foreground/50">
                {t("dash.tasks.empty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`rounded-2xl border px-4 py-3 transition ${
                      task.done
                        ? "border-border/30 bg-background/30 opacity-60"
                        : "border-border/50 bg-background/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                          task.done
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {task.done && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>

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
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Journal (full width) */}
        <JournalSection
          userId={userId}
          userName={userName}
          selectedDate={date}
        />
                <div className="mt-6">
          <ChangePassword />
        </div>
      </main>
    </div>
  );
}