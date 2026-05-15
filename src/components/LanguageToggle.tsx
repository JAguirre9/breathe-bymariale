import { useT } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useT();
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full text-base transition-all";
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/60 p-1 shadow-[var(--shadow-soft)] backdrop-blur">
      <button
        type="button"
        aria-label="English"
        title="English"
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? "bg-primary/30 ring-1 ring-primary/40" : "opacity-60 hover:opacity-100"}`}
      >
        <span aria-hidden>🇺🇸</span>
      </button>
      <button
        type="button"
        aria-label="Español"
        title="Español"
        onClick={() => setLang("es")}
        className={`${base} ${lang === "es" ? "bg-primary/30 ring-1 ring-primary/40" : "opacity-60 hover:opacity-100"}`}
      >
        <span aria-hidden>🇨🇴</span>
      </button>
    </div>
  );
}
