export const API_URL = import.meta.env.VITE_API_URL || "https://api.breathecol.com";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  // Login expired (the cookie lasts 7 days): clear the local copy and sign in again
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("breathe.user");
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}