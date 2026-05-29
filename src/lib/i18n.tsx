import { createContext, useContext, type ReactNode } from "react";

const dict = {
  // Nav
  "nav.services": "Services",
  "nav.resources": "Resources",
  "nav.start": "Start your therapy",
  "nav.merch": "Merch",
  "nav.login": "Log in",
  "nav.signup": "Sign up",

  // Home
  "home.badge": "Soft. Safe. Yours.",
  "home.title1": "Breathe in,",
  "home.title2": "heal forward.",
  "home.subtitle":
    "Online therapy designed to feel like a quiet morning. Connect with caring specialists, at your rhythm, in a space that holds you gently.",
  "home.cta.start": "Start your therapy",
  "home.cta.explore": "Explore services →",
  "home.stat.sessions": "Sessions held",
  "home.stat.workshops": "Workshops",
  "home.stat.rating": "Average rating",
  "home.session24": "Session in 24h",
  "home.session24.sub": "Find a space today",

  // Module cards
  "mod.services.copy": "Individual, couples and group therapy with certified specialists.",
  "mod.resources.copy": "Gentle reads on anxiety, growth, sleep and the in-between.",
  "mod.start.copy": "Take a 2-minute matching quiz and meet your specialist.",
  "mod.merch.copy": "Soft apparel and objects to carry the calm with you.",
  "mod.discover": "Discover →",

  // Services
  "svc.title1": "Care,",
  "svc.title2": "your way.",
  "svc.subtitle": "Choose a path that meets you where you are.",
  "svc.individual": "Individual therapy",
  "svc.individual.copy": "One-on-one sessions in a confidential space.",
  "svc.couples": "Couples therapy",
  "svc.couples.copy": "Reconnect, communicate, and grow together.",
  "svc.group": "Group sessions",
  "svc.group.copy": "Heal in community with curated small groups.",
  "svc.mindful": "Mindfulness coaching",
  "svc.mindful.copy": "Breathwork and mindfulness for daily calm.",

  // Resources
  "res.title1": "Quiet",
  "res.title2": "reads.",
  "res.post1": "A small guide to slowing down",
  "res.post2": "When anxiety knocks softly",
  "res.post3": "The art of choosing rest",
  "res.post4": "Sleep, breath and morning light",
  "res.read": "min read",

  // Start
  "start.title1": "Begin,",
  "start.title2": "gently.",
  "start.subtitle":
    "Answer a few soft questions and we'll match you with a specialist who fits your rhythm.",
  "start.cta": "Take the 2-minute quiz",

  // Merch
  "merch.title1": "Carry the",
  "merch.title2": "calm.",
  "merch.subtitle": "Soft, considered objects designed to bring Breathe into your everyday.",
  "merch.item1": "Cloud cotton tee",
  "merch.item2": "Linen tote",
  "merch.item3": "Ceramic breath mug",
  "merch.item4": "Lavender candle",
  "merch.soon": "Coming soon",

  // Auth
  "auth.welcome": "Welcome back",
  "auth.welcome.sub": "Take a breath. We're glad you're here.",
  "auth.create": "Create your space",
  "auth.create.sub": "A soft place to begin.",
  "auth.name": "Name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.login": "Log in",
  "auth.signup": "Sign up",
  "auth.new": "New here?",
  "auth.create.link": "Create an account",
  "auth.have": "Already with us?",

  "auth.error.emailExists": "This email is already registered.",
  "auth.error.invalidCredentials": "Invalid email or password.",
  "auth.error.generic": "A server error occurred. Please try again.",
  "auth.signup.success": "Account registered successfully!",
  "auth.login.success": "Welcome back!",

  // Intake form
  "reg.form.begin": "Before we begin",
  "reg.form.questions": "A few questions so Mariale can hold space for you.",
  "reg.form.called": "How'd you like to be called?",
  "reg.form.phNum": "Phone Number",
  "reg.form.age": "Age",
  "reg.form.feelings": "How do you feel lately - feel free to tell me anything",
  "reg.form.priorSess": "Have you ever had sessions before?",
  "reg.form.contact": "How'd you like to be contacted?",
  "reg.form.thanks": "This is a big step, thanks for trusting me, see you soon 💜",
  "reg.form.submit": "Submit Form",
  "reg.form.alreadyAccount": "Already have an account?",

  // Dashboard
  "dash.welcome": "Welcome back,",
  "dash.title": "Your space",
  "dash.logout": "Log out",
  "dash.calendar": "Calendar",
  "dash.sessions": "Sessions",
  "dash.sessions.placeholder": "Session with…",
  "dash.sessions.empty": "No sessions scheduled for this day.",
  "dash.add": "Add",
  "dash.notes": "Session notes & mood",
  "dash.notes.sub": "Notate how you feel during or after a session.",
  "dash.mood": "How are you feeling?",
  "dash.note.label": "Notes",
  "dash.note.placeholder": "What came up today? Insights, feelings, breakthroughs…",
  "dash.save": "Save entry",
  "dash.notes.empty": "No notes yet for this day.",
} as const;

export type TKey = keyof typeof dict;

type Ctx = { t: (key: TKey) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: TKey) => dict[key] ?? String(key);
  return <LanguageContext.Provider value={{ t }}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}
