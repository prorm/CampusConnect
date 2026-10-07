import Icon from "../components/Icon";
import EventCard from "../components/EventCard";
import {
  DEMO_DATE,
  DEMO_NOW,
  clock,
  classesOn,
  fitFor,
  freeFor,
} from "../data/campus";

const DAY_START = 480,
  DAY_END = 1200;
const pct = (m) =>
  `${((Math.min(Math.max(m, DAY_START), DAY_END) - DAY_START) / (DAY_END - DAY_START)) * 100}%`;

function DayRibbon({ state, free }) {
  const classes = classesOn(state.timetable, DEMO_DATE);
  const events = state.registrations
    .filter((r) => r.status === "registered")
    .map((r) => state.events.find((e) => e.id === r.eventId))
    .filter((e) => e && e.date === DEMO_DATE);
  return (
    <div className="day-ribbon" aria-label="Your day from 08:00 to 20:00">
      <div className="ribbon-track">
        {free.minutes > 0 && (
          <span
            className="ribbon-free"
            style={{ left: pct(DEMO_NOW), width: `calc(${pct(free.until)} - ${pct(DEMO_NOW)})` }}
          >
            <span>{free.minutes} min free</span>
          </span>
        )}
        {classes.map((c) => (
          <span
            key={c.id}
            className="ribbon-block class"
            style={{ left: pct(c.start), width: `calc(${pct(c.end)} - ${pct(c.start)})` }}
            title={`${c.title} · ${clock(c.start)}–${clock(c.end)}`}
          />
        ))}
        {events.map((e) => (
          <span
            key={e.id}
            className="ribbon-block event"
            style={{ left: pct(e.start), width: `calc(${pct(e.end)} - ${pct(e.start)})` }}
            title={`${e.title} · ${clock(e.start)}–${clock(e.end)}`}
          />
        ))}
        <span className="ribbon-now" style={{ left: pct(DEMO_NOW) }}>
          <span>Now</span>
        </span>
      </div>
      <div className="ribbon-scale" aria-hidden="true">
        {[8, 10, 12, 14, 16, 18, 20].map((h) => (
          <span key={h} style={{ left: pct(h * 60) }}>
            {String(h).padStart(2, "0")}
          </span>
        ))}
      </div>
      <div className="ribbon-legend">
        <span>
          <i className="class" /> Class
        </span>
        <span>
          <i className="event" /> Your plans
        </span>
        <span>
          <i className="free" /> Free now
        </span>
      </div>
    </div>
  );
}

export default function Today({ state, navigate, onOpen }) {
  const free = freeFor(state);
  const hours = Math.floor(free.minutes / 60),
    minutes = free.minutes % 60;
  const duration =
    [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""]
      .filter(Boolean)
      .join(" ") || "0m";
  const picks = state.events
    .filter(
      (e) =>
        e.date === DEMO_DATE &&
        e.start >= DEMO_NOW &&
        e.end + e.walk <= free.until &&
        !state.registrations.some((r) => r.eventId === e.id) &&
        fitFor(state, e).ok,
    )
    .sort((a, b) => b.score - a.score);
  const conflict = state.events.find(
    (e) =>
      e.date === DEMO_DATE &&
      e.start >= DEMO_NOW &&
      !state.registrations.some((r) => r.eventId === e.id) &&
      fitFor(state, e).conflicts.length,
  );
  const deadline = state.events
    .filter((e) => e.deadline === DEMO_DATE && e.date > DEMO_DATE)
    .sort((a, b) => b.score - a.score)[0];
  const myCommunities = state.communities.filter((c) =>
    state.joined.includes(c.id),
  );
  const upcoming = state.registrations.filter((r) => r.status === "registered").length;

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Good afternoon, {state.user.firstName}
            <span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            Wednesday, 7 October · {upcoming
              ? `${upcoming} plan${upcoming === 1 ? "" : "s"} on your calendar.`
              : "A good day to discover something you didn’t know you needed."}
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => navigate("explore", { free: true })}
        >
          <Icon name="bolt" size={17} />I have free time
        </button>
      </div>

      <section className="today-window glass">
        <div className="window-copy">
          <p className="availability">
            <span className="live-dot" />
            {free.minutes ? "Free right now" : "In your plans right now"}
          </p>
          <h2>
            <span className="free-figure">{duration}</span>
            <span className="free-caption">
              {free.minutes ? "of room to explore." : "Your day is in motion."}
            </span>
          </h2>
          <p>
            {free.next?.type === "event"
              ? `Free until ${clock(free.until)}, when you leave for ${free.next.title}.`
              : free.next
                ? `Free until ${free.next.title} at ${clock(free.until)} · ${free.next.venue}.`
                : "No more classes today."}{" "}
            {picks.length
              ? `${picks.length} ${picks.length === 1 ? "opportunity fits" : "opportunities fit"} right in.`
              : ""}
          </p>
          <button className="text-button" onClick={() => navigate("schedule")}>
            See my whole day <Icon name="arrow" size={16} />
          </button>
        </div>
        <DayRibbon state={state} free={free} />
      </section>

      <div className="section-heading">
        <div>
          <h2>Right now, right for you</h2>
          <p className="muted">
            Picked around your interests, your timetable, and your next stop.
          </p>
        </div>
        <button className="text-button" onClick={() => navigate("explore")}>
          All opportunities <Icon name="arrow" size={17} />
        </button>
      </div>
      <div className="today-picks">
        {picks.slice(0, 2).map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            state={state}
            onOpen={onOpen}
            featured={i === 0}
            index={i}
          />
        ))}
        {!picks.length && (
          <div className="empty-state glass">
            <Icon name="calendar" size={32} />
            <h3>A little breathing room.</h3>
            <p>
              Nothing fits these {free.minutes} minutes. Your next plan is in
              your schedule; the week has more.
            </p>
            <button
              className="button secondary"
              onClick={() => navigate("explore")}
            >
              Explore the week
            </button>
          </div>
        )}
        <aside className="today-aside">
          <div className={`nudge glass ${conflict ? "warn" : "calm"}`}>
            <span className="nudge-icon">
              <Icon name={conflict ? "warning" : "check"} />
            </span>
            <h3>{conflict ? "A heads-up for your day" : "You’re clear"}</h3>
            <p>
              {conflict
                ? `${conflict.title} overlaps ${conflict.date === DEMO_DATE ? fitFor(state, conflict).conflicts[0].title : "a class"}. Your class comes first.`
                : "Everything you’ve planned fits around your classes."}
            </p>
            {conflict && (
              <button
                className="text-button coral-text"
                onClick={() => onOpen(conflict)}
              >
                See the overlap <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
          {deadline && (
            <div className="nudge deadline-nudge spot">
              <span className="deadline-chip">
                <Icon name="clock" size={13} /> Closes tonight
              </span>
              <h3>{deadline.title}</h3>
              <p>
                {deadline.registered >= deadline.capacity
                  ? `Full house, ${deadline.waitlist} in the queue. The waitlist moves in order.`
                  : `${deadline.capacity - deadline.registered} seats left.`}
              </p>
              <button
                className="text-button mint-text"
                onClick={() => onOpen(deadline)}
              >
                Get in the loop <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </aside>
      </div>

      {state.announcement && (
        <section className="campus-note">
          <span className="note-icon">
            <Icon name="spark" />
          </span>
          <div>
            <strong>From campus administration</strong>
            <p>{state.announcement}</p>
          </div>
        </section>
      )}

      <div className="section-heading">
        <div>
          <h2>Your communities</h2>
          <p className="muted">
            {state.user.interests.length
              ? `${state.user.interests.join(", ")}, and a healthy dose of curiosity.`
              : "Find people who care about what you care about."}
          </p>
        </div>
        <button className="text-button" onClick={() => navigate("communities")}>
          Find your people <Icon name="arrow" size={17} />
        </button>
      </div>
      <div className="community-inline">
        {(myCommunities.length ? myCommunities : state.communities.slice(0, 2))
          .slice(0, 3)
          .map((c) => (
            <button key={c.id} className="spot" onClick={() => navigate("communities")}>
              <span className={`community-symbol ${c.color}`}>
                <Icon name="users" />
              </span>
              <div>
                <h3>{c.name}</h3>
                <p>{c.members} members · {c.tags.join(", ")}</p>
              </div>
              <Icon name="arrow" />
            </button>
          ))}
      </div>
    </>
  );
}
