export { PROFESSIONALS };

const PROFESSIONALS = [
  { id: "mariale", name: "Mariale Marulanda", role: "Founder & Specialist" },
  // Add more specialists here in the future
];

export function SessionSpecialists() {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs uppercase tracking-wide text-foreground/50">
        Specialists
      </p>
      
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {PROFESSIONALS.map((p) => (
          <div
            key={p.id}
            className="flex-shrink-0 w-56 rounded-2xl border border-border/50 bg-background/50 px-5 py-5 snap-start hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
                {p.name
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {p.name}
                </p>
                <p className="text-xs text-foreground/60 truncate">
                  {p.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}