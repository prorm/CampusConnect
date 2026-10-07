import Icon from "./Icon";
import Art from "./Art";
import { clock, dateLabel, DEMO_DATE, feasibility } from "../data/campus";
export default function EventCard({ event, state, onOpen, featured = false }) {
  const registration = state.registrations.find((r) => r.eventId === event.id),
    fit = feasibility(event, state.registrations, state.events);
  return (
    <article className={`event-card glass ${featured ? "featured" : ""}`}>
      <button
        className={`event-art ${event.color}`}
        onClick={() => onOpen(event)}
        aria-label={`View ${event.title}`}
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
          <span>
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
            {event.walk} min away
          </span>
        </div>
        <p className={`fit-line ${fit.ok ? "mint-text" : "peach-text"}`}>
          <Icon name={fit.ok ? "check" : "warning"} size={14} />
          {fit.ok ? "Fits your day" : "Schedule conflict"}
        </p>
        <div className="event-bottom">
          <span className="small-text muted">
            {event.capacity - event.registered > 0
              ? `${event.capacity - event.registered} seats available`
              : `${event.waitlist} on waitlist`}
          </span>
          <button
            className={`button small ${registration ? "secondary" : ""}`}
            onClick={() => onOpen(event)}
          >
            {registration
              ? registration.status === "waitlisted"
                ? "Waitlisted"
                : "View ticket"
              : event.registered >= event.capacity
                ? "Join waitlist"
                : "Take a look"}
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
