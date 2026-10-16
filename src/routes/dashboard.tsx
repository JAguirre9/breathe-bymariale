import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { JournalSection } from "@/components/dashboard/JournalSection";
import { SessionSpecialists } from "@/components/dashboard/SessionSpecialists";

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
type Note = { 
  id: string; 
  date: string; 
  createdAt: string; 
  mood: number; 
  text: string };

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

  const [selectedSpecialist, setSelectedSpecialist] = useState(PROFESSIONALS[0]?.name || "");

  // Guard + load
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
    
    const evRaw = localStorage.getItem(`breathe.events.${u.id}`);
    const ntRaw = localStorage.getItem(`breathe.notes.${u.id}`);
    if (evRaw) setEvents(JSON.parse(evRaw));
    if (ntRaw) setNotes(JSON.parse(ntRaw));
  }, [router]);

  useEffect(() => {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem(`breathe.events.${userId}`, JSON.stringify(events));
}, [events, userId]);

useEffect(() => {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem(`breathe.notes.${userId}`, JSON.stringify(notes));
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
  if (!selectedSpecialist) return;

  setEvents((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      date: selectedKey,
      time: evTime,
      title: `Session with ${selectedSpecialist}`,
      specialist: selectedSpecialist,
    },
  ]);
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
                  modifiers={{
                    hasEvent: daysWithEvents,
                  }}
                  modifiersClassNames={{
                    hasEvent: "relative bg-primary/10 text-primary font-semibold rounded-md after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
                  }}
                  className="mx-auto"
                />

                <p className="mt-4 text-center text-sm text-foreground/60">{dateLabel}</p>
              </section>

          {/* Sessions */}
          <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <h2 className="mb-4 font-display text-xl font-semibold">{t("dash.sessions")}</h2>

            <SessionSpecialists />

            {/* Add New Session Form */}
            <form onSubmit={addEvent} className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
              
              {/* Specialist Dropdown */}
              <select
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="rounded-xl sm:w-32"
              />

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
                      <div>
                        <span className="text-foreground">{e.title}</span>
                        {e.specialist && (
                          <p className="text-xs text-foreground/60 mt-0.5">{e.specialist}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeEvent(e.id)} className="text-foreground/50 hover:text-destructive">×</Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes / Mood */}
            <JournalSection
              userId={userId}
              userName={userName}
              selectedDate={date}
            />
        </div>
      </main>
    </div>
  );
}