import { useState } from "react";
import Icon from "../components/Icon";
import {
  DEMO_DATE,
  clock,
  dateLabel,
  timetable,
  calendarFile,
  downloadFile,
} from "../data/campus";
export default function Schedule({ state, onOpen, navigate }) {
  const [date, setDate] = useState(DEMO_DATE);
  const selected = state.registrations
    .map((r) => ({
      ...state.events.find((e) => e.id === r.eventId),
      registration: r,
    }))
    .filter((e) => e.id);
  const items = [
    ...timetable
      .filter((t) => t.date === date)
      .map((t) => ({ ...t, type: "class" })),
    ...selected
      .filter((e) => e.date === date && e.registration.status === "registered")
      .map((e) => ({ ...e, type: "event" })),
  ].sort((a, b) => a.start - b.start);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            A day with a little more you<span className="mint-text">.</span>
          </h1>
          <p className="muted">
            Your classes and your possibilities, in one place.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => navigate("explore")}
        >
          <Icon name="plus" size={17} />
          Find something to add
        </button>
      </div>
      <div className="schedule-layout">
        <section className="glass schedule-panel">
          <div className="section-heading">
            <h2>Your timeline</h2>
            <label className="date-picker">
              Day
              <input
                aria-label="Timeline date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <div className="timeline">
            {items.map((item, i) => (
              <div className={`timeline-item ${item.type}`} key={item.id}>
                <div className="timeline-time">
                  {clock(item.start)}
                  <span>{clock(item.end)}</span>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-detail">
                  <span className="small-text muted">
                    {item.type === "class" ? "CLASS" : item.club.toUpperCase()}
                  </span>
                  <h3>{item.title}</h3>
                  <p>
                    <Icon name="pin" size={14} />
                    {item.venue}
                  </p>
                  {item.type === "event" && (
                    <button
                      className="text-button mint-text"
                      onClick={() => onOpen(item)}
                    >
                      View my ticket <Icon name="arrow" size={14} />
                    </button>
                  )}
                </div>
                {i < items.length - 1 &&
                  items[i + 1].start - item.end >= 20 && (
                    <div className="timeline-gap">
                      <Icon name="spark" size={15} />
                      {items[i + 1].start - item.end} minutes of possibility
                      <button
                        onClick={() => navigate("explore", { free: true })}
                      >
                        Explore <Icon name="arrow" size={13} />
                      </button>
                    </div>
                  )}
              </div>
            ))}
            {!items.length && (
              <div className="empty-state">
                <Icon name="calendar" size={32} />
                <h3>A blank page in your week.</h3>
                <p>No demo classes or registrations on this date.</p>
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
                    className={`pill ${e.registration.status === "waitlisted" ? "peach-text" : "mint-text"}`}
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
                        aria-label={`Download calendar for ${e.title}`}
                        onClick={() =>
                          downloadFile(
                            `${e.id}.ics`,
                            calendarFile(e),
                            "text/calendar",
                          )
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
                <p>
                  Your next opportunity is waiting. Save a seat to see it here.
                </p>
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
              Every fit check includes the event time, your classes, your other
              registrations, and walking time. The demo clock is fixed at 12:20
              PM.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
