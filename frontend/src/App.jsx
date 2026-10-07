import { useCallback, useEffect, useRef, useState } from "react";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import AppShell from "./components/AppShell";
import EventDetails from "./components/EventDetails";
import Assistant from "./components/Assistant";
import Notice from "./components/Notice";
import Dialog from "./components/Dialog";
import { Splash, Offline } from "./components/Status";
import Today from "./pages/Today";
import Explore from "./pages/Explore";
import Schedule from "./pages/Schedule";
import Passport from "./pages/Passport";
import Poster from "./pages/Poster";
import Organizer from "./pages/Organizer";
import Communities from "./pages/Communities";
import CampusAdmin from "./pages/CampusAdmin";
import useCampus from "./hooks/useCampus";
import { api } from "./api/client";
import { NAV, HOME } from "./data/nav";
import "./App.css";

const pages = ["home", "auth", ...new Set(Object.values(NAV).flat())];

function pageFromHash() {
  const page = location.hash.slice(1);
  return pages.includes(page) ? page : "home";
}

function App() {
  const campus = useCampus();
  const { state, status } = campus;
  const [page, setPage] = useState(pageFromHash),
    [eventId, setEventId] = useState(null),
    [assistant, setAssistant] = useState(false),
    [notice, setNotice] = useState(null),
    [resetOpen, setResetOpen] = useState(false),
    [free, setFree] = useState(false),
    [busy, setBusy] = useState(false),
    [demoAccounts, setDemoAccounts] = useState([]);
  const toastTimer = useRef(null),
    afterAuth = useRef(null);

  useEffect(() => {
    const change = () => {
      setPage(pageFromHash());
      setEventId(null);
      setAssistant(false);
    };
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("hashchange", change);
      clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    api
      .demoAccounts()
      .then((d) => setDemoAccounts(d.accounts))
      .catch(() => setDemoAccounts([]));
  }, [status]);

  const notify = useCallback((text, tone = "success") => {
    clearTimeout(toastTimer.current);
    setNotice({ text, tone, id: Date.now() });
    toastTimer.current = setTimeout(() => setNotice(null), 4800);
  }, []);

  const navigate = useCallback((target, options = {}) => {
    setFree(!!options.free);
    setPage(target);
    if (location.hash.slice(1) !== target) location.hash = target;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  /** Runs an API mutation, applies the returned state, and reports back. */
  const act = useCallback(
    async (call) => {
      setBusy(true);
      try {
        const message = await campus.run(call);
        if (message) notify(message);
        return true;
      } catch (e) {
        notify(e.message, "error");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [campus, notify],
  );

  const enter = (target) => {
    if (status === "ready") {
      navigate(NAV[state.user.role].includes(target) ? target : HOME[state.user.role]);
    } else {
      afterAuth.current = target;
      navigate("auth");
    }
  };

  const onSession = (session) => {
    const next = campus.startSession(session);
    const role = next.user.role;
    const wanted = afterAuth.current;
    afterAuth.current = null;
    navigate(wanted && NAV[role].includes(wanted) ? wanted : HOME[role]);
    notify(`Welcome, ${next.user.firstName}. Your campus is ready.`);
  };

  const switchAccount = async (email) => {
    setBusy(true);
    try {
      onSession(await api.demoLogin(email));
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    campus.signOut();
    setEventId(null);
    setAssistant(false);
    navigate("home");
  };

  if (page === "home")
    return (
      <>
        <Landing onEnter={enter} signedIn={status === "ready"} />
        <Notice notice={notice} onClose={() => setNotice(null)} />
      </>
    );
  if (status === "loading") return <Splash />;
  if (status === "offline")
    return <Offline message={campus.error} onRetry={campus.load} onHome={() => navigate("home")} />;
  if (status !== "ready" || page === "auth")
    return (
      <>
        <AuthPage
          demoAccounts={demoAccounts}
          onSession={onSession}
          onHome={() => navigate("home")}
          signedIn={status === "ready"}
          onContinue={() => navigate(HOME[state.user.role])}
        />
        <Notice notice={notice} onClose={() => setNotice(null)} />
      </>
    );

  const role = state.user.role;
  const current = NAV[role].includes(page) ? page : HOME[role];
  const open = (event) => event && setEventId(event.id);
  const selectedEvent = state.events.find((e) => e.id === eventId);
  const isRegistered = (id) => state.registrations.some((r) => r.eventId === id);

  return (
    <>
      <AppShell
        page={current}
        navigate={navigate}
        user={state.user}
        demoAccounts={demoAccounts}
        onSwitchAccount={switchAccount}
        onHome={() => navigate("home")}
        onSignOut={signOut}
        onAssistant={() => setAssistant(true)}
        onReset={demoAccounts.length ? () => setResetOpen(true) : null}
        ai={state.ai}
        busy={busy}
      >
        {current === "today" && <Today state={state} navigate={navigate} onOpen={open} />}
        {current === "explore" && (
          <Explore key={String(free)} state={state} onOpen={open} free={free} />
        )}
        {current === "schedule" && (
          <Schedule
            state={state}
            onOpen={open}
            navigate={navigate}
            busy={busy}
            onAddClass={(fields) => act(() => api.addClass(fields))}
            onRemoveClass={(id) => act(() => api.removeClass(id))}
          />
        )}
        {current === "passport" && (
          <Passport
            state={state}
            onFeedback={(id, rating, comment) => act(() => api.feedback(id, rating, comment))}
          />
        )}
        {current === "poster" && (
          <Poster
            state={state}
            busy={busy}
            onPublish={(draft) => act(() => api.createEvent({ ...draft, source: "poster" }))}
          />
        )}
        {current === "organizer" && (
          <Organizer
            state={state}
            busy={busy}
            navigate={navigate}
            onCreate={(fields) => act(() => api.createEvent(fields))}
            onDelete={(event) => act(() => api.deleteEvent(event.id))}
            onAttendance={(event, userId, present) =>
              act(() => api.attendance(event.id, userId, present))
            }
            onReleaseSeat={(event) => act(() => api.releaseSeat(event.id))}
          />
        )}
        {current === "communities" && (
          <Communities
            state={state}
            busy={busy}
            onJoin={(id) =>
              act(() => (state.joined.includes(id) ? api.leave(id) : api.join(id)))
            }
            onPropose={(fields) => act(() => api.propose(fields))}
          />
        )}
        {current === "admin" && (
          <CampusAdmin
            state={state}
            busy={busy}
            onDecision={(proposal, approved) => act(() => api.decide(proposal.id, approved))}
            onBroadcast={(text) => act(() => api.announce(text))}
          />
        )}
      </AppShell>
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          state={state}
          busy={busy}
          onClose={() => setEventId(null)}
          onRegister={(event) =>
            isRegistered(event.id)
              ? notify("This opportunity is already in your plans.")
              : act(() => api.registerFor(event.id))
          }
          onCancel={(event) => act(() => api.cancel(event.id))}
        />
      )}
      {assistant && (
        <Assistant state={state} onClose={() => setAssistant(false)} onOpen={open} />
      )}
      <Notice notice={notice} onClose={() => setNotice(null)} />
      {resetOpen && (
        <Dialog title="Start a fresh campus day?" onClose={() => setResetOpen(false)}>
          <p className="muted">
            This restores the seeded demo campus in the database for every account:
            events, registrations, check-ins, proposals, and reflections go back to
            the presentation scenario. Accounts created through sign-up are removed.
          </p>
          <div className="action-row reset-actions">
            <button
              className="button danger"
              disabled={busy}
              onClick={async () => {
                if (await act(() => api.reset())) {
                  setResetOpen(false);
                  setEventId(null);
                  setAssistant(false);
                  navigate(HOME[role]);
                }
              }}
            >
              {busy ? "Resetting…" : "Reset demo campus"}
            </button>
            <button className="button secondary" onClick={() => setResetOpen(false)}>
              Keep my changes
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
export default App;
