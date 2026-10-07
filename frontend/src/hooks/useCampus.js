import { useEffect, useState } from "react";
import { createDemoState } from "../data/createState";
const KEY = "campusconnect-opportunities-v1";
function initial() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (
      saved?.version === 1 &&
      Array.isArray(saved.events) &&
      Array.isArray(saved.registrations) &&
      Array.isArray(saved.activities) &&
      Array.isArray(saved.joined) &&
      Array.isArray(saved.proposals) &&
      saved.events.every(
        (e) =>
          typeof e.id === "string" &&
          typeof e.title === "string" &&
          Array.isArray(e.years) &&
          Array.isArray(e.tags) &&
          Number.isFinite(e.start) &&
          Number.isFinite(e.end),
      )
    )
      return saved;
  } catch {
    /* Recover from unavailable storage or malformed data. */
  }
  return createDemoState();
}
export default function useCampus() {
  const [state, setState] = useState(initial),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    let error = false;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      error = true;
    }
    const task = setTimeout(() => setStorageError(error), 0);
    return () => clearTimeout(task);
  }, [state]);
  return [state, setState, storageError];
}
