import Dialog from "./Dialog";
import Art from "./Art";
import Icon from "./Icon";
import Counter from "./Counter";
import {
  clock,
  dateLabel,
  fitFor,
  recommendationReasons,
  calendarFile,
  downloadFile,
} from "../data/campus";

export default function EventDetails({
  event,
  state,
  busy,
  onClose,
  onRegister,
  onCancel,
}) {
  const registration = state.registrations.find((r) => r.eventId === event.id),
    fit = fitFor(state, event),
    student = state.user.role === "student",
    seats = Math.max(0, event.capacity - event.registered);
  return (
    <Dialog title="An opportunity in your orbit" onClose={onClose} wide>
      <div className={`detail-art ${event.color}`}>
        <Art kind={event.art} />
        <span>
          {event.category} · {event.club}
        </span>
        {event.source === "poster" && (
          <span className="source-tag">From a poster</span>
        )}
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
          <span>
            {seats ? (
              <>
                <Counter value={seats} /> seats left
              </>
            ) : (
              <>
                Full · <Counter value={event.waitlist} /> waiting
              </>
            )}{" "}
            · Years {event.years.join(", ")}
          </span>
        </span>
      </div>
      {student && (
        <div className={`feasibility ${fit.ok || registration ? "fits" : "conflict"}`}>
          <Icon name={fit.ok || registration ? "check" : "warning"} />
          <div>
            <strong>
              {registration
                ? "It’s in your plans."
                : fit.ok
                  ? "You can make it."
                  : "A little overlap to consider."}
            </strong>
            <p>
              {registration
                ? "Checked against your timetable when you registered."
                : fit.reason}
            </p>
            {fit.ok && !registration && (
              <p>
                Ends at {clock(event.end)}. Allow {event.walk} minutes to walk
                to your next stop.
              </p>
            )}
          </div>
        </div>
      )}
      {student && (
        <details className="why-match" open>
          <summary>
            <Icon name="spark" size={16} />
            Why this is a {event.score}% match
          </summary>
          <ul>
            {recommendationReasons(event, state).map((reason) => (
              <li key={reason}>
                <Icon name="check" size={14} />
                {reason}
              </li>
            ))}
          </ul>
        </details>
      )}
      {!student ? (
        <p className="small-text muted staff-note">
          <Icon name="grid" size={15} />
          You’re viewing as {state.user.role}. Manage seats and check-ins in the
          event workspace.
        </p>
      ) : registration ? (
        <div className={`ticket ${registration.status}`}>
          <div className="ticket-stub" aria-hidden="true">
            <Icon name={registration.attended ? "shield" : "check"} size={22} />
          </div>
          <div>
            <strong>
              {registration.status === "waitlisted"
                ? `You’re on the waitlist · position #${registration.position}`
                : registration.attended
                  ? "Attendance verified · passport updated"
                  : "You’re in. See you there."}
            </strong>
            <p className="muted">
              {registration.status === "waitlisted"
                ? "When a seat opens, the queue moves up automatically and you’ll be confirmed in order."
                : `Ticket CC-${event.id.slice(0, 8).toUpperCase()}-${state.user.usn.slice(-3) || state.user.initials}`}
            </p>
            <div className="action-row">
              {registration.status === "registered" && (
                <button
                  className="button secondary small"
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
              {!registration.attended && (
                <button
                  className="text-button coral-text"
                  disabled={busy}
                  onClick={() => onCancel(event)}
                >
                  Cancel{" "}
                  {registration.status === "waitlisted"
                    ? "waitlist spot"
                    : "registration"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="action-row">
          <button
            className="button"
            disabled={!fit.ok || busy}
            onClick={() => onRegister(event)}
          >
            {busy ? "Saving…" : seats === 0 ? "Join the waitlist" : "Save my seat"}
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
