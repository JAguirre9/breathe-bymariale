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

  "merch.empty": { en: "New pieces are coming soon.", es: "Pronto habrá nuevas piezas." },
  "merch.error": { en: "We couldn't load the merch right now.", es: "No pudimos cargar la tienda en este momento." },
  "merch.close": { en: "Close", es: "Cerrar" },

  // Dashboard - Scheduling validations
"dash.schedule.title": { en: "Schedule session", es: "Agendar sesión" },
"dash.schedule.selectedDate": { en: "Selected date:", es: "Fecha seleccionada:" },
"dash.schedule.adding": { en: "Scheduling...", es: "Agendando..." },
"dash.schedule.alreadyBooked": { en: "You already have a session this day", es: "Ya tienes una sesión este día" },
"dash.error.pastDate": {
  en: "You cannot schedule a session in the past",
  es: "No puedes agendar una sesión en el pasado",
},
"dash.error.onePerDay": {
  en: "You already have a session scheduled for this day. Only one per day is allowed.",
  es: "Ya tienes una sesión agendada para este día. Solo se permite una por día.",
},

  // Admin: merch editor
  "admin.merch.title": { en: "Merch", es: "Tienda" },
  "admin.merch.nameEn": { en: "Name (English)", es: "Nombre (inglés)" },
  "admin.merch.nameEs": { en: "Name (Spanish)", es: "Nombre (español)" },
  "admin.merch.captionEn": { en: "Short text (English)", es: "Texto corto (inglés)" },
  "admin.merch.captionEs": { en: "Short text (Spanish)", es: "Texto corto (español)" },
  "admin.merch.imageUrl": { en: "Image link", es: "Enlace de la imagen" },
  "admin.merch.imageHint": { en: "Paste a link that starts with https://", es: "Pega un enlace que empiece con https://" },
  "admin.merch.sortOrder": { en: "Order", es: "Orden" },
  "admin.merch.published": { en: "Visible on the site", es: "Visible en el sitio" },
  "admin.merch.add": { en: "Add item", es: "Añadir artículo" },
  "admin.merch.save": { en: "Save changes", es: "Guardar cambios" },
  "admin.merch.cancel": { en: "Cancel", es: "Cancelar" },
  "admin.merch.edit": { en: "Edit", es: "Editar" },
  "admin.merch.delete": { en: "Delete", es: "Eliminar" },
  "admin.merch.hide": { en: "Hide", es: "Ocultar" },
  "admin.merch.show": { en: "Show", es: "Mostrar" },
  "admin.merch.hidden": { en: "Hidden", es: "Oculto" },
  "admin.merch.empty": { en: "No merch items yet.", es: "Aún no hay artículos." },
  "admin.merch.confirmDelete": { en: "Delete this item?", es: "¿Eliminar este artículo?" },
  "admin.merch.error": { en: "Something went wrong. Please try again.", es: "Algo salió mal. Inténtalo de nuevo." },

  // Services
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
  
    // Resources – card bodies
  "res.post1.body": {
    en: "Slowing down is not laziness. It is a quiet act of care. Start with one breath, one pause, one moment without rushing.",
    es: "Ir más despacio no es pereza. Es un acto silencioso de cuidado. Empieza con una respiración, una pausa, un momento sin prisa.",
  },
  "res.post2.body": {
    en: "Anxiety often arrives as a soft knock. Notice it, name it, and give it space instead of fighting it. You are safe here.",
    es: "La ansiedad a menudo llega como un golpecito suave. Nómbrala, dale espacio en lugar de pelear con ella. Aquí estás a salvo.",
  },
  "res.post3.body": {
    en: "Rest is not something you earn. It is something your nervous system needs. Choosing rest is choosing yourself.",
    es: "El descanso no es algo que debas ganar. Es algo que tu sistema nervioso necesita. Elegir descansar es elegirte a ti.",
  },
  "res.post4.body": {
    en: "Morning light, a few slow breaths, and a soft intention. Small rituals can gently reshape how the day begins.",
    es: "Luz de la mañana, unas respiraciones lentas y una intención suave. Los pequeños rituales pueden transformar cómo empieza el día.",
  },
  "res.clickToRead": {
    en: "Click to read →",
    es: "Haz clic para leer →",
  },
  "res.clickToClose": {
    en: "← Click to close",
    es: "← Haz clic para cerrar",
  },

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
  "merch.title2": { en: "calm home.", es: "calma a casa." },
  "merch.subtitle": {en: "Soft, considered objects designed to bring Breathe into your everyday.",es: "Objetos suaves y pensados para traer Breathe a tu día a día.",},
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

  // Signup / login errors & success
  "auth.error.emailExists": { en: "This email is already registered.", es: "El correo electrónico ya está registrado." },
  "auth.error.invalidCredentials": { en: "Invalid email or password.", es: "Correo o contraseña incorrectos." },
  "auth.error.generic": { en: "A server error occurred. Please try again.", es: "Hubo un error en el servidor. Inténtalo de nuevo." },
  "auth.signup.success": { en: "Account registered successfully!", es: "¡Cuenta registrada con éxito!" },
  "auth.login.success": { en: "Welcome back!", es: "¡Bienvenido de nuevo!" },


  // Intake form
  "reg.form.begin": { en: "Before we begin", es: "Antes de comenzar" },
  "reg.form.questions": {
    en: "A few questions so Mariale can hold space for you.",
    es: "Unas preguntas para que Mariale pueda agendar un espacio contigo.",
  },
  "reg.form.called": { en: "How'd you like to be called?", es: "¿Cómo te gustaría que te llamemos?" },
  "reg.form.phNum": { en: "Phone Number", es: "Número de teléfono" },
  "reg.form.age": { en: "Age", es: "Edad" },
  "reg.form.feelings": {
    en: "How do you feel lately - feel free to tell me anything",
    es: "¿Cómo te has sentido últimamente? Siéntete en confianza de contarme lo que quieras",
  },
  "reg.form.priorSess": { en: "Have you ever had sessions before?", es: "¿Has asistido a alguna sesión antes?" },
  "reg.form.contact": { en: "How'd you like to be contacted?", es: "¿Cómo te gustaría ser contactado?" },
  "reg.form.thanks": {
    en: "This is a big step, thanks for trusting me, see you soon 💜",
    es: "Este es un gran paso, gracias por confiar en mí, nos vemos pronto 💜",
  },
  "reg.form.submit": { en: "Submit Form", es: "Enviar formulario" },
  "reg.form.alreadyAccount": { en: "Already have an account?", es: "¿Ya tienes una cuenta?" },

"intake.success.title": {
  en: "Thank you for reaching out",
  es: "Gracias por comunicarte con nosotros"
},

"intake.success.subtitle": {
  en: "We've received your information. Our team will contact you within the next 24 hours to schedule your first session. Thank you for making this first step 💜",
  es: "Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo dentro de las siguientes 24 horaspara programar tu primera sesión. Gracias por dar este primer paso 💜"
},

"intake.psychologist.success.title": {
  en: "Application received",
  es: "Solicitud recibida"
},

"intake.psychologist.success.subtitle": {
  en: "Thank you for your interest in joining Breathe. We'll review your credentials and contact you soon.",
  es: "Gracias por tu interés en formar parte de Breathe. Revisaremos tus credenciales y nos pondremos en contacto contigo pronto."
},

  // Signup V2
  "signup.title": {
    en: "Join Breathe",
    es: "Únete a Breathe",
  },
  "signup.subtitle": {
    en: "Choose how you'd like to begin your journey with us.",
    es: "Elige cómo te gustaría comenzar tu camino con nosotros.",
  },

  "signup.chooseRole": {
    en: "Who are you?",
    es: "¿Quién eres?",
  },

  "signup.patient": {
    en: "I'm looking for therapy",
    es: "Estoy buscando terapia",
  },

  "signup.patient.description": {
    en: "Complete a short intake form so Mariale can understand your needs before scheduling your first session.",
    es: "Completa un breve formulario para que Mariale pueda conocer tus necesidades antes de agendar tu primera sesión.",
  },

  "signup.psychologist": {
    en: "I'm a psychologist",
    es: "Soy psicólogo(a)",
  },

  "signup.psychologist.description": {
    en: "Apply to become part of the Breathe professional network.",
    es: "Postúlate para formar parte de la red de profesionales de Breathe.",
  },

  "signup.personalInfo": {
    en: "Personal Information",
    es: "Información personal",
  },

  "signup.professionalInfo": {
    en: "Professional Information",
    es: "Información profesional",
  },

  "signup.firstName": {
    en: "First Name",
    es: "Nombre",
  },

  "signup.lastName": {
    en: "Last Name",
    es: "Apellido",
  },

  "signup.preferredName": {
    en: "Preferred Name",
    es: "Nombre preferido",
  },

  "signup.email": {
    en: "Email Address",
    es: "Correo electrónico",
  },

  "signup.phone": {
    en: "Phone Number",
    es: "Número de teléfono",
  },

  "signup.age": {
    en: "Age",
    es: "Edad",
  },

  "signup.feelings": {
    en: "Tell us how you've been feeling lately",
    es: "Cuéntanos cómo te has sentido últimamente",
  },

  "signup.previousTherapy": {
    en: "Have you attended therapy before?",
    es: "¿Has asistido anteriormente a terapia?",
  },

  "signup.contactMethod": {
    en: "Preferred Contact Method",
    es: "Método de contacto preferido",
  },

  "signup.whatsapp": {
    en: "WhatsApp",
    es: "WhatsApp",
  },

  "signup.emailOption": {
    en: "Email",
    es: "Correo electrónico",
  },

  "signup.phoneOption": {
    en: "Phone Call",
    es: "Llamada telefónica",
  },

  "signup.yes": {
    en: "Yes",
    es: "Sí",
  },

  "signup.no": {
    en: "No",
    es: "No",
  },

  "signup.professionalLicense": {
    en: "Professional License",
    es: "Tarjeta profesional",
  },

  "signup.licenseCountry": {
    en: "Country of License",
    es: "País donde fue emitida",
  },

  "signup.degree": {
    en: "Highest Degree",
    es: "Título académico",
  },

  "signup.yearsExperience": {
    en: "Years of Experience",
    es: "Años de experiencia",
  },

  "signup.specialties": {
    en: "Areas of Expertise",
    es: "Áreas de especialización",
  },

  "signup.languages": {
    en: "Languages",
    es: "Idiomas",
  },

  "signup.biography": {
    en: "Tell us about yourself",
    es: "Cuéntanos sobre ti",
  },

  "signup.submitPatient": {
    en: "Request my first session",
    es: "Solicitar mi primera sesión",
  },

  "signup.submitPsychologist": {
    en: "Submit Application",
    es: "Enviar solicitud",
  },

  "signup.back": {
    en: "Back",
    es: "Volver",
  },

  "signup.success.title": {
    en: "Thank you 💜",
    es: "Gracias 💜",
  },

  "signup.success.message.patient": {
    en: "We've received your information. Mariale will contact you shortly to schedule your first session.",
    es: "Hemos recibido tu información. Mariale se pondrá en contacto contigo muy pronto para agendar tu primera sesión.",
  },

  "signup.success.message.psychologist": {
    en: "Thank you for applying to Breathe. We'll review your information and contact you soon.",
    es: "Gracias por postularte a Breathe. Revisaremos tu información y nos pondremos en contacto contigo pronto.",
  },

  // Dashboard
  "dash.welcome": { en: "Welcome back,", es: "Bienvenido de nuevo," },
  "dash.title": { en: "Your space", es: "Tu espacio" },
  "dash.logout": { en: "Log out", es: "Cerrar sesión" },
  "dash.calendar": { en: "Calendar", es: "Calendario" },
  "dash.sessions": { en: "Sessions", es: "Sesiones" },
  "dash.sessions.placeholder": { en: "Session with…", es: "Sesión con…" },
  "dash.sessions.empty": { en: "No sessions scheduled for this day.", es: "No hay sesiones para este día." },
  "dash.add": { en: "Add", es: "Añadir" },
  "dash.notes": { en: "Session notes & mood", es: "Notas y estado de ánimo" },
  "dash.notes.sub": {
    en: "Notate how you feel during or after a session.",
    es: "Anota cómo te sientes durante o después de una sesión.",
  },
  "dash.mood": { en: "How are you feeling?", es: "¿Cómo te sientes?" },
  "dash.note.label": { en: "Notes", es: "Notas" },
  "dash.note.placeholder": {
    en: "What came up today? Insights, feelings, breakthroughs…",
    es: "¿Qué surgió hoy? Reflexiones, sentimientos, descubrimientos…",
  },
  "dash.save": { en: "Save entry", es: "Guardar entrada" },
  "dash.notes.empty": { en: "No notes yet for this day.", es: "Aún no hay notas para este día." },

  "dash.tasks.title": {es: "Tareas del especialista",en : "Specialist tasks"},
  "dash.tasks.subtitle": {es: "Actividades que te dejó tu especialista", en: "Activities your specialist left for you"},
  "dash.tasks.empty": {es: "No tienes tareas pendientes.", en: "You have no pending tasks."},

    // Admin
  "admin.title": { en: "Admin panel", es: "Panel de administración" },
  "admin.subtitle": { en: "Manage tasks for your patients", es: "Gestiona las tareas de tus pacientes" },
  "admin.patient": { en: "Patient", es: "Paciente" },
  "admin.selectPatient": { en: "Select a patient", es: "Selecciona un paciente" },
  "admin.noPatients": { en: "No active patients yet.", es: "Aún no hay pacientes activos." },
  "admin.newTask": { en: "New task", es: "Nueva tarea" },
  "admin.taskTitle": { en: "Task title", es: "Título de la tarea" },
  "admin.taskDesc": { en: "Description (optional)", es: "Descripción (opcional)" },
  "admin.addTask": { en: "Add task", es: "Añadir tarea" },
  "admin.tasks.empty": { en: "This patient has no tasks yet.", es: "Este paciente aún no tiene tareas." },
  "admin.edit": { en: "Edit", es: "Editar" },
  "admin.delete": { en: "Delete", es: "Eliminar" },
  "admin.save": { en: "Save", es: "Guardar" },
  "admin.cancel": { en: "Cancel", es: "Cancelar" },
  "admin.confirmDelete": { en: "Delete this task?", es: "¿Eliminar esta tarea?" },
  "admin.done": { en: "Completed", es: "Completada" },
  "admin.error": { en: "Something went wrong. Please try again.", es: "Algo salió mal. Inténtalo de nuevo." },

  // Dashboard - Session delete
"dash.session.delete": { en: "Cancel", es: "Cancelar" },
"dash.session.confirmDelete": {
  en: "Are you sure you want to cancel this session?",
  es: "¿Estás seguro de que quieres cancelar esta sesión?",
},
"dash.session.deleteError": {
  en: "Could not cancel the session. Please try again.",
  es: "No se pudo cancelar la sesión. Inténtalo de nuevo.",
},

  //JournalSection
  "js.loadJournal": { en: "Loading journal...", es: "Cargando tu diario..." },
  "js.journal.title" : {en: "{{name}}'s Journal", es: "Diario de {{name}}"},

    // Journal
  "journal.title": { en: "Journal", es: "Diario",},
  "journal.subtitle": {en: "A quiet space for your thoughts and feelings.", es: "Un espacio tranquilo para tus pensamientos y sentimientos.",},
  "journal.new": {
    en: "Add a note to your Journal",
    es: "Añadir una nota a tu Diario",
  },
  "journal.empty": {
    en: "No entries yet. Start writing when you're ready.",
    es: "Aún no hay entradas. Empieza a escribir cuando te sientas listo.",
  },
  "journal.untitled": {
    en: "Untitled",
    es: "Sin título",
  },
  "journal.field.title": {
    en: "Title",
    es: "Título",
  },
  "journal.field.title.placeholder": {
    en: "Give this entry a title…",
    es: "Dale un título a esta entrada…",
  },
  "journal.field.mood": {
    en: "How are you feeling?",
    es: "¿Cómo te sientes?",
  },
  "journal.field.body": {
    en: "Your thoughts",
    es: "Tus pensamientos",
  },
  "journal.field.body.placeholder": {
    en: "Write freely… What came up today?",
    es: "Escribe libremente… ¿Qué surgió hoy?",
  },
  "journal.save": {
    en: "Save entry",
    es: "Guardar entrada",
  },
  "journal.delete": {
    en: "Delete",
    es: "Eliminar",
  },

  "journal.read.only": {
    en: "What this patient has written (read-only).",
    es: "Lo que el paciente ha escrito (solo lectura).",
  },

};

export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: TKey) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("breathe.lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("breathe.lang", l);
  };

  const t = (key: TKey) => dict[key]?.[lang] ?? String(key);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}
