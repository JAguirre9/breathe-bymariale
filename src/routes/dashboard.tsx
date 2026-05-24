import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

const PROFESSIONALS = [
  { id: "mariale", name: "Mariale Marulanda", role: "Founder & Specialist" },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - Breathe" }] }),
  component: Dashboard,
});

type SessionEvent = { id: string; date: string; time: string; title: string };
type Note = { id: string; date: string; createdAt: string; mood: number; text: string };

const MOODS = ["😞", "😕", "😐", "🙂", "😊"];

function fmtKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Dashboard() {
  const { t, lang } = useT();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [evTitle, setEvTitle] = useState("");
  const [evTime, setEvTime] = useState("09:00");
  const [mood, setMood] = useState(3);
  const [noteText, setNoteText] = useState("");

  // Guard + load
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("breathe.user") : null;
    if (!raw) {
      router.navigate({ to: "/login" });
      return;
    }
    const u = JSON.parse(raw);
    setUserId(String(u.id));
    setUserName(u.name || u.email || "");
    
    const evRaw = localStorage.getItem(`breathe.events.${u.id}`);
    const ntRaw = localStorage.getItem(`breathe.notes.${u.id}`);
    if (evRaw) setEvents(JSON.parse(evRaw));
    if (ntRaw) setNotes(JSON.parse(ntRaw));
  }, [router]);

  useEffect(() => {
    if (userId) localStorage.setItem(`breathe.events.${userId}`, JSON.stringify(events));
  }, [events, userId]);

  useEffect(() => {
    if (userId) localStorage.setItem(`breathe.notes.${userId}`, JSON.stringify(notes));
  }, [notes, userId]);

  const selectedKey = fmtKey(date);
  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedKey).sort((a, b) => a.time.localeCompare(b.time)),
    [events, selectedKey],
  );
  const dayNotes = useMemo(
    () => notes.filter((n) => n.date === selectedKey).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notes, selectedKey],
  );
  const daysWithEvents = useMemo(
    () => Array.from(new Set(events.map((e) => e.date))).map((d) => new Date(d + "T00:00:00")),
    [events],
  );

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim()) return;
    setEvents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: selectedKey, time: evTime, title: evTitle.trim() },
    ]);
    setEvTitle("");
  };

  const removeEvent = (id: string) => setEvents((p) => p.filter((e) => e.id !== id));

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: selectedKey, createdAt: new Date().toISOString(), mood, text: noteText.trim() },
    ]);
    setNoteText("");
    setMood(3);
  };

  const removeNote = (id: string) => setNotes((p) => p.filter((n) => n.id !== id));

  const logout = () => {
    localStorage.removeItem("breathe.user");
    router.navigate({ to: "/" });
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
          <Button variant="ghost" onClick={logout} className="rounded-full">
            {t("dash.logout")}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-1">
            <h2 className="mb-4 font-display text-xl font-semibold">{t("dash.calendar")}</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              modifiers={{ hasEvent: daysWithEvents }}
              modifiersClassNames={{ hasEvent: "bg-primary/15 text-primary font-semibold rounded-md" }}
              className="mx-auto"
            />
            <p className="mt-4 text-center text-sm text-foreground/60">{dateLabel}</p>
          </section>

          {/* Sessions */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <h2 className="mb-4 font-display text-xl font-semibold">{t("dash.sessions")}</h2>

            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-wide text-foreground/50">Specialists</p>
              <ul className="space-y-2">
                {PROFESSIONALS.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-foreground/60">{p.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={addEvent} className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <Input placeholder={t("dash.sessions.placeholder")} value={evTitle} onChange={(e) => setEvTitle(e.target.value)} className="rounded-xl" />
              <Input type="time" value={evTime} onChange={(e) => setEvTime(e.target.value)} className="rounded-xl sm:w-32" />
              <Button type="submit" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                {t("dash.add")}
              </Button>
            </form>

            {dayEvents.length === 0 ? (
              <p className="text-sm text-foreground/50">{t("dash.sessions.empty")}</p>
            ) : (
              <ul className="space-y-2">
                {dayEvents.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-semibold text-primary">{e.time}</span>
                      <span className="text-foreground">{e.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeEvent(e.id)} className="text-foreground/50 hover:text-destructive">×</Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes / Mood */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-3">
            <h2 className="mb-1 font-display text-xl font-semibold">{t("dash.notes")}</h2>
            <p className="mb-5 text-sm text-foreground/60">{t("dash.notes.sub")}</p>

            <form onSubmit={addNote} className="mb-6 space-y-3">
              <div>
                <Label className="text-sm">{t("dash.mood")}</Label>
                <div className="mt-2 flex gap-2">
                  {MOODS.map((m, i) => (
                    <button type="button" key={i} onClick={() => setMood(i + 1)} className={`h-12 w-12 rounded-full text-2xl transition ${mood === i + 1 ? "scale-110 bg-primary/20 ring-2 ring-primary" : "bg-background/60 hover:bg-background"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="note" className="text-sm">{t("dash.note.label")}</Label>
                <Textarea id="note" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder={t("dash.note.placeholder")} className="mt-1.5 min-h-28 rounded-xl" />
              </div>
              <Button type="submit" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">{t("dash.save")}</Button>
            </form>

            {dayNotes.length === 0 ? (
              <p className="text-sm text-foreground/50">{t("dash.notes.empty")}</p>
            ) : (
              <ul className="space-y-3">
                {dayNotes.map((n) => (
                  <li key={n.id} className="rounded-2xl border border-border/50 bg-background/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{MOODS[n.mood - 1]}</span>
                        <span className="text-xs text-foreground/50">{new Date(n.createdAt).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeNote(n.id)} className="text-foreground/50 hover:text-destructive">×</Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-foreground/80">{n.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}