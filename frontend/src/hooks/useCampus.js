import { useCallback, useEffect, useState } from "react";
import { api, setToken, tokenStore, ApiError } from "../api/client";

/**
 * Session and campus state backed by the API.
 * status: "loading" | "signed-out" | "ready" | "offline"
 */
export default function useCampus() {
  const [state, setState] = useState(null),
    [status, setStatus] = useState(() =>
      tokenStore.get() ? "loading" : "signed-out",
    ),
    [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!tokenStore.get()) {
      setStatus("signed-out");
      return;
    }
    setStatus("loading");
    try {
      setState(await api.state());
      setStatus("ready");
      setError("");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setToken(null);
        setStatus("signed-out");
      } else {
        setError(e.message);
        setStatus("offline");
      }
    }
  }, []);

  useEffect(() => {
    if (!tokenStore.get()) return;
    const controller = new AbortController();
    api
      .state()
      .then((data) => {
        if (controller.signal.aborted) return;
        setState(data);
        setStatus("ready");
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        if (e instanceof ApiError && e.status === 401) {
          setToken(null);
          setStatus("signed-out");
        } else {
          setError(e.message);
          setStatus("offline");
        }
      });
    return () => controller.abort();
  }, []);

  const startSession = useCallback(({ token, state: next }) => {
    setToken(token);
    setState(next);
    setStatus("ready");
    setError("");
    return next;
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setState(null);
    setStatus("signed-out");
  }, []);

  /**
   * Runs an API mutation that responds with { message, state } and applies
   * the fresh snapshot. Returns the message; throws ApiError on failure.
   */
  const run = useCallback(
    async (call) => {
      try {
        const result = await call();
        if (result.token) setToken(result.token);
        if (result.state) setState(result.state);
        return result.message;
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) signOut();
        throw e;
      }
    },
    [signOut],
  );

  return { state, status, error, load, startSession, signOut, run };
}
