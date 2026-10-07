import { useState } from "react";
import Icon from "../components/Icon";
import Dialog from "../components/Dialog";
import Counter from "../components/Counter";
import { DEMO_DATE, clock, dateLabel, toMinutes } from "../data/campus";
import { api } from "../api/client";

// First and last name, skipping honorifics; matches the API's initials.
const initials = (name) => {
  const parts = name.split(/\s+/).filter((n) => n && !n.endsWith("."));
  return [parts[0], parts.length > 1 ? parts.at(-1) : ""]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("");
};

function FeedbackDigest({ state, event }) {
  const [summary, setSummary] = useState(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const average = state.feedbacks.length
    ? state.feedbacks.reduce((a, b) => a + b.rating, 0) / state.feedbacks.length
    : 0;
  const load = async (scope) => {
    setLoading(true);
    setError("");
    try {
      setSummary({ ...(await api.feedbackSummary(scope)), scope });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="organizer-learning glass">
      <div className="learning-head">
        <span className="note-icon violet">
          <Icon name="chat" />
        </span>
        <div>
          <h2>Listen, then make the next one better.</h2>
          <p className="muted">
            {state.feedbacks.length
              ? `${state.feedbacks.length} reflection${state.feedbacks.length === 1 ? "" : "s"} across campus · average ${average.toFixed(1)}/5`
              : "Reflections appear here after students share takeaways from their passport."}
          </p>
        </div>
        <div className="action-row">
          <button
            className="button small secondary"
            disabled={loading || !state.feedbacks.length}
            onClick={() => load()}
          >
            <Icon name="spark" size={15} />
            {loading && !summary?.scope ? "Summarising…" : "Summarise all"}
          </button>
          <button
            className="text-button"
            disabled={loading}
            onClick={() => load(event.id)}
          >
            This event only
          </button>
        </div>
      </div>
      {error && (
        <p className="form-error" role="alert">
          <Icon name="warning" size={16} /> {error}
        </p>
      )}
      {summary && (
        <div className="digest">
          <p className="digest-summary">
            <span className={`source-badge ${summary.source}`}>
              {summary.source === "claude" ? "Claude" : "Rule-based"}
            </span>
            {summary.summary}
          </p>
          <div className="digest-columns">
            <div>
              <h3 className="mint-text">What worked</h3>
              {summary.strengths.length ? (
                <ul>
                  {summary.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted small-text">Nothing stood out yet.</p>
              )}
            </div>
            <div>
              <h3 className="coral-text">What to improve</h3>
              {summary.improvements.length ? (
                <ul>
                  {summary.improvements.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted small-text">No concerns raised.</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="quote-rail">
        {state.feedbacks.slice(0, 6).map((f) => (
          <blockquote key={`${f.name}-${f.id}`} className={f.sentiment}>
            <p>“{f.comment}”</p>
            <footer>
              {f.name} · {f.title} · {f.rating}/5
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function CreateEvent({ busy, onCreate, onClose }) {
  const [error, setError] = useState("");
  return (
    <Dialog title="Make room for a new idea" onClose={onClose} wide>
      <form
        className="form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          if (toMinutes(f.end) <= toMinutes(f.start) || f.deadline > f.date) {
            setError(
              "End time must follow the start, and the deadline must be on or before the event date.",
            );
            return;
          }
          const years = [1, 2, 3, 4].filter((y) => f[`year${y}`]);
          if (!years.length) return setError("Open the event to at least one year.");
          const ok = await onCreate({
            title: f.title,
            club: f.club,
            category: f.category,
            date: f.date,
            start: toMinutes(f.start),
            end: toMinutes(f.end),
            deadline: f.deadline,
            venue: f.venue,
            capacity: Number(f.capacity),
            walk: Number(f.walk),
            description: f.description,
            tags: f.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            years,
          });
          if (ok) onClose();
        }}
      >
        <label>
          Give it a name
          <input
            name="title"
            required
            maxLength="100"
            placeholder="The next thing worth showing up for"
          />
        </label>
        <div className="form-grid">
          <label>
            Community
            <input name="club" required defaultValue="CodeCraft" maxLength="60" />
          </label>
          <label>
            Category
            <select name="category">
              <option>Technology</option>
              <option>Hackathons</option>
              <option>Design</option>
              <option>Culture</option>
              <option>Career</option>
              <option>Sports</option>
            </select>
          </label>
          <label>
            Date
            <input name="date" required type="date" min={DEMO_DATE} defaultValue="2026-10-09" />
          </label>
          <label>
            Registration deadline
            <input name="deadline" required type="date" min={DEMO_DATE} defaultValue="2026-10-08" />
          </label>
          <label>
            Starts
            <input name="start" required type="time" defaultValue="16:00" />
          </label>
          <label>
            Ends
            <input name="end" required type="time" defaultValue="17:00" />
          </label>
          <label>
            Seats
            <input name="capacity" required type="number" min="1" max="5000" defaultValue="50" />
          </label>
          <label>
            Walking time (minutes)
            <input name="walk" required type="number" min="0" max="60" defaultValue="5" />
          </label>
        </div>
        <label>
          Venue
          <input name="venue" required maxLength="100" placeholder="Where the ideas happen" />
        </label>
        <label>
          Skills it builds <span className="optional">comma-separated</span>
          <input name="tags" maxLength="200" placeholder="AI / ML, Web development" />
        </label>
        <fieldset className="day-picker">
          <legend>Open to</legend>
          {[1, 2, 3, 4].map((y) => (
            <label key={y} className="check-chip">
              <input type="checkbox" name={`year${y}`} defaultChecked />
              <span>Year {y}</span>
            </label>
          ))}
        </fieldset>
        <label>
          What’s the experience?
          <textarea name="description" required maxLength="1000" rows="3" />
        </label>
        {error && (
          <p className="form-error" role="alert">
            <Icon name="warning" size={16} />
            {error}
          </p>
        )}
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Publishing…" : "Publish event"} <Icon name="arrow" size={17} />
        </button>
      </form>
    </Dialog>
  );
}

export default function Organizer({
  state,
  busy,
  onCreate,
  onDelete,
  onAttendance,
  onReleaseSeat,
  navigate,
}) {
  const [selected, setSelected] = useState("agent"),
    [create, setCreate] = useState(false),
    [confirmDelete, setConfirmDelete] = useState(false);
  const event = state.events.find((e) => e.id === selected) || state.events[0];
  if (!event)
    return (
      <div className="empty-state glass">
        <Icon name="calendar" size={32} />
        <h2>No events yet.</h2>
        <button className="button" onClick={() => setCreate(true)}>
          Create the first one
        </button>
        {create && (
          <CreateEvent busy={busy} onCreate={onCreate} onClose={() => setCreate(false)} />
        )}
      </div>
    );
  const roster = state.rosters[event.id] || [];
  const confirmed = roster.filter((p) => p.status === "registered");
  const queue = roster.filter((p) => p.status === "waitlisted");
  const present = confirmed.filter((p) => p.attended).length;
  const predicted = Math.round(event.registered * 0.82),
    noShows = event.registered - predicted;
  const bar = (n) => `${Math.min((n / event.capacity) * 100, 100)}%`;

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Bring your campus together<span className="accent-dot">.</span>
          </h1>
          <p className="muted">From a spark of an idea to a room full of people.</p>
        </div>
        <div className="action-row">
          <button className="button secondary" onClick={() => navigate("poster")}>
            <Icon name="poster" size={17} />
            From a poster
          </button>
          <button className="button" onClick={() => setCreate(true)}>
            <Icon name="plus" size={17} />
            Create an event
          </button>
        </div>
      </div>
      <div className="event-switcher" role="tablist" aria-label="Your events">
        {state.events.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={e.id === event.id}
            className={`switch-tab tone-${e.color} ${e.id === event.id ? "active" : ""}`}
            onClick={() => setSelected(e.id)}
          >
            <i aria-hidden="true" />
            <span>
              {e.title}
              <small>
                {dateLabel(e.date)} · {clock(e.start)}
              </small>
            </span>
          </button>
        ))}
      </div>
      <div className="organizer-layout" key={event.id}>
        <section className="glass forecast-panel">
          <div className="section-heading">
            <div>
              <h2>{event.title}</h2>
              <p className="muted">
                {dateLabel(event.date)} · {clock(event.start)}–{clock(event.end)} ·{" "}
                {event.venue}
              </p>
            </div>
            <button
              className="icon-button"
              aria-label={`Remove ${event.title}`}
              title="Remove event"
              onClick={() => setConfirmDelete(true)}
            >
              <Icon name="trash" size={17} />
            </button>
          </div>
          <div className="forecast-chart">
            {[
              ["capacity", "Capacity", event.capacity, "100%"],
              ["registered", "Registered", event.registered, bar(event.registered)],
              ["predicted", "Expected turnout", predicted, bar(predicted)],
              ["waitlist", "Waitlist", event.waitlist, bar(event.waitlist)],
            ].map(([key, label, value, width]) => (
              <div className={`forecast-${key}`} key={key}>
                <span>{label}</span>
                <div>
                  <i style={{ "--fill": width }} />
                </div>
                <strong>
                  <Counter value={value} />
                  {key === "predicted" && <small> ± 6</small>}
                </strong>
              </div>
            ))}
          </div>
          <div className="forecast-insight">
            <Icon name="spark" />
            <p>
              About <strong>{noShows} registered students</strong> may not attend.
              Ask for confirmations and fill released seats from the waitlist.
            </p>
          </div>
          <p className="small-text muted">
            Projection: 82% of registrations with an illustrative ±6 range, not a
            trained model.
          </p>
        </section>
        <section className="glass waitlist-panel">
          <div className="waitlist-head">
            <h2>Keep good seats from going empty.</h2>
            <span className="pill violet">
              <Counter value={event.waitlist} /> in queue
            </span>
          </div>
          <ol className="queue">
            {Array.from({ length: Math.min(event.waitlist, 8) }, (_, i) => {
              const person = queue.find((p) => p.position === i + 1);
              return (
                <li key={i} className={person ? "named" : ""}>
                  <span className="queue-pos">#{i + 1}</span>
                  {person ? (
                    <>
                      <span className="avatar small-avatar">{initials(person.name)}</span>
                      <span>
                        <strong>{person.name}</strong>
                        <small>{person.detail}</small>
                      </span>
                    </>
                  ) : (
                    <span className="muted small-text">Registered at the desk</span>
                  )}
                </li>
              );
            })}
            {event.waitlist > 8 && (
              <li className="muted small-text">+{event.waitlist - 8} more</li>
            )}
            {!event.waitlist && (
              <li className="queue-empty muted">
                No one is waiting. Every open seat is a new possibility.
              </li>
            )}
          </ol>
          <button
            className="button secondary"
            disabled={busy || event.registered === 0}
            onClick={() => onReleaseSeat(event)}
          >
            <Icon name="refresh" size={16} /> Release a desk seat
          </button>
          <p className="small-text muted">
            Simulates a cancellation from someone who registered at the desk. The
            next person in line is confirmed automatically.
          </p>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <h2>Good to see you here</h2>
          <p className="muted">
            Check in attendees. Each check-in writes a verified activity to their
            skill passport.
          </p>
        </div>
        <span className="pill mint">
          <Icon name="check" size={15} />
          <Counter value={present} /> of {confirmed.length} checked in
        </span>
      </div>
      <section className="glass roster">
        <div className="roster-heading">
          <span>Attendee</span>
          <span>Check-in</span>
        </div>
        {confirmed.map((person, i) => (
          <div className="roster-row" key={person.id} style={{ "--i": i }}>
            <span className={`avatar ${person.attended ? "verified" : ""}`}>
              {initials(person.name)}
            </span>
            <div>
              <strong>{person.name}</strong>
              <p className="muted small-text">{person.detail}</p>
            </div>
            <button
              className={`button small ${person.attended ? "secondary" : ""}`}
              aria-pressed={person.attended}
              disabled={busy}
              onClick={() => onAttendance(event, person.id, !person.attended)}
            >
              <Icon name={person.attended ? "check" : "plus"} size={15} />
              {person.attended ? "Present · undo" : "Mark present"}
            </button>
          </div>
        ))}
        {!confirmed.length && (
          <div className="empty-state compact">
            <Icon name="users" size={26} />
            <p>
              No app registrations for this event yet. Students who save a seat
              appear here.
            </p>
          </div>
        )}
        <p className="small-text muted roster-footnote">
          {event.registered - confirmed.length > 0 &&
            `${event.registered - confirmed.length} more attendees registered at the desk. `}
          Only app registrations can be checked in here.
        </p>
      </section>
      <FeedbackDigest state={state} event={event} />
      {create && (
        <CreateEvent busy={busy} onCreate={onCreate} onClose={() => setCreate(false)} />
      )}
      {confirmDelete && (
        <Dialog title="Remove this event?" onClose={() => setConfirmDelete(false)}>
          <p className="muted">
            <strong>{event.title}</strong> and its {confirmed.length + queue.length} app
            registrations will be removed. Passport records already earned stay.
          </p>
          <div className="action-row">
            <button
              className="button danger"
              disabled={busy}
              onClick={async () => {
                if (await onDelete(event)) {
                  setConfirmDelete(false);
                  setSelected(state.events.find((e) => e.id !== event.id)?.id);
                }
              }}
            >
              Remove event
            </button>
            <button className="button secondary" onClick={() => setConfirmDelete(false)}>
              Keep it
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
