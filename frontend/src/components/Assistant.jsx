import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import Icon from "./Icon";
import {
  feasibility,
  clock,
  DEMO_DATE,
  DEMO_NOW,
  currentFreeWindow,
} from "../data/campus";
export default function Assistant({ state, onClose, onOpen }) {
  const free = currentFreeWindow(state.events, state.registrations);
  const [messages, setMessages] = useState([
      {
        role: "assistant",
        text: `You’ve got ${free.minutes} free minutes before your next plan. Ask about your break, AI events, waitlists, or your passport.`,
      },
    ]),
    [input, setInput] = useState(""),
    [busy, setBusy] = useState(false);
  const timer = useRef(null),
    log = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    log.current?.scrollTo({
      top: log.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  const ask = (question) => {
    if (busy || !question.trim()) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: question }]);
    timer.current = setTimeout(() => {
      const q = question.toLowerCase();
      let text, event;
      if (/passport|skill|certificate/.test(q))
        text = `Your passport has ${state.activities.length} recorded activities. Marking attendance in the organizer workspace adds an experience and unlocks a demo certificate.`;
      else if (/waitlist|full|hack/.test(q)) {
        event = state.events.find((e) => e.id === "hack");
        text = `HackMatrix has ${event.registered}/${event.capacity} seats filled and ${event.waitlist} people waiting. You can join the waitlist. Releasing a demo seat in the organizer workspace promotes the next person in line.`;
      } else if (/friend|sinchana|together/.test(q))
        text =
          "Your timetable is available, but your friends’ schedules are not connected in this frontend demo. You can explore an event together, but I can’t verify a shared free period.";
      else if (/ai|break|free|today|workshop|event/.test(q)) {
        const available = state.events
          .filter(
            (e) =>
              feasibility(e, state.registrations, state.events).ok &&
              (/ai/.test(q)
                ? e.tags.includes("AI / ML")
                : e.date === DEMO_DATE &&
                  e.start >= DEMO_NOW &&
                  e.end + e.walk <= free.until),
          )
          .sort((a, b) => b.score - a.score);
        event = available[0];
        text = event
          ? `${event.title} is a good fit. It starts at ${clock(event.start)}, ends at ${clock(event.end)}, and is ${event.walk} minutes away. ${event.capacity - event.registered} seats remain. ${feasibility(event, state.registrations, state.events).reason}`
          : `No demo opportunity fits your current ${free.minutes}-minute break. Check My schedule, or discover events later this week.`;
      } else
        text =
          "I can use the local event list and your demo timetable to answer questions about free time, AI events, waitlists, and your skill passport. Try “What can I do during my break?”";
      setMessages((m) => [...m, { role: "assistant", text, event }]);
      setBusy(false);
    }, 650);
  };
  return (
    <Dialog title="Your campus, a little clearer" onClose={onClose}>
      <p className="small-text muted assistant-disclaimer">
        <Icon name="spark" size={15} />
        Grounded in local demo data · scripted assistant, no live LLM
      </p>
      <div
        className="chat-log"
        ref={log}
        role="log"
        aria-label="Campus assistant conversation"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div className={`chat-message ${m.role}`} key={i}>
            {m.role === "assistant" && <Icon name="spark" size={18} />}
            <div>
              <p>{m.text}</p>
              {m.event && (
                <button
                  className="text-button mint-text"
                  onClick={() => {
                    onClose();
                    onOpen(m.event);
                  }}
                >
                  Explore this opportunity <Icon name="arrow" size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="chat-message assistant">
            <span className="spinner" />
            Connecting the details…
          </div>
        )}
      </div>
      <div className="chat-suggestions">
        {[
          "What can I do during my break?",
          "AI events this week",
          "How does the waitlist work?",
        ].map((q) => (
          <button key={q} disabled={busy} onClick={() => ask(q)}>
            {q}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          aria-label="Message campus assistant"
          placeholder="What’s on your mind?"
          value={input}
          maxLength="300"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="icon-button"
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
        >
          <Icon name="arrow" />
        </button>
      </form>
    </Dialog>
  );
}
