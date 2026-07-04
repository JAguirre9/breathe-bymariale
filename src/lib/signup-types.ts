export type UserRole = "PATIENT" | "PSYCHOLOGIST";

export interface SignupIntake {
  // Personal Information
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;

  // Contact
  phoneCode: string;
  phoneNumber: string;
  contactMethod: "whatsapp" | "email" | "phone";

  // Patient Fields
  age: string;
  feelings: string;
  priorSessions: string;

  // Psychologist Fields
  license: string;
  licenseCountry: string;
  yearsExperience: string;
  degree: string;
  specialties: string;
  languages: string;
  motivation: string;
}

export const defaultSignupIntake: SignupIntake = {
  firstName: "",
  lastName: "",
  preferredName: "",
  email: "",

  phoneCode: "+57",
  phoneNumber: "",
  contactMethod: "whatsapp",

  age: "",
  feelings: "",
  priorSessions: "",

  license: "",
  licenseCountry: "",
  yearsExperience: "",
  degree: "",
  specialties: "",
  languages: "",
  motivation: "",
};