export type ServicePrice = {
  id: string;
  titleKey: "svc.individual" | "svc.couples" | "svc.group" | "svc.mindful";
  copyKey: "svc.individual.copy" | "svc.couples.copy" | "svc.group.copy" | "svc.mindful.copy";
  price: number;          // COP
  duration?: string;      // e.g. "60 min"
  bg: string;
};

export const servicePrices: ServicePrice[] = [
  {
    id: "individual",
    titleKey: "svc.individual",
    copyKey: "svc.individual.copy",
    price: 120000,
    duration: "60 min",
    bg: "var(--note-4)",
  },
  {
    id: "couples",
    titleKey: "svc.couples",
    copyKey: "svc.couples.copy",
    price: 180000,
    duration: "90 min",
    bg: "var(--note-2)",
  },
  {
    id: "group",
    titleKey: "svc.group",
    copyKey: "svc.group.copy",
    price: 80000,
    duration: "90 min",
    bg: "var(--note-3)",
  },
  {
    id: "mindful",
    titleKey: "svc.mindful",
    copyKey: "svc.mindful.copy",
    price: 90000,
    duration: "45 min",
    bg: "var(--note-1)",
  },
];