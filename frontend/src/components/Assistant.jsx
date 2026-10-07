import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import Icon from "./Icon";
import { freeFor } from "../data/campus";
import { api } from "../api/client";

const SUGGESTIONS = {
  student: [
    "What can I do during my break?",
    "AI events this week",
    "How does the waitlist work?",
  ],
  coordinator: [
    "Which events are full?",
    "What's happening today?",
    "Any design events?",
  ],
  admin: [
    "Which events are full?",
    "What's happening today?",
    "Any hackathons coming up?",
  ],
};

export default function Assistant({ state, onClose, onOpen }) {
  const free = freeFor(state);
  const [messages, setMessages] = useState([
      {
        role: "assistant",
        text:
          state.user.role === "student"
            ? `Hi ${state.user.firstName}, you have ${free.minutes} free minutes before your next plan. Ask about your break, events, waitlists, or your passport.`
            : `Hi ${state.user.firstName}. Ask about today's events, what's full, or what's coming up.`,
      },
    ]),
    [input, setInput] = useState(""),
    [busy, setBusy] = useState(false);
  const log = useRef(null),
    controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const ask = async (question) => {
    const text = question.trim();
    if (busy || !text) return;
    setInput("");
    setBusy(true);
    const history = messages
      .slice(1)
      .filter((m) => !m.error)
      .map(({ role, text }) => ({ role, text }));
    setMessages((m) => [...m, { role: "user", text }]);
    try {
      const reply = await api.ask(text, history);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: reply.reply,
          event: state.events.find((e) => e.id === reply.eventId),
          source: reply.source,
          notice: reply.notice,
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: e.message, error: true },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title="Your campus, a little clearer" onClose={onClose}>
      <p className="small-text muted assistant-disclaimer">
        <Icon name="spark" size={15} />
        {state.ai.enabled
          ? `Claude answers from your timetable and live campus data.`
          : "Rule-based answers from your timetable and live campus data. Add an API key on the server to enable Claude."}
      </p>
      <div
        className="chat-log"
        ref={log}
        role="log"
        aria-label="Campus assistant conversation"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            className={`chat-message ${m.role} ${m.error ? "error" : ""}`}
            key={i}
          >
            {m.role === "assistant" && (
              <span className="assistant-orb small" aria-hidden="true">
                <Icon name={m.error ? "warning" : "spark"} size={14} />
              </span>
            )}
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
                  Open {m.event.title} <Icon name="arrow" size={15} />
                </button>
              )}
              {m.source && (
                <small className="muted">
                  {m.source === "claude" ? "Answered by Claude" : "Rule-based answer"}
                  {m.notice ? ` · ${m.notice}` : ""}
                </small>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="chat-message assistant typing" aria-label="Thinking">
            <span className="assistant-orb small" aria-hidden="true">
              <Icon name="spark" size={14} />
            </span>
            <span className="typing-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>
      <div className="chat-suggestions">
        {SUGGESTIONS[state.user.role].map((q) => (
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
          className="icon-button send"
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
