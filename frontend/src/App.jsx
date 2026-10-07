import { useEffect, useRef, useState } from "react";
import Landing from "./pages/Landing";
import AppShell from "./components/AppShell";
import EventDetails from "./components/EventDetails";
import Assistant from "./components/Assistant";
import Notice from "./components/Notice";
import Dialog from "./components/Dialog";
import { createDemoState } from "./data/createState";
import Today from "./pages/Today";
import Explore from "./pages/Explore";
import Schedule from "./pages/Schedule";
import Passport from "./pages/Passport";
import Poster from "./pages/Poster";
import Organizer from "./pages/Organizer";
import Communities from "./pages/Communities";
import CampusAdmin from "./pages/CampusAdmin";
import useCampus from "./hooks/useCampus";
import { feasibility } from "./data/campus";
import "./App.css";

const validPages = [
  "home",
  "today",
  "explore",
  "schedule",
  "passport",
  "poster",
  "organizer",
  "communities",
  "admin",
];
function pageFromHash() {
  const page = location.hash.slice(1);
  return validPages.includes(page) ? page : "home";
}
function App() {
  const [state, setState, storageError] = useCampus();
  const [page, setPage] = useState(pageFromHash),
    [role, setRole] = useState(() =>
      pageFromHash() === "organizer"
        ? "coordinator"
        : pageFromHash() === "admin"
          ? "admin"
          : "student",
    );
  const [eventId, setEventId] = useState(null),
    [assistant, setAssistant] = useState(false),
    [message, setMessage] = useState(""),
    [resetOpen, setResetOpen] = useState(false),
    [free, setFree] = useState(false);
  const toastTimer = useRef(null);
  useEffect(() => {
    const change = () => {
      if (!validPages.includes(location.hash.slice(1))) return;
      const target = pageFromHash();
      setPage(target);
      if (target === "organizer") setRole("coordinator");
      if (target === "admin") setRole("admin");
      setEventId(null);
      setAssistant(false);
    };
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("hashchange", change);
      clearTimeout(toastTimer.current);
    };
  }, []);
  const notify = (text) => {
    clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current = setTimeout(() => setMessage(""), 4500);
  };
  const navigate = (target, options = {}) => {
    setFree(!!options.free);
    setPage(target);
    location.hash = target;
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const changeRole = (value) => {
    setRole(value);
    navigate(
      value === "student"
        ? "today"
        : value === "coordinator"
          ? "organizer"
          : "admin",
    );
  };
  const enter = (target) => {
    setRole(target === "organizer" ? "coordinator" : "student");
    navigate(target);
  };
  const register = (event) => {
    if (state.registrations.some((r) => r.eventId === event.id)) {
      notify("This opportunity is already in your plans.");
      return;
    }
    if (!feasibility(event, state.registrations, state.events).ok) {
      notify("This opportunity does not fit your schedule. Try another time.");
      return;
    }
    const full = event.registered >= event.capacity;
    setState((s) => ({
      ...s,
      events: s.events.map((e) =>
        e.id === event.id
          ? {
              ...e,
              registered: e.registered + (full ? 0 : 1),
              waitlist: e.waitlist + (full ? 1 : 0),
            }
          : e,
      ),
      registrations: [
        ...s.registrations,
        {
          eventId: event.id,
          status: full ? "waitlisted" : "registered",
          position: full ? event.waitlist + 1 : null,
          attended: false,
        },
      ],
    }));
    notify(
      full
        ? `You’re on the waitlist at position #${event.waitlist + 1}.`
        : "Your seat is saved. Your schedule just got more interesting.",
    );
  };
  // Existing waitlist positions represent seeded attendees. Release preserves queue order.
  const releaseSeat = (event, removeOwn = false) => {
    const own = state.registrations.find((r) => r.eventId === event.id);
    const promoteOwn = own?.status === "waitlisted" && own.position === 1;
    setState((s) => ({
      ...s,
      events: s.events.map((e) =>
        e.id === event.id
          ? {
              ...e,
              registered: Math.max(0, e.registered - (e.waitlist ? 0 : 1)),
              waitlist: Math.max(0, e.waitlist - 1),
            }
          : e,
      ),
      registrations: s.registrations
        .filter((r) => !(removeOwn && r.eventId === event.id))
        .map((r) =>
          r.eventId === event.id && r.status === "waitlisted"
            ? {
                ...r,
                position: r.position === 1 ? null : r.position - 1,
                status: r.position === 1 ? "registered" : "waitlisted",
              }
            : r,
        ),
    }));
    notify(
      promoteOwn
        ? "A seat opened. Pranav is now registered!"
        : event.waitlist
          ? "One seat released; the next waitlisted attendee was promoted."
          : "One demo seat released.",
    );
  };
  const cancel = (event) => {
    const r = state.registrations.find((r) => r.eventId === event.id);
    if (!r || r.attended) return;
    if (r.status === "registered") {
      releaseSeat(event, true);
      return;
    }
    setState((s) => ({
      ...s,
      registrations: s.registrations.filter((r) => r.eventId !== event.id),
      events: s.events.map((e) =>
        e.id === event.id ? { ...e, waitlist: Math.max(0, e.waitlist - 1) } : e,
      ),
    }));
    notify("Your waitlist spot has been cancelled.");
  };
  const attendance = (event, person, present) => {
    setState((s) => {
      const registration = s.registrations.find(
        (r) => r.eventId === event.id && r.status === "registered",
      );
      let activities = s.activities;
      if (person === "pranav" && registration) {
        activities = present
          ? [
              ...s.activities.filter((a) => a.id !== event.id),
              {
                id: event.id,
                title: event.title,
                club: event.club,
                date: event.date,
                skill: event.tags[0],
                attended: true,
                feedback: false,
              },
            ]
          : s.activities.filter((a) => a.id !== event.id);
      }
      return {
        ...s,
        checkins: {
          ...s.checkins,
          [event.id]: { ...s.checkins?.[event.id], [person]: present },
        },
        registrations: s.registrations.map((r) =>
          r.eventId === event.id && person === "pranav"
            ? { ...r, attended: present }
            : r,
        ),
        activities,
      };
    });
    notify(
      present
        ? "Attendance recorded. Every experience counts."
        : "Check-in undone; the participation record was updated.",
    );
  };
  const publish = (event) => {
    setState((s) => ({ ...s, events: [event, ...s.events] }));
    notify("A new opportunity is now discoverable in this demo.");
  };
  const feedback = (id, rating, comment) => {
    setState((s) => ({
      ...s,
      activities: s.activities.map((a) =>
        a.id === id ? { ...a, feedback: true } : a,
      ),
      feedbacks: [...(s.feedbacks || []), { id, rating, comment }],
    }));
    notify("Reflection saved. Thanks for making the next experience better.");
  };
  const join = (id) => {
    setState((s) => ({
      ...s,
      joined: s.joined.includes(id)
        ? s.joined.filter((c) => c !== id)
        : [...s.joined, id],
    }));
    notify(
      state.joined.includes(id)
        ? "You’ve left this community."
        : "Welcome to your people.",
    );
  };
  const propose = (proposal) => {
    setState((s) => ({ ...s, proposals: [...s.proposals, proposal] }));
    notify("Your proposal is ready for review in the admin workspace.");
  };
  const decision = (proposal, approved) => {
    setState((s) => ({
      ...s,
      proposals: s.proposals.filter((p) => p.id !== proposal.id),
      approvedCommunities: approved
        ? [
            ...(s.approvedCommunities || []),
            {
              ...proposal,
              category: "Community",
              members: 0,
              color: "blue",
              art: "orbit",
              tags: ["Community"],
            },
          ]
        : s.approvedCommunities,
    }));
    notify(
      approved
        ? "A new community is now open to campus."
        : "Community proposal declined in this demo.",
    );
  };
  const open = (event) => event && setEventId(event.id);
  const selectedEvent = state.events.find((e) => e.id === eventId);
  return (
    <>
      {page === "home" ? (
        <Landing onEnter={enter} />
      ) : (
        <AppShell
          page={page}
          navigate={navigate}
          role={role}
          setRole={changeRole}
          onHome={() => navigate("home")}
          onAssistant={() => setAssistant(true)}
          onReset={() => setResetOpen(true)}
          storageError={storageError}
        >
          {page === "today" && (
            <Today state={state} navigate={navigate} onOpen={open} />
          )}
          {page === "explore" && (
            <Explore
              key={String(free)}
              state={state}
              onOpen={open}
              free={free}
            />
          )}
          {page === "schedule" && (
            <Schedule state={state} onOpen={open} navigate={navigate} />
          )}
          {page === "passport" && (
            <Passport state={state} onFeedback={feedback} />
          )}
          {page === "poster" && <Poster state={state} onPublish={publish} />}
          {page === "organizer" && (
            <Organizer
              state={state}
              onCreate={publish}
              onAttendance={attendance}
              onReleaseSeat={releaseSeat}
              navigate={navigate}
            />
          )}
          {page === "communities" && (
            <Communities state={state} onJoin={join} onPropose={propose} />
          )}
          {page === "admin" && (
            <CampusAdmin
              state={state}
              onDecision={decision}
              onBroadcast={(text) => {
                setState((s) => ({ ...s, announcement: text }));
                notify("Your note is now on My campus today.");
              }}
            />
          )}
        </AppShell>
      )}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          state={state}
          onClose={() => setEventId(null)}
          onRegister={register}
          onCancel={cancel}
        />
      )}{" "}
      {assistant && (
        <Assistant
          state={state}
          onClose={() => setAssistant(false)}
          onOpen={open}
        />
      )}
      <Notice message={message} onClose={() => setMessage("")} />
      {resetOpen && (
        <Dialog
          title="Start a fresh campus day?"
          onClose={() => setResetOpen(false)}
        >
          <p className="muted">
            This restores the original demo events and passport. Created events,
            registrations, check-ins, proposals, and reflections in this browser
            will be cleared.
          </p>
          <div className="action-row reset-actions">
            <button
              className="button"
              onClick={() => {
                setState(createDemoState());
                setResetOpen(false);
                setEventId(null);
                setAssistant(false);
                changeRole("student");
                notify("A fresh campus day. The demo is ready to explore.");
              }}
            >
              Reset local demo
            </button>
            <button
              className="button secondary"
              onClick={() => setResetOpen(false)}
            >
              Keep my changes
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
export default App;
