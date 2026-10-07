import Dialog from "./Dialog";
import Art from "./Art";
import Icon from "./Icon";
import {
  clock,
  dateLabel,
  feasibility,
  recommendationReasons,
  calendarFile,
  downloadFile,
} from "../data/campus";
export default function EventDetails({
  event,
  state,
  onClose,
  onRegister,
  onCancel,
}) {
  const registration = state.registrations.find((r) => r.eventId === event.id),
    fit = feasibility(event, state.registrations, state.events);
  return (
    <Dialog title="An opportunity in your orbit" onClose={onClose} wide>
      <div className={`detail-art ${event.color}`}>
        <Art kind={event.art} />
        <span>
          {event.category} / {event.club}
        </span>
      </div>
      <h3 className="detail-title">{event.title}</h3>
      <p className="muted">{event.description}</p>
      <div className="detail-meta">
        <span>
          <Icon name="calendar" />
          {dateLabel(event.date)} · {clock(event.start)}–{clock(event.end)}
        </span>
        <span>
          <Icon name="pin" />
          {event.venue} · {event.walk} min walk
        </span>
        <span>
          <Icon name="users" />
          {Math.max(0, event.capacity - event.registered)} seats left · Years{" "}
          {event.years.join(", ")}
        </span>
      </div>
      <div className={`feasibility ${fit.ok ? "fits" : "conflict"}`}>
        <Icon name={fit.ok ? "check" : "warning"} />
        <div>
          <strong>
            {fit.ok ? "You can make it." : "A little overlap to consider."}
          </strong>
          <p>{fit.reason}</p>
          {fit.ok && (
            <p>
              Session ends at {clock(event.end)}. Allow {event.walk} minutes to
              walk to your next stop.
            </p>
          )}
        </div>
      </div>
      <details className="why-match" open>
        <summary>
          <Icon name="spark" size={16} />
          Why this is a {event.score}% match
        </summary>
        <ul>
          {recommendationReasons(event).map((reason) => (
            <li key={reason}>
              <Icon name="check" size={14} />
              {reason}
            </li>
          ))}
        </ul>
        <small className="muted">
          Illustrative opportunity score; timetable checks use the local demo
          schedule.
        </small>
      </details>
      {registration ? (
        <div className="ticket-status">
          <strong className="mint-text">
            {registration.status === "waitlisted"
              ? `You’re on the waitlist · position #${registration.position}`
              : registration.attended
                ? "Attendance verified · passport updated"
                : "You’re in. See you there."}
          </strong>
          <p className="muted">
            {registration.status === "waitlisted"
              ? "When a seat opens, the organizer can promote the next person in line."
              : `Demo ticket CC-${event.id.toUpperCase()}-091. Manage your plan in My schedule.`}
          </p>
          <div className="action-row">
            {registration.status === "registered" && (
              <button
                className="button secondary"
                onClick={() =>
                  downloadFile(
                    `${event.id}.ics`,
                    calendarFile(event),
                    "text/calendar",
                  )
                }
              >
                Add to calendar <Icon name="download" size={16} />
              </button>
            )}
            <button
              className="text-button peach-text"
              disabled={registration.attended}
              onClick={() => onCancel(event)}
            >
              Cancel{" "}
              {registration.status === "waitlisted"
                ? "waitlist spot"
                : "registration"}
            </button>
          </div>
        </div>
      ) : (
        <div className="action-row">
          <button
            className="button"
            disabled={!fit.ok}
            onClick={() => onRegister(event)}
          >
            {event.registered >= event.capacity
              ? "Join the waitlist"
              : "Save my seat"}
            <Icon name="arrow" size={17} />
          </button>
          <span className="small-text muted">
            {!fit.ok
              ? "Find another event that fits your day."
              : `Registration closes ${dateLabel(event.deadline)}`}
          </span>
        </div>
      )}
    </Dialog>
  );
}
