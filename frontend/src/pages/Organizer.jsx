import { useState } from "react";
import Icon from "../components/Icon";
import Dialog from "../components/Dialog";
import { DEMO_DATE, clock, dateLabel, student } from "../data/campus";
export default function Organizer({
  state,
  onCreate,
  onAttendance,
  onReleaseSeat,
  navigate,
}) {
  const [selected, setSelected] = useState("agent"),
    [create, setCreate] = useState(false),
    [error, setError] = useState("");
  const event = state.events.find((e) => e.id === selected) || state.events[0],
    registrations = state.registrations.filter((r) => r.eventId === event.id),
    present = Object.values(state.checkins?.[event.id] || {}).filter(
      Boolean,
    ).length;
  const predicted = Math.round(event.registered * 0.82),
    noShows = event.registered - predicted;
  const roster = [
    {
      id: "sinchana",
      name: "Sinchana Jeppu",
      detail: "Information Science · Year 3",
    },
    { id: "prajwal", name: "Prajwal N", detail: "Computer Science · Year 3" },
    ...registrations
      .filter((r) => r.status === "registered")
      .map(() => ({
        id: "pranav",
        name: student.name,
        detail: "Computer Science · Year 3",
      })),
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Bring your campus together<span className="mint-text">.</span>
          </h1>
          <p className="muted">
            From a spark of an idea to a room full of people.
          </p>
        </div>
        <div className="action-row">
          <button
            className="button secondary"
            onClick={() => navigate("poster")}
          >
            <Icon name="poster" size={17} />
            From a poster
          </button>
          <button className="button" onClick={() => setCreate(true)}>
            <Icon name="plus" size={17} />
            Create an event
          </button>
        </div>
      </div>
      <div className="organizer-select">
        <label htmlFor="managed-event">Your event</label>
        <select
          id="managed-event"
          value={event.id}
          onChange={(e) => setSelected(e.target.value)}
        >
          {state.events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <span className="muted small-text">
          {dateLabel(event.date)} · {clock(event.start)} · {event.venue}
        </span>
      </div>
      <div className="organizer-layout">
        <section className="glass forecast-panel">
          <div className="section-heading">
            <div>
              <h2>A clearer picture of the room</h2>
              <p className="muted">
                Plan for the people who’ll actually show up.
              </p>
            </div>
            <span className="pill">
              <Icon name="spark" size={14} />
              Illustrative forecast
            </span>
          </div>
          <div className="forecast-chart">
            <div className="forecast-capacity">
              <span>Capacity</span>
              <div>
                <i style={{ width: "100%" }} />
              </div>
              <strong>{event.capacity}</strong>
            </div>
            <div className="forecast-registered">
              <span>Registered</span>
              <div>
                <i
                  style={{
                    width: `${(event.registered / event.capacity) * 100}%`,
                  }}
                />
              </div>
              <strong>{event.registered}</strong>
            </div>
            <div className="forecast-predicted">
              <span>Expected turnout</span>
              <div>
                <i
                  style={{ width: `${(predicted / event.capacity) * 100}%` }}
                />
              </div>
              <strong>
                {predicted} <small>± 6</small>
              </strong>
            </div>
            <div className="forecast-waitlist">
              <span>Waitlist</span>
              <div>
                <i
                  style={{
                    width: `${Math.min((event.waitlist / event.capacity) * 100, 100)}%`,
                  }}
                />
              </div>
              <strong>{event.waitlist}</strong>
            </div>
          </div>
          <div className="forecast-insight">
            <Icon name="spark" />
            <p>
              About <strong>{noShows} registered students</strong> may not
              attend. Ask for confirmations and fill released seats from the
              waitlist.
            </p>
          </div>
          <p className="small-text muted">
            Demo projection: 82% of registrations, with an illustrative ±6
            range. No trained prediction model is connected.
          </p>
        </section>
        <section className="glass waitlist-panel">
          <Icon name="users" size={26} />
          <h2>
            Keep good seats
            <br />
            from going empty.
          </h2>
          <p className="muted">
            {event.waitlist
              ? `${event.waitlist} people are waiting for a chance to join.`
              : "No one is waiting yet. Every open seat is a new possibility."}
          </p>
          {registrations
            .filter((r) => r.status === "waitlisted")
            .map((r) => (
              <div className="waitlist-person" key={r.eventId}>
                <span className="avatar small-avatar">PM</span>
                <div>
                  <strong>Pranav R Mane</strong>
                  <small>Position #{r.position}</small>
                </div>
              </div>
            ))}
          <button
            className="button secondary"
            disabled={event.registered === 0}
            onClick={() => onReleaseSeat(event)}
          >
            Release one demo seat <Icon name="arrow" size={16} />
          </button>
          <p className="small-text muted">
            Simulates a cancellation. The next waitlisted person receives the
            seat; queue positions update automatically.
          </p>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <h2>Good to see you here</h2>
          <p className="muted">
            Check in attendees and connect participation to their passport.
          </p>
        </div>
        <span className="pill mint-text">
          <Icon name="check" size={15} />
          {present} checked in
        </span>
      </div>
      <section className="glass roster">
        <div className="roster-heading">
          <span>ATTENDEE</span>
          <span>LOCAL CHECK-IN</span>
        </div>
        {roster.map((person) => {
          const checked = !!state.checkins?.[event.id]?.[person.id];
          return (
            <div className="roster-row" key={person.id}>
              <span className="avatar">
                {person.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <strong>{person.name}</strong>
                <p className="muted small-text">{person.detail}</p>
              </div>
              <button
                className={`button small ${checked ? "secondary" : ""}`}
                aria-pressed={checked}
                onClick={() => onAttendance(event, person.id, !checked)}
              >
                <Icon name={checked ? "check" : "plus"} size={15} />
                {checked ? "Present · undo" : "Mark present"}
              </button>
            </div>
          );
        })}
        <p className="small-text muted roster-footnote">
          Demo manual check-in. Register as Pranav in Student view, then mark
          him present here to update his skill passport.
        </p>
      </section>
      <section className="organizer-learning">
        <Icon name="chat" />
        <div>
          <h3>Listen, then make the next one better.</h3>
          <p>
            {state.feedbacks?.length
              ? `${state.feedbacks.length} reflection${state.feedbacks.length === 1 ? "" : "s"} collected in this demo. Average rating: ${(state.feedbacks.reduce((a, b) => a + b.rating, 0) / state.feedbacks.length).toFixed(1)}/5.`
              : "Student reflections appear here after they share a takeaway from their passport."}
          </p>
          {state.feedbacks?.map((f, i) => (
            <blockquote key={i}>
              “{f.comment}” <span>— Pranav · {f.rating}/5</span>
            </blockquote>
          ))}
        </div>
      </section>
      {create && (
        <Dialog
          title="Make room for a new idea"
          onClose={() => {
            setCreate(false);
            setError("");
          }}
          wide
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = Object.fromEntries(new FormData(e.currentTarget));
              const parse = (t) => {
                const [h, m] = t.split(":").map(Number);
                return h * 60 + m;
              };
              if (parse(f.end) <= parse(f.start) || f.deadline > f.date) {
                setError(
                  "End time must follow the start, and the deadline must be on or before the event date.",
                );
                return;
              }
              onCreate({
                id: `event-${Date.now()}`,
                title: f.title,
                club: f.club,
                category: f.category,
                date: f.date,
                start: parse(f.start),
                end: parse(f.end),
                deadline: f.deadline,
                venue: f.venue,
                capacity: Number(f.capacity),
                registered: 0,
                waitlist: 0,
                walk: Number(f.walk),
                description: f.description,
                tags: [f.category],
                years: [1, 2, 3, 4],
                score: 80,
                friends: 0,
                color: "mint",
                art: "orbit",
              });
              setCreate(false);
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
                <input
                  name="club"
                  required
                  defaultValue="CodeCraft"
                  maxLength="60"
                />
              </label>
              <label>
                Category
                <select name="category">
                  <option>Technology</option>
                  <option>Hackathons</option>
                  <option>Design</option>
                  <option>Culture</option>
                  <option>Career</option>
                </select>
              </label>
              <label>
                Date
                <input
                  name="date"
                  required
                  type="date"
                  min={DEMO_DATE}
                  defaultValue="2026-10-09"
                />
              </label>
              <label>
                Registration deadline
                <input
                  name="deadline"
                  required
                  type="date"
                  min={DEMO_DATE}
                  defaultValue="2026-10-08"
                />
              </label>
              <label>
                Starts
                <input name="start" required type="time" defaultValue="13:00" />
              </label>
              <label>
                Ends
                <input name="end" required type="time" defaultValue="14:00" />
              </label>
              <label>
                Seats
                <input
                  name="capacity"
                  required
                  type="number"
                  min="1"
                  max="1000"
                  defaultValue="50"
                />
              </label>
              <label>
                Walking time (minutes)
                <input
                  name="walk"
                  required
                  type="number"
                  min="1"
                  max="30"
                  defaultValue="5"
                />
              </label>
            </div>
            <label>
              Venue
              <input
                name="venue"
                required
                maxLength="100"
                placeholder="Where the ideas happen"
              />
            </label>
            <label>
              What’s the experience?
              <textarea name="description" required maxLength="1000" rows="3" />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button" type="submit">
              Publish to the demo <Icon name="arrow" size={17} />
            </button>
          </form>
        </Dialog>
      )}
    </>
  );
}
