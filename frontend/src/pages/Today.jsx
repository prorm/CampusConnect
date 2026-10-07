import Icon from "../components/Icon";
import EventCard from "../components/EventCard";
import {
  DEMO_DATE,
  DEMO_NOW,
  clock,
  currentFreeWindow,
  student,
  feasibility,
} from "../data/campus";
export default function Today({ state, navigate, onOpen }) {
  const free = currentFreeWindow(state.events, state.registrations);
  const hours = Math.floor(free.minutes / 60),
    minutes = free.minutes % 60;
  const duration =
    [
      hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
      minutes ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : "",
    ]
      .filter(Boolean)
      .join(", ") || "Your day is in motion";
  const picks = state.events
    .filter(
      (e) =>
        e.date === DEMO_DATE &&
        e.start >= DEMO_NOW &&
        e.end + e.walk <= free.until &&
        !state.registrations.some(
          (r) => r.eventId === e.id && r.status === "registered",
        ) &&
        feasibility(e, state.registrations, state.events).ok,
    )
    .sort((a, b) => b.score - a.score);
  const conflict = state.events.find(
    (e) =>
      e.date === DEMO_DATE &&
      !feasibility(e, state.registrations, state.events).ok,
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="date-line">
            Wednesday, October 7 <span>Let’s make it count.</span>
          </p>
          <h1>
            Good afternoon, {student.firstName}
            <span className="mint-text">.</span>
          </h1>
          <p className="muted">
            A good day to discover something you didn’t know you needed.
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
          <div className="availability">
            <span className="live-dot" />
            You have a little room to explore
          </div>
          <h2>
            {duration}.
            <br />
            <span className="mint-text">Make it yours.</span>
          </h2>
          <p>
            {free.next?.type === "event"
              ? `Free until ${clock(free.until)}, when you’ll leave for ${free.next.title}.`
              : `Free until your ${free.next?.title || "next plan"} class at ${clock(free.until)}.`}
            <br />
            {picks.length
              ? "We found opportunities that fit right in."
              : "Your next plan is saved. Make a little room to recharge."}
          </p>
          <button className="text-button" onClick={() => navigate("schedule")}>
            See my day <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="day-strip">
          <div className="day-strip-label">
            <span>YOUR AFTERNOON</span>
            <span>
              {clock(DEMO_NOW)} —{" "}
              {clock(free.plans.slice(0, 2).at(-1)?.end || free.until)}
            </span>
          </div>
          <div className="schedule-track">
            <div className="track-free">
              <Icon name="spark" size={18} />
              <strong>
                {free.minutes ? "Your free time" : "In your plans"}
              </strong>
              <span>
                {clock(DEMO_NOW)} — {clock(free.until)}
              </span>
            </div>
            {free.plans.slice(0, 2).map((plan) => (
              <div key={plan.id}>
                <Icon
                  name={plan.type === "event" ? "spark" : "book"}
                  size={16}
                />
                <strong>{plan.title}</strong>
                <span>{clock(plan.start)}</span>
              </div>
            ))}
          </div>
          <div className="next-class">
            <Icon name="pin" size={15} />
            Next stop: {free.next?.venue || "Your next possibility"}
          </div>
        </div>
      </section>
      <div className="section-heading">
        <div>
          <h2>Right now, right for you</h2>
          <p className="muted">
            Picked around your interests, your schedule, and your next stop.
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
          />
        ))}
        {!picks.length && (
          <div className="empty-state glass">
            <Icon name="calendar" size={32} />
            <h3>A little breathing room.</h3>
            <p>
              No demo opportunity fits these {free.minutes} minutes. Your next
              plan is in your schedule; explore the week for more.
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
          <div className="nudge glass">
            <span className="nudge-icon">
              <Icon name="warning" />
            </span>
            <h3>A heads-up for your day</h3>
            <p>
              {conflict
                ? `${conflict.title} overlaps your schedule. Your class comes first.`
                : "Your current picks fit around your classes. You’re good to go."}
            </p>
            {conflict && (
              <button
                className="text-button peach-text"
                onClick={() => onOpen(conflict)}
              >
                Check the overlap <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
          <div className="nudge deadline-nudge">
            <h3>
              Your next big build
              <br />
              could be HackMatrix.
            </h3>
            <p>
              Registration closes tonight. Full house? Your waitlist spot is
              waiting.
            </p>
            <button
              className="text-button mint-text"
              onClick={() => onOpen(state.events.find((e) => e.id === "hack"))}
            >
              Get in the loop <Icon name="arrow" size={16} />
            </button>
          </div>
        </aside>
      </div>
      <section className="campus-note">
        <Icon name="spark" />
        <div>
          <strong>A note from your campus</strong>
          <p>
            {state.announcement ||
              "Make space for an experience outside the classroom today."}
          </p>
        </div>
        <button
          className="icon-button"
          aria-label="Explore campus announcement"
          onClick={() => navigate("explore")}
        >
          <Icon name="arrow" />
        </button>
      </section>
      <div className="section-heading">
        <div>
          <h2>Your interests, in good company</h2>
          <p className="muted">
            AI / ML, web development, and a healthy dose of curiosity.
          </p>
        </div>
        <button className="text-button" onClick={() => navigate("communities")}>
          Find your people <Icon name="arrow" size={17} />
        </button>
      </div>
      <div className="community-inline">
        <button onClick={() => navigate("communities")}>
          <span className="community-symbol mint">
            <Icon name="bolt" />
          </span>
          <div>
            <h3>CodeCraft</h3>
            <p>Where ideas meet the editor.</p>
          </div>
          <Icon name="arrow" />
        </button>
        <button onClick={() => navigate("communities")}>
          <span className="community-symbol violet">
            <Icon name="spark" />
          </span>
          <div>
            <h3>Cognitive Minds</h3>
            <p>A space for your next “what if?”</p>
          </div>
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}
