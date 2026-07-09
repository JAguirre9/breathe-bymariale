import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const MOODS = ["😭", "😔", "😐", "🙂", "😊"];

type DailyMood = {
  date: string;
  moods: string[];
};

export function FeelingCalendar({
  selectedDate,
  onDateSelect,
  userId,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  userId: string | null;
}) {
  const [moodsData, setMoodsData] = useState<DailyMood[]>([]);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const saved = localStorage.getItem(`breathe.moods.${userId}`);
    if (saved) setMoodsData(JSON.parse(saved));
  }, [userId]);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    localStorage.setItem(`breathe.moods.${userId}`, JSON.stringify(moodsData));
  }, [moodsData, userId]);

  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const currentDayMoods = moodsData.find((d) => d.date === selectedKey)?.moods || [];

  const addMood = (emoji: string) => {
    if (currentDayMoods.length >= 4) return;

    setMoodsData((prev) => {
      const existingIndex = prev.findIndex((d) => d.date === selectedKey);
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (!updated[existingIndex].moods.includes(emoji)) {
          updated[existingIndex].moods = [...updated[existingIndex].moods, emoji];
        }
        return updated;
      } else {
        return [...prev, { date: selectedKey, moods: [emoji] }];
      }
    });
  };

  const removeMood = (emoji: string) => {
    setMoodsData((prev) =>
      prev
        .map((day) =>
          day.date === selectedKey
            ? { ...day, moods: day.moods.filter((m) => m !== emoji) }
            : day
        )
        .filter((day) => day.moods.length > 0)
    );
  };

  const daysWithMoods = moodsData.map((d) => new Date(d.date));

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(d) => d && onDateSelect(d)}
        modifiers={{ hasMood: daysWithMoods }}
        modifiersClassNames={{
          hasMood: "bg-primary/10 text-primary font-medium",
        }}
        className="mx-auto scale-[1.08]" // Slightly bigger calendar
      />

      {/* Mood Selector */}
      <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
        <p className="mb-3 text-sm font-medium text-center">
          How are you feeling? (max 4)
        </p>

        <div className="flex justify-center gap-4">
          {MOODS.map((emoji) => (
            <Button
              key={emoji}
              type="button"
              variant="outline"
              className={`text-4xl h-14 w-14 p-0 transition-all hover:scale-110 ${
                currentDayMoods.includes(emoji) ? "bg-primary/15 border-primary" : ""
              }`}
              onClick={() => addMood(emoji)}
              disabled={currentDayMoods.length >= 4 && !currentDayMoods.includes(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>

        {currentDayMoods.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {currentDayMoods.map((emoji, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-2xl"
              >
                {emoji}
                <button
                  onClick={() => removeMood(emoji)}
                  className="text-sm text-destructive hover:text-red-600 font-medium"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}