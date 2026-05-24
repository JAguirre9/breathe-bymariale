import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

type Dict = Record<string, { en: string; es: string }>;

const dict: Dict = {
  // Nav
  "nav.services": { en: "Services", es: "Servicios" },
  "nav.resources": { en: "Resources", es: "Recursos" },
  "nav.start": { en: "Start your therapy", es: "Inicia tu terapia" },
  "nav.merch": { en: "Merch", es: "Tienda" },
  "nav.login": { en: "Log in", es: "Ingresar" },
  "nav.signup": { en: "Sign up", es: "Registrarse" },

  // Home
  "home.badge": { en: "Soft. Safe. Yours.", es: "Suave. Segura. Tuya." },
  "home.title1": { en: "Breathe in,", es: "Respira," },
  "home.title2": { en: "heal forward.", es: "sana hacia adelante." },
  "home.subtitle": {
    en: "Online therapy designed to feel like a quiet morning. Connect with caring specialists, at your rhythm, in a space that holds you gently.",
    es: "Terapia en línea diseñada para sentirse como una mañana tranquila. Conecta con especialistas que te cuidan, a tu ritmo, en un espacio que te abraza con suavidad.",
  },
  "home.cta.start": { en: "Start your therapy", es: "Inicia tu terapia" },
  "home.cta.explore": { en: "Explore services →", es: "Ver servicios →" },
  "home.stat.sessions": { en: "Sessions held", es: "Sesiones realizadas" },
  "home.stat.workshops": { en: "Workshops", es: "Talleres" },
  "home.stat.rating": { en: "Average rating", es: "Calificación promedio" },
  "home.session24": { en: "Session in 24h", es: "Sesión en 24h" },
  "home.session24.sub": { en: "Find a space today", es: "Encuentra un espacio hoy" },

  // Module cards
  "mod.services.copy": {
    en: "Individual, couples and group therapy with certified specialists.",
    es: "Terapia individual, de pareja y grupal con especialistas certificados.",
  },
  "mod.resources.copy": {
    en: "Gentle reads on anxiety, growth, sleep and the in-between.",
    es: "Lecturas suaves sobre ansiedad, crecimiento, sueño y todo lo intermedio.",
  },
  "mod.start.copy": {
    en: "Take a 2-minute matching quiz and meet your specialist.",
    es: "Realiza un cuestionario de 2 minutos y conoce a tu especialista.",
  },
  "mod.merch.copy": {
    en: "Soft apparel and objects to carry the calm with you.",
    es: "Ropa y objetos suaves para llevar la calma contigo.",
  },
  "mod.discover": { en: "Discover →", es: "Descubrir →" },

  // Services page
  "svc.title1": { en: "Care,", es: "Cuidado," },
  "svc.title2": { en: "your way.", es: "a tu manera." },
  "svc.subtitle": { en: "Choose a path that meets you where you are.", es: "Elige un camino que te encuentre donde estás." },
  "svc.individual": { en: "Individual therapy", es: "Terapia individual" },
  "svc.individual.copy": { en: "One-on-one sessions in a confidential space.", es: "Sesiones uno a uno en un espacio confidencial." },
  "svc.couples": { en: "Couples therapy", es: "Terapia de pareja" },
  "svc.couples.copy": { en: "Reconnect, communicate, and grow together.", es: "Reconéctense, comuníquense y crezcan juntos." },
  "svc.group": { en: "Group sessions", es: "Sesiones grupales" },
  "svc.group.copy": { en: "Heal in community with curated small groups.", es: "Sana en comunidad con pequeños grupos curados." },
  "svc.mindful": { en: "Mindfulness coaching", es: "Coaching de mindfulness" },
  "svc.mindful.copy": { en: "Breathwork and mindfulness for daily calm.", es: "Respiración y mindfulness para la calma diaria." },

  // Resources
  "res.title1": { en: "Quiet", es: "Lecturas" },
  "res.title2": { en: "reads.", es: "tranquilas." },
  "res.post1": { en: "A small guide to slowing down", es: "Una pequeña guía para ir más despacio" },
  "res.post2": { en: "When anxiety knocks softly", es: "Cuando la ansiedad llama suavemente" },
  "res.post3": { en: "The art of choosing rest", es: "El arte de elegir el descanso" },
  "res.post4": { en: "Sleep, breath and morning light", es: "Sueño, respiración y luz de la mañana" },
  "res.read": { en: "min read", es: "min de lectura" },

  // Start
  "start.title1": { en: "Begin,", es: "Empieza," },
  "start.title2": { en: "gently.", es: "con suavidad." },
  "start.subtitle": {
    en: "Answer a few soft questions and we'll match you with a specialist who fits your rhythm.",
    es: "Responde unas preguntas suaves y te conectaremos con un especialista que se ajuste a tu ritmo.",
  },
  "start.cta": { en: "Take the 2-minute quiz", es: "Realiza el cuestionario de 2 minutos" },

  // Merch
  "merch.title1": { en: "Carry the", es: "Lleva la" },
  "merch.title2": { en: "calm.", es: "calma." },
  "merch.subtitle": {
    en: "Soft, considered objects designed to bring Breathe into your everyday.",
    es: "Objetos suaves y pensados para traer Breathe a tu día a día.",
  },
  "merch.item1": { en: "Cloud cotton tee", es: "Camiseta nube de algodón" },
  "merch.item2": { en: "Linen tote", es: "Bolso de lino" },
  "merch.item3": { en: "Ceramic breath mug", es: "Taza cerámica respirar" },
  "merch.item4": { en: "Lavender candle", es: "Vela de lavanda" },
  "merch.soon": { en: "Coming soon", es: "Próximamente" },

  // Auth
  "auth.welcome": { en: "Welcome back", es: "Bienvenido de nuevo" },
  "auth.welcome.sub": { en: "Take a breath. We're glad you're here.", es: "Respira. Nos alegra que estés aquí." },
  "auth.create": { en: "Create your space", es: "Crea tu espacio" },
  "auth.create.sub": { en: "A soft place to begin.", es: "Un lugar suave para empezar." },
  "auth.name": { en: "Name", es: "Nombre" },
  "auth.email": { en: "Email", es: "Correo" },
  "auth.password": { en: "Password", es: "Contraseña" },
  "auth.login": { en: "Log in", es: "Ingresar" },
  "auth.signup": { en: "Sign up", es: "Registrarse" },
  "auth.new": { en: "New here?", es: "¿Eres nuevo aquí?" },
  "auth.create.link": { en: "Create an account", es: "Crear una cuenta" },
  "auth.have": { en: "Already with us?", es: "¿Ya tienes cuenta?" },

  //Errors in Signup 

  "auth.error.emailExists":{en : "This email is already registered.", es : "El correo electrónico ya está registrado."},
  "auth.error.invalidCredentials":{en : "Invalid email or password.", es : "Correo o contraseña incorrectos."},
  "auth.error.generic": {en : "A server error occurred. Please try again.", es : "Hubo un error en el servidor. Inténtalo de nuevo."},
  "auth.signup.success": {en : "Account registered successfully!", es : "¡Cuenta registrada con éxito!"},
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof dict) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("breathe.lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("breathe.lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}
