import Icon from "./Icon";
import Art from "./Art";
import Counter from "./Counter";
import { clock, dateLabel, DEMO_DATE, fitFor } from "../data/campus";

export default function EventCard({
  event,
  state,
  onOpen,
  featured = false,
  index = 0,
}) {
  const registration = state.registrations.find((r) => r.eventId === event.id),
    fit = fitFor(state, event),
    seats = Math.max(0, event.capacity - event.registered),
    fill = Math.min(100, (event.registered / event.capacity) * 100);
  return (
    <article
      className={`event-card glass ${featured ? "featured" : ""} tone-${event.color}`}
      style={{ "--i": index }}
    >
      <button
        className={`event-art ${event.color}`}
        onClick={() => onOpen(event)}
        aria-label={`View ${event.title}`}
        tabIndex={-1}
      >
        <Art kind={event.art} />
        <span className="category-tag">{event.category}</span>
        <span className="match-tag">
          <Icon name="spark" size={12} />
          {event.score}% match
        </span>
      </button>
      <div className="event-card-content">
        <div className="event-host">
          <span>{event.club}</span>
          <span className={event.date === DEMO_DATE ? "today-tag" : ""}>
            {event.date === DEMO_DATE ? "Today" : dateLabel(event.date)}
          </span>
        </div>
        <h3>
          <button onClick={() => onOpen(event)}>{event.title}</button>
        </h3>
        <div className="event-meta">
          <span>
            <Icon name="clock" size={15} />
            {clock(event.start)}–{clock(event.end)}
          </span>
          <span>
            <Icon name="pin" size={15} />
            {event.walk} min walk
          </span>
        </div>
        <p className={`fit-line ${fit.ok ? "fits" : "conflict"}`}>
          <Icon name={fit.ok ? "check" : "warning"} size={14} />
          {registration
            ? registration.status === "waitlisted"
              ? `Waitlist #${registration.position}`
              : registration.attended
                ? "Attended · on your passport"
                : "You’re in"
            : fit.ok
              ? "Fits your day"
              : fit.reason}
        </p>
        <div className="seat-meter" aria-hidden="true">
          <i style={{ "--fill": `${fill}%` }} />
        </div>
        <div className="event-bottom">
          <span className="small-text muted">
            {seats > 0 ? (
              <>
                <Counter value={seats} /> of {event.capacity} seats left
              </>
            ) : (
              <>
                Full · <Counter value={event.waitlist} /> waiting
              </>
            )}
          </span>
          <button
            className={`button small ${registration ? "secondary" : ""}`}
            onClick={() => onOpen(event)}
          >
            {registration
              ? registration.status === "waitlisted"
                ? "In the queue"
                : "View ticket"
              : seats === 0
                ? "Join waitlist"
                : "Take a look"}
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
