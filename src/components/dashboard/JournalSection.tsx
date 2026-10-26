import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { apiFetch } from "@/lib/api";

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

export function JournalSection({
  userId,
  userName,
  selectedDate,
}: {
  userId: string | null;
  userName: string;
  selectedDate?: Date;
}) {
  const { t, lang } = useT();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(3);
  const [text, setText] = useState("");

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

  // Load journal from API
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch("/journal");
        if (cancelled) return;

        const list: JournalEntry[] = data.entries || [];
        setEntries(list);

        if (list.length > 0) {
          const sorted = [...list].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          );
          loadEntry(sorted[0]);
        } else {
          startNewEntry();
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries]
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!title.trim() && !text.trim()) return;

    setSaving(true);

    try {
      const payload = {
        date: fmtKey(selectedDate ?? new Date()),
        title: title.trim() || t("journal.untitled"),
        mood,
        text: text.trim(),
      };

      if (isDraft || !activeId) {
        const data = await apiFetch("/journal", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const entry = data.entry as JournalEntry;
        setEntries((prev) => [entry, ...prev]);
        loadEntry(entry);
      } else {
        const data = await apiFetch(`/journal/${activeId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        const entry = data.entry as JournalEntry;
        setEntries((prev) => prev.map((en) => (en.id === activeId ? entry : en)));
        setIsDraft(false);
        loadEntry(entry);
      }
    } catch (err) {
      console.error(err);
      alert("Could not save journal entry");
    } finally {
      setSaving(false);
    }
  }

  async function removeActive() {
    if (!activeId || !userId) return;

    try {
      await apiFetch(`/journal/${activeId}`, { method: "DELETE" });

      const remaining = entries.filter((en) => en.id !== activeId);
      setEntries(remaining);

      if (remaining.length > 0) {
        loadEntry(
          [...remaining].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
        );
      } else {
        startNewEntry();
      }
    } catch (err) {
      console.error(err);
      alert("Could not delete journal entry");
    }
  }

  if (!userId) {
    return (
      <div className="rounded-3xl bg-card p-6">
        {t("js.loadJournal")}
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-3">
      <h2 className="mb-1 font-display text-xl font-semibold">
        {userName
          ? lang === "es"
            ? `Diario de ${userName}`
            : `${userName}'s ${t("journal.title")}`
          : t("journal.title")}
      </h2>
      <p className="mb-5 text-sm text-foreground/60">{t("journal.subtitle")}</p>

      {loading ? (
        <p className="text-sm text-foreground/50">Loading...</p>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-[30%]">
            <button
              type="button"
              onClick={startNewEntry}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              <span className="text-lg leading-none">+</span>
              {t("journal.new")}
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
                          <span className="text-lg leading-none">
                            {JOURNAL_MOODS[entry.mood - 1]}
                          </span>
                          <span className="truncate text-sm font-medium text-foreground">
                            {entry.title}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-foreground/50">
                          {new Date(entry.createdAt).toLocaleDateString(
                            lang === "es" ? "es-ES" : "en-US",
                            { month: "short", day: "numeric" }
                          )}{" "}
                          •{" "}
                          {new Date(entry.createdAt).toLocaleTimeString(
                            lang === "es" ? "es-ES" : "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

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
                  disabled={saving}
                  className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? "..." : t("journal.save")}
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
      )}
    </section>
  );
}