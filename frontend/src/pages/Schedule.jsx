import { useState } from "react";
import Icon from "../components/Icon";
import Dialog from "../components/Dialog";
import {
  DEMO_DATE,
  DAYS,
  clock,
  dateLabel,
  classesOn,
  calendarFile,
  downloadFile,
} from "../data/campus";

function ClassEditor({ state, busy, onAddClass, onRemoveClass, onClose }) {
  const [days, setDays] = useState([3]);
  const [error, setError] = useState("");
  const sorted = [...state.timetable].sort(
    (a, b) => a.days[0] - b.days[0] || a.start - b.start,
  );
  return (
    <Dialog title="Your weekly timetable" onClose={onClose} wide>
      <p className="muted">
        Every fit check uses these classes, including walking time before and
        after events.
      </p>
      <div className="class-list">
        {sorted.map((c) => (
          <div className="class-row" key={c.id}>
            <span className="class-days">
              {c.days.map((d) => DAYS[d]).join(" · ")}
            </span>
            <div>
              <strong>{c.title}</strong>
              <small>
                {clock(c.start)}–{clock(c.end)}
                {c.venue ? ` · ${c.venue}` : ""}
              </small>
            </div>
            <button
              className="icon-button"
              disabled={busy}
              aria-label={`Remove ${c.title} on ${c.days.map((d) => DAYS[d]).join(", ")}`}
              onClick={() => onRemoveClass(c.id)}
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        ))}
        {!sorted.length && (
          <p className="muted small-text">No classes yet. Add your first below.</p>
        )}
      </div>
      <form
        className="form-stack class-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = Object.fromEntries(new FormData(form));
          if (!days.length) return setError("Choose at least one day.");
          if (f.end <= f.start) return setError("A class must end after it starts.");
          setError("");
          if (await onAddClass({ ...f, days })) form.reset();
        }}
      >
        <h3>Add a class</h3>
        <div className="form-grid">
          <label>
            Class
            <input name="title" required maxLength="80" placeholder="Machine learning" />
          </label>
          <label>
            Room <span className="optional">optional</span>
            <input name="venue" maxLength="80" placeholder="Block A · 204" />
          </label>
          <label>
            Starts
            <input name="start" type="time" required defaultValue="10:00" />
          </label>
          <label>
            Ends
            <input name="end" type="time" required defaultValue="11:00" />
          </label>
        </div>
        <fieldset className="day-picker">
          <legend>Meets on</legend>
          {DAYS.map((d, i) => {
            const on = days.includes(i);
            return (
              <button
                type="button"
                key={d}
                aria-pressed={on}
                className={on ? "active" : ""}
                onClick={() =>
                  setDays(on ? days.filter((x) => x !== i) : [...days, i])
                }
              >
                {d}
              </button>
            );
          })}
        </fieldset>
        {error && (
          <p className="form-error" role="alert">
            <Icon name="warning" size={16} />
            {error}
          </p>
        )}
        <button className="button" type="submit" disabled={busy}>
          <Icon name="plus" size={16} /> Add to my timetable
        </button>
      </form>
    </Dialog>
  );
}

export default function Schedule({
  state,
  onOpen,
  navigate,
  busy,
  onAddClass,
  onRemoveClass,
}) {
  const [date, setDate] = useState(DEMO_DATE),
    [editing, setEditing] = useState(false);
  const selected = state.registrations
    .map((r) => ({
      ...state.events.find((e) => e.id === r.eventId),
      registration: r,
    }))
    .filter((e) => e.id)
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  const items = [
    ...classesOn(state.timetable, date).map((t) => ({ ...t, type: "class" })),
    ...selected
      .filter((e) => e.date === date && e.registration.status === "registered")
      .map((e) => ({ ...e, type: "event" })),
  ].sort((a, b) => a.start - b.start);
  const shift = (days) => {
    const d = new Date(`${date}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    setDate(d.toISOString().slice(0, 10));
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            A day with a little more you<span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            Your classes and your possibilities, in one place.
          </p>
        </div>
        <div className="action-row">
          <button className="button secondary" onClick={() => setEditing(true)}>
            <Icon name="book" size={17} />
            Edit timetable
          </button>
          <button className="button" onClick={() => navigate("explore")}>
            <Icon name="plus" size={17} />
            Find something
          </button>
        </div>
      </div>
      <div className="schedule-layout">
        <section className="glass schedule-panel">
          <div className="section-heading">
            <h2>
              {new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>
            <div className="date-stepper">
              <button
                className="icon-button"
                aria-label="Previous day"
                onClick={() => shift(-1)}
              >
                <Icon name="chevron" size={16} style={{ transform: "scaleX(-1)" }} />
              </button>
              <input
                aria-label="Timeline date"
                type="date"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
              />
              <button
                className="icon-button"
                aria-label="Next day"
                onClick={() => shift(1)}
              >
                <Icon name="chevron" size={16} />
              </button>
            </div>
          </div>
          <div className="timeline" key={date}>
            {items.map((item, i) => (
              <div
                className={`timeline-item ${item.type}`}
                key={`${item.type}-${item.id}`}
                style={{ "--i": i }}
              >
                <div className="timeline-time">
                  {clock(item.start)}
                  <span>{clock(item.end)}</span>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-detail">
                  <span className="timeline-kind">
                    {item.type === "class" ? "Class" : item.club}
                  </span>
                  <h3>{item.title}</h3>
                  {item.venue && (
                    <p>
                      <Icon name="pin" size={14} />
                      {item.venue}
                    </p>
                  )}
                  {item.type === "event" && (
                    <button
                      className="text-button mint-text"
                      onClick={() => onOpen(item)}
                    >
                      View my ticket <Icon name="arrow" size={14} />
                    </button>
                  )}
                </div>
                {i < items.length - 1 && items[i + 1].start - item.end >= 20 && (
                  <div className="timeline-gap">
                    <Icon name="spark" size={15} />
                    {items[i + 1].start - item.end} minutes of possibility
                    {date === DEMO_DATE && (
                      <button onClick={() => navigate("explore", { free: true })}>
                        Explore <Icon name="arrow" size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {!items.length && (
              <div className="empty-state">
                <Icon name="calendar" size={32} />
                <h3>A blank page in your week.</h3>
                <p>No classes or registrations on this date.</p>
              </div>
            )}
          </div>
        </section>
        <aside>
          <div className="glass planned-panel">
            <h2>In your plans</h2>
            <p className="muted">The things you said yes to.</p>
            {selected.length ? (
              selected.map((e) => (
                <div className="planned-event" key={e.id}>
                  <span
                    className={`pill ${e.registration.status === "waitlisted" ? "coral" : "mint"}`}
                  >
                    {e.registration.status === "waitlisted"
                      ? `Waitlist #${e.registration.position}`
                      : e.registration.attended
                        ? "Attended"
                        : "You’re in"}
                  </span>
                  <h3>
                    <button onClick={() => onOpen(e)}>{e.title}</button>
                  </h3>
                  <p className="muted small-text">
                    {dateLabel(e.date)} · {clock(e.start)} · {e.venue}
                  </p>
                  <div className="action-row">
                    <button className="text-button" onClick={() => onOpen(e)}>
                      Manage <Icon name="arrow" size={14} />
                    </button>
                    {e.registration.status === "registered" && (
                      <button
                        className="icon-button"
                        aria-label={`Download calendar file for ${e.title}`}
                        onClick={() =>
                          downloadFile(`${e.id}.ics`, calendarFile(e), "text/calendar")
                        }
                      >
                        <Icon name="download" size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state compact">
                <Icon name="calendar" size={28} />
                <p>Your next opportunity is waiting. Save a seat to see it here.</p>
                <button
                  className="text-button mint-text"
                  onClick={() => navigate("explore")}
                >
                  Find my first one <Icon name="arrow" size={15} />
                </button>
              </div>
            )}
          </div>
          <div className="schedule-note">
            <Icon name="clock" />
            <p>
              Fit checks cover event time, your {state.timetable.length} weekly
              classes, your other registrations, and walking time. The campus
              clock is fixed at 12:20 on Wednesday 7 October for the demo.
            </p>
          </div>
        </aside>
      </div>
      {editing && (
        <ClassEditor
          state={state}
          busy={busy}
          onAddClass={onAddClass}
          onRemoveClass={onRemoveClass}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
