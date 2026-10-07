import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import Counter from "../components/Counter";
import { api } from "../api/client";

const percent = (n) => `${Math.round(n * 100)}%`;

function Bars({ rows, hue, caption, table }) {
  const max = Math.max(1, ...rows.map((r) => r.max ?? r.value));
  return (
    <figure className={`bar-chart hue-${hue}`}>
      <ul aria-hidden="true">
        {rows.map((r, i) => (
          <li
            key={r.label}
            style={{ "--i": i }}
            data-tip={r.tip}
            tabIndex={-1}
          >
            <span className="bar-label">{r.label}</span>
            <span
              className="bar-track"
              style={{ "--track": `${r.max == null ? 100 : (r.max / max) * 100}%` }}
            >
              <i style={{ "--fill": `${(r.value / (r.max ?? max)) * 100}%` }} />
            </span>
            <span className="bar-value">{r.display}</span>
          </li>
        ))}
      </ul>
      <details className="table-view">
        <summary>{caption} as a table</summary>
        <table>
          <thead>
            <tr>
              {table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function Analytics({ version }) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    api
      .analytics()
      .then((d) => live && setData(d))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [version]);
  if (error)
    return (
      <p className="form-error" role="alert">
        <Icon name="warning" size={16} /> {error}
      </p>
    );
  if (!data)
    return (
      <div className="analytics-skeleton" aria-busy="true" aria-label="Loading analytics">
        <i />
        <i />
        <i />
        <i />
      </div>
    );
  const { totals, categories, topEvents, skills, feedback } = data;
  const sentiment = [
    ["positive", "Positive", feedback.sentiment.positive || 0],
    ["neutral", "Neutral", feedback.sentiment.neutral || 0],
    ["constructive", "Constructive", feedback.sentiment.constructive || 0],
  ];
  return (
    <div className="analytics">
      <div className="stat-row">
        {[
          ["users", "Students", <Counter key="s" value={totals.students} />, `${totals.communityMembers} community memberships`],
          ["calendar", "Seats filled", percent(totals.fillRate), `${totals.seatsFilled} of ${totals.seats} across ${totals.events} events`],
          ["check", "Check-in rate", percent(totals.attendanceRate), `${totals.checkIns} of ${totals.trackedRegistrations} app registrations`],
          ["chat", "Average reflection", feedback.count ? `${feedback.average.toFixed(1)}/5` : "—", `${feedback.count} reflections`],
        ].map(([icon, label, value, note]) => (
          <div className="stat-tile glass" key={label}>
            <span className="stat-label">
              <Icon name={icon} size={15} /> {label}
            </span>
            <strong className="stat-value">{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="analytics-grid">
        <section className="glass chart-panel">
          <h3>Seats filled by category</h3>
          <p className="muted small-text">Registered seats against total capacity.</p>
          <Bars
            hue="cyan"
            caption="Seats by category"
            rows={categories.map((c) => ({
              label: c.category,
              value: c.registered,
              max: c.capacity,
              display: `${c.registered}/${c.capacity}`,
              tip: `${c.category}: ${c.registered} of ${c.capacity} seats · ${c.events} event${c.events === 1 ? "" : "s"}`,
            }))}
            table={{
              head: ["Category", "Events", "Registered", "Capacity"],
              rows: categories.map((c) => [c.category, c.events, c.registered, c.capacity]),
            }}
          />
        </section>
        <section className="glass chart-panel">
          <h3>Most in demand</h3>
          <p className="muted small-text">Share of seats taken, with people waiting.</p>
          <Bars
            hue="mint"
            caption="Demand by event"
            rows={topEvents.map((e) => ({
              label: e.title,
              value: e.fill * 100,
              max: 100,
              display: e.waitlist ? `${percent(e.fill)} · ${e.waitlist} waiting` : percent(e.fill),
              tip: `${e.title}: ${e.registered}/${e.capacity} seats${e.waitlist ? `, ${e.waitlist} on the waitlist` : ""}`,
            }))}
            table={{
              head: ["Event", "Registered", "Capacity", "Waitlist"],
              rows: topEvents.map((e) => [e.title, e.registered, e.capacity, e.waitlist]),
            }}
          />
        </section>
        <section className="glass chart-panel">
          <h3>Skills earned</h3>
          <p className="muted small-text">Verified activities in student passports.</p>
          <Bars
            hue="violet"
            caption="Skills earned"
            rows={skills.map((s) => ({
              label: s.skill,
              value: s.count,
              display: String(s.count),
              tip: `${s.skill}: ${s.count} verified ${s.count === 1 ? "activity" : "activities"}`,
            }))}
            table={{
              head: ["Skill", "Verified activities"],
              rows: skills.map((s) => [s.skill, s.count]),
            }}
          />
        </section>
        <section className="glass chart-panel">
          <h3>How reflections feel</h3>
          <p className="muted small-text">
            Sentiment from the rating each student gave.
          </p>
          {feedback.count ? (
            <>
              <div className="stacked-bar" role="img" aria-label={sentiment.map(([, l, n]) => `${l} ${n}`).join(", ")}>
                {sentiment
                  .filter(([, , n]) => n)
                  .map(([key, label, n]) => (
                    <i
                      key={key}
                      className={key}
                      style={{ flexGrow: n }}
                      data-tip={`${label}: ${n} of ${feedback.count}`}
                    />
                  ))}
              </div>
              <ul className="legend">
                {sentiment.map(([key, label, n]) => (
                  <li key={key}>
                    <i className={key} aria-hidden="true" />
                    {label}
                    <strong>{n}</strong>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted small-text">No reflections yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CampusAdmin({ state, busy, onDecision, onBroadcast }) {
  const [message, setMessage] = useState(state.announcement);
  const version = `${state.events.length}-${state.events.reduce((a, e) => a + e.registered + e.waitlist, 0)}-${state.feedbacks.length}-${state.communities.length}`;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            A campus that works together<span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            Engagement across events, communities, and verified participation.
          </p>
        </div>
        <span className="pill">
          <Icon name="shield" size={16} />
          {state.user.title}
        </span>
      </div>
      <Analytics version={version} />
      <div className="admin-layout">
        <section className="glass admin-panel">
          <h2>New communities, new connections</h2>
          <p className="muted">Review proposals from students making campus their own.</p>
          {state.proposals.length ? (
            state.proposals.map((p) => (
              <article className="proposal" key={p.id}>
                <h3>{p.name}</h3>
                <p className="muted">{p.description}</p>
                <div className="action-row">
                  <button className="button small" disabled={busy} onClick={() => onDecision(p, true)}>
                    Approve <Icon name="check" size={15} />
                  </button>
                  <button
                    className="button small secondary"
                    disabled={busy}
                    onClick={() => onDecision(p, false)}
                  >
                    Decline
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state compact">
              <Icon name="check" size={30} />
              <h3>You’re all caught up.</h3>
              <p>New proposals appear here when a student starts a community.</p>
            </div>
          )}
        </section>
        <section className="glass admin-panel">
          <h2>A note for your campus</h2>
          <p className="muted">Shown on every student’s My campus today.</p>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              onBroadcast(message.trim());
            }}
          >
            <label>
              Campus announcement
              <textarea
                required
                maxLength="300"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What should everyone know?"
              />
            </label>
            <div className="action-row">
              <button className="button" type="submit" disabled={busy || !message.trim()}>
                Publish announcement <Icon name="arrow" size={16} />
              </button>
              <span className="small-text muted">{message.length}/300</span>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
