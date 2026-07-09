import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

export type JournalEntry = {
  id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  mood: number;
  text: string;
};

const JOURNAL_MOODS = ["😀", "😌", "😐", "😔", "😭"];

function fmtKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isSameDay(a: Date, b: Date) {
  return fmtKey(a) === fmtKey(b);
}

function relativeLabel(entry: JournalEntry, lang: string) {
  const created = new Date(entry.createdAt);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(created, now)) {
    return created.toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (isSameDay(created, yesterday)) {
    return lang === "es" ? "Ayer" : "Yesterday";
  }
  return created.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    month: "long",
    day: "numeric",
  });
}

export function JournalSection({
  userId,
  selectedDate,
}: {
  userId: string | null;
  selectedDate?: Date;
}) {
  const { t, lang } = useT();

if (!userId) {
  return <div className="rounded-3xl bg-card p-6">Loading journal...</div>;
}

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(3);
  const [text, setText] = useState("");



  // Load
  useEffect(() => {
    const raw = localStorage.getItem(`breathe.journal.${userId}`);
    if (raw) {
      const parsed: JournalEntry[] = JSON.parse(raw);
      setEntries(parsed);
      if (parsed.length > 0) {
        const sorted = [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        loadEntry(sorted[0]);
      }
    }
  }, [userId]);

  // Persist
  useEffect(() => {
    localStorage.setItem(`breathe.journal.${userId}`, JSON.stringify(entries));
  }, [entries, userId]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries]
  );

  function loadEntry(entry: JournalEntry) {
    setActiveId(entry.id);
    setIsDraft(false);
    setTitle(entry.title);
    setMood(entry.mood);
    setText(entry.text);
  }

  function startNewEntry() {
    setActiveId(null);
    setIsDraft(true);
    setTitle("");
    setMood(3);
    setText("");
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !text.trim()) return;
    const now = new Date().toISOString();

    if (isDraft || !activeId) {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        date: fmtKey(selectedDate ?? new Date()),
        createdAt: now,
        updatedAt: now,
        title: title.trim() || t("journal.untitled"),
        mood,
        text: text.trim(),
      };
      setEntries((prev) => [entry, ...prev]);
      loadEntry(entry);
    } else {
      setEntries((prev) =>
        prev.map((en) =>
          en.id === activeId
            ? { ...en, title: title.trim() || t("journal.untitled"), mood, text: text.trim(), updatedAt: now }
            : en
        )
      );
      setIsDraft(false);
    }
  }

  function removeActive() {
    if (!activeId) return;
    const remaining = entries.filter((en) => en.id !== activeId);
    setEntries(remaining);
    if (remaining.length > 0) {
      loadEntry([...remaining].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]);
    } else {
      startNewEntry();
    }
  }

  return (
    <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-3">
      <h2 className="mb-1 font-display text-xl font-semibold">{t("journal.title")}</h2>
      <p className="mb-5 text-sm text-foreground/60">{t("journal.subtitle")}</p>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column — index */}
        <div className="lg:w-[30%]">
          <button
            type="button"
            onClick={startNewEntry}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            <span className="text-lg leading-none">+</span>
            {t("Add a note to your Journal")}
          </button>

          {sortedEntries.length === 0 ? (
            <p className="px-1 text-sm text-foreground/50">{t("journal.empty")}</p>
          ) : (
            <ul className="space-y-2">
              {sortedEntries.map((entry) => {
                const active = entry.id === activeId && !isDraft;
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => loadEntry(entry)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-primary/50 bg-primary/10"
                          : "border-border/50 bg-background/50 hover:bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{JOURNAL_MOODS[entry.mood - 1]}</span>
                        <span className="truncate text-sm font-medium text-foreground">{entry.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-foreground/50">{relativeLabel(entry, lang)}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right column — editor */}
        <div className="lg:w-[70%]">
          <form onSubmit={save} className="space-y-5">
            <div>
              <Label htmlFor="journal-title" className="text-sm">
                {t("journal.field.title")}
              </Label>
              <Input
                id="journal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("journal.field.title.placeholder")}
                className="mt-1.5 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm">{t("journal.field.mood")}</Label>
              <div className="mt-2 flex gap-2">
                {JOURNAL_MOODS.map((m, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setMood(i + 1)}
                    aria-label={`mood-${i + 1}`}
                    className={`h-12 w-12 rounded-full text-2xl transition ${
                      mood === i + 1
                        ? "scale-110 bg-primary/20 ring-2 ring-primary"
                        : "bg-background/60 hover:bg-background"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="journal-text" className="text-sm">
                {t("journal.field.body")}
              </Label>
              <Textarea
                id="journal-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("journal.field.body.placeholder")}
                className="mt-1.5 min-h-56 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                {t("journal.save")}
              </Button>
              {activeId && !isDraft && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={removeActive}
                  className="text-foreground/50 hover:text-destructive"
                >
                  {t("journal.delete")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}