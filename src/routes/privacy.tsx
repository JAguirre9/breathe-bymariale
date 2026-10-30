import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy - Breathe" }] }),
  component: PrivacyPage,
});

// TODO before launch: replace these two values
const CONTACT_EMAIL = "hello@your-domain.com";
const LAST_UPDATED = "October 29, 2026";

const EN = [
  {
    h: "Who we are",
    p: [
      "Breathe is an online therapy service run by Mariale Marulanda. This policy explains what personal information we collect, why we collect it, and the choices you have.",
    ],
  },
  {
    h: "What we collect",
    p: [
      "When you sign up: your name, email, phone number, age, preferred way of being contacted, how you are feeling, and whether you have had therapy before.",
      "When you use the app: the journal entries you write (title, mood, text), the sessions you schedule, and the tasks your specialist assigns you.",
      "Technical data: a secure login cookie that keeps you signed in. We do not use advertising or tracking cookies.",
    ],
  },
  {
    h: "Why we use it",
    p: [
      "To create and manage your account, to schedule and run your sessions, to let your specialist support your care, and to contact you about your access and appointments. We do not sell your information and we do not use it for advertising.",
    ],
  },
  {
    h: "Who can see your information",
    p: [
      "Your journal, sessions and tasks are visible to you and to the Breathe administrator/specialist who provides your care, so they can follow your progress. No other patient can see your information.",
      "We only share information with service providers that run the app for us (such as hosting and database providers), under the purpose of operating the service, or when the law requires it.",
    ],
  },
  {
    h: "Emergencies",
    p: [
      "Breathe is not an emergency service. If you are in danger or thinking of harming yourself, contact your local emergency number or crisis line immediately.",
    ],
  },
  {
    h: "How we protect it",
    p: [
      "Passwords are stored encrypted (hashed), connections use HTTPS, and access to administrator features is restricted and checked on every request. No system is perfectly secure, but we work to protect your information.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "We keep your information while your account is active. You can ask us to delete your account and data at any time.",
    ],
  },
  {
    h: "Your rights",
    p: [
      `You can ask to see, correct, export or delete your personal information, or withdraw your consent, by writing to ${CONTACT_EMAIL}. We will respond as soon as we reasonably can.`,
    ],
  },
  {
    h: "Changes",
    p: [
      "If we change this policy we will update the date at the top of this page.",
    ],
  },
];

const ES = [
  {
    h: "Quiénes somos",
    p: [
      "Breathe es un servicio de terapia en línea dirigido por Mariale Marulanda. Esta política explica qué datos personales recopilamos, para qué los usamos y qué opciones tienes.",
    ],
  },
  {
    h: "Qué información recopilamos",
    p: [
      "Al registrarte: tu nombre, correo, teléfono, edad, forma de contacto preferida, cómo te sientes y si has tenido terapia antes.",
      "Al usar la app: las entradas de tu diario (título, estado de ánimo, texto), las sesiones que agendas y las tareas que te asigna tu especialista.",
      "Datos técnicos: una cookie de inicio de sesión segura que te mantiene conectado/a. No usamos cookies de publicidad ni de seguimiento.",
    ],
  },
  {
    h: "Para qué la usamos",
    p: [
      "Para crear y administrar tu cuenta, agendar y realizar tus sesiones, permitir que tu especialista apoye tu proceso y contactarte sobre tu acceso y citas. No vendemos tu información ni la usamos para publicidad.",
    ],
  },
  {
    h: "Quién puede ver tu información",
    p: [
      "Tu diario, sesiones y tareas son visibles para ti y para la administradora/especialista de Breathe que te acompaña, con el fin de dar seguimiento a tu proceso. Ningún otro paciente puede ver tu información.",
      "Solo compartimos información con proveedores que operan la app por nosotros (como alojamiento y base de datos), para el funcionamiento del servicio, o cuando la ley lo exija.",
    ],
  },
  {
    h: "Emergencias",
    p: [
      "Breathe no es un servicio de emergencias. Si estás en peligro o piensas en hacerte daño, comunícate de inmediato con tu línea de emergencia local o línea de crisis.",
    ],
  },
  {
    h: "Cómo la protegemos",
    p: [
      "Las contraseñas se guardan cifradas (hash), las conexiones usan HTTPS y el acceso a las funciones de administración es restringido y se verifica en cada solicitud. Ningún sistema es perfectamente seguro, pero trabajamos para proteger tu información.",
    ],
  },
  {
    h: "Cuánto tiempo la conservamos",
    p: [
      "Conservamos tu información mientras tu cuenta esté activa. Puedes pedirnos que eliminemos tu cuenta y tus datos en cualquier momento.",
    ],
  },
  {
    h: "Tus derechos",
    p: [
      `Puedes pedir ver, corregir, exportar o eliminar tus datos personales, o retirar tu consentimiento, escribiendo a ${CONTACT_EMAIL}. Responderemos lo antes razonablemente posible.`,
    ],
  },
  {
    h: "Cambios",
    p: [
      "Si cambiamos esta política, actualizaremos la fecha al inicio de esta página.",
    ],
  },
];

function PrivacyPage() {
  const { lang } = useT();
  const es = lang === "es";
  const sections = es ? ES : EN;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-36 pb-24">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          {es ? "Política de privacidad" : "Privacy Policy"}
        </h1>
        <p className="mt-2 mb-8 text-sm text-foreground/60">
          {es ? "Última actualización: " : "Last updated: "}
          {LAST_UPDATED}
        </p>

        <div className="space-y-8 rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
                {s.h}
              </h2>
              {s.p.map((para, i) => (
                <p key={i} className="mb-2 text-foreground/80 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}