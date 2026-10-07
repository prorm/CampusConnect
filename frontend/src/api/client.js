// Thin fetch wrapper for the CampusConnect API. In development Vite proxies
// /api to the Express server (see vite.config.js); set VITE_API_URL to call a
// separately hosted API instead.
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "campusconnect-token";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* Storage can be unavailable; the session then lasts until reload. */
    }
  },
};

let memoryToken = tokenStore.get();
export function setToken(token) {
  memoryToken = token;
  tokenStore.set(token);
}

export async function request(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(memoryToken ? { Authorization: `Bearer ${memoryToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Can't reach the CampusConnect API. Is the backend running?",
      0,
    );
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      data.error ||
        (response.status >= 500
          ? "The API ran into a problem."
          : `Request failed (${response.status}).`),
      response.status,
      data.details,
    );
  return data;
}

export const api = {
  health: () => request("/health"),
  state: () => request("/me/state"),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (fields) =>
    request("/auth/register", { method: "POST", body: fields }),
  demoAccounts: () => request("/auth/demo-accounts"),
  demoLogin: (email) =>
    request("/auth/demo", { method: "POST", body: { email } }),
  updateProfile: (fields) =>
    request("/auth/me", { method: "PATCH", body: fields }),
  addClass: (fields) =>
    request("/me/timetable", { method: "POST", body: fields }),
  removeClass: (id) => request(`/me/timetable/${id}`, { method: "DELETE" }),
  feedback: (key, rating, comment) =>
    request(`/me/activities/${encodeURIComponent(key)}/feedback`, {
      method: "POST",
      body: { rating, comment },
    }),
  registerFor: (id) =>
    request(`/events/${encodeURIComponent(id)}/registration`, {
      method: "POST",
    }),
  cancel: (id) =>
    request(`/events/${encodeURIComponent(id)}/registration`, {
      method: "DELETE",
    }),
  createEvent: (fields) => request("/events", { method: "POST", body: fields }),
  deleteEvent: (id) =>
    request(`/events/${encodeURIComponent(id)}`, { method: "DELETE" }),
  releaseSeat: (id) =>
    request(`/events/${encodeURIComponent(id)}/release`, { method: "POST" }),
  attendance: (id, userId, present) =>
    request(`/events/${encodeURIComponent(id)}/attendance/${userId}`, {
      method: "PUT",
      body: { present },
    }),
  join: (id) =>
    request(`/communities/${encodeURIComponent(id)}/membership`, {
      method: "POST",
    }),
  leave: (id) =>
    request(`/communities/${encodeURIComponent(id)}/membership`, {
      method: "DELETE",
    }),
  propose: (fields) =>
    request("/communities", { method: "POST", body: fields }),
  decide: (id, approved) =>
    request(`/communities/${encodeURIComponent(id)}/decision`, {
      method: "PATCH",
      body: { approved },
    }),
  announce: (text) =>
    request("/admin/announcement", { method: "PUT", body: { text } }),
  analytics: () => request("/admin/analytics"),
  reset: () => request("/admin/reset", { method: "POST" }),
  ask: (message, history) =>
    request("/ai/assistant", { method: "POST", body: { message, history } }),
  readPoster: (body) => request("/ai/poster", { method: "POST", body }),
  feedbackSummary: (eventId) =>
    request(
      `/ai/feedback-summary${eventId ? `?event=${encodeURIComponent(eventId)}` : ""}`,
    ),
};
