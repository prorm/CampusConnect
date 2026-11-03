import { useState } from "react";
import Icon from "../components/Icon";
import Dialog from "../components/Dialog";
import { dateLabel, downloadFile } from "../data/campus";
export default function Passport({ state, onFeedback }) {
  const [certificate, setCertificate] = useState(null),
    [feedback, setFeedback] = useState(null);
  const student = state.user;
  const counts = state.activities.reduce(
    (acc, a) => ({ ...acc, [a.skill]: (acc[a.skill] || 0) + 1 }),
    {},
  );
  const skills = [
    ...new Set([
      ...Object.keys(counts).sort((a, b) => counts[b] - counts[a]),
      ...student.interests,
    ]),
  ].slice(0, 5);
  const top = Math.max(1, ...Object.values(counts));
  const exportResume = () =>
    downloadFile(
      `${student.name.replace(/\s+/g, "-")}-Campus-Activity-Resume.txt`,
      [
        student.name,
        `${student.department} · Year ${student.year}${student.usn ? ` · ${student.usn}` : ""}`,
        "Ramaiah Institute of Technology",
        "CAMPUS ACTIVITY RESUME",
        "",
        ...state.activities.map(
          (a) => `${a.title}\n${a.club} · ${a.date}\nSkill: ${a.skill}\n`,
        ),
        "Participation verified by coordinator check-in on CampusConnect; not an institutional credential.",
      ].join("\n"),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Your curiosity, on record<span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            Every experience adds a little more to your story.
          </p>
        </div>
        <button className="button secondary" onClick={exportResume}>
          <Icon name="download" size={17} />
          Export activity resume
        </button>
      </div>
      <div className="passport-layout">
        <section className="passport-card glass">
          <div className="passport-card-top">
            <span>CAMPUSCONNECT</span>
            <Icon name="passport" size={28} />
          </div>
          <div className="passport-orbit" aria-hidden="true" />
          <div className="passport-owner">
            <span className="avatar large-avatar">{student.initials}</span>
            <h2>{student.name}</h2>
            <p>{student.department} · Year {student.year}</p>
          </div>
          <div className="passport-card-bottom">
            <div>
              <span>CAMPUS SKILL PASSPORT</span>
              <strong>
                {state.activities.length} verified{" "}
                {state.activities.length === 1 ? "activity" : "activities"}
              </strong>
            </div>
            <span className="passport-seal">
              <Icon name="shield" size={26} />
            </span>
          </div>
          <small>
            Ramaiah Institute of Technology{student.usn ? ` / ${student.usn}` : ""}
          </small>
        </section>
        <section className="glass skill-panel">
          <h2>Skills you’re putting into practice</h2>
          <p className="muted">Derived from your recorded participation.</p>
          {skills.map((skill, i) => {
            const count = counts[skill] || 0;
            return (
              <div className="skill-row" key={skill}>
                <div>
                  <strong>{skill}</strong>
                  <span>
                    {count} {count === 1 ? "experience" : "experiences"}
                  </span>
                </div>
                <div className={`skill-bar skill-${i % 5}`} style={{ "--i": i }}>
                  <span style={{ "--fill": `${(count / top) * 100}%` }} />
                </div>
              </div>
            );
          })}
          <p className="small-text muted">
            Your passport updates when a coordinator marks you present.
          </p>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <h2>The moments that made it</h2>
          <p className="muted">
            Your participation, certificates, and reflections.
          </p>
        </div>
        <span className="pill">
          <Icon name="shield" size={15} />
          Attendance-backed records
        </span>
      </div>
      <div className="activity-list glass">
        {!state.activities.length && (
          <div className="empty-state compact">
            <Icon name="shield" size={28} />
            <p>
              Your first verified activity appears here after a coordinator
              checks you in at an event.
            </p>
          </div>
        )}
        {state.activities.map((activity) => (
          <article className="activity-row" key={activity.id}>
            <span className="activity-stamp">
              <Icon name="shield" />
            </span>
            <div className="activity-copy">
              <h3>{activity.title}</h3>
              <p>
                {activity.club} · {dateLabel(activity.date)} ·{" "}
                <span className="mint-text">{activity.skill}</span>
              </p>
            </div>
            <div className="activity-actions">
              <button
                className="button small secondary"
                onClick={() => setCertificate(activity)}
              >
                Certificate <Icon name="arrow" size={14} />
              </button>
              <button
                className="text-button"
                disabled={activity.feedback}
                onClick={() => setFeedback(activity)}
              >
                {activity.feedback ? "Reflection saved" : "Leave a reflection"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {certificate && (
        <Dialog
          title="A moment worth keeping"
          onClose={() => setCertificate(null)}
        >
          <div className="certificate-frame">
            <Icon name="shield" size={40} />
            <p>CAMPUSCONNECT · RAMAIAH INSTITUTE OF TECHNOLOGY</p>
            <h3>Certificate of participation</h3>
            <span>Presented to</span>
            <h2>{student.name}</h2>
            <span>for participating in</span>
            <h3>{certificate.title}</h3>
            <p>
              {certificate.club} · {dateLabel(certificate.date)} 2026
            </p>
            <small>
              Record CC-{certificate.id.slice(0, 10).toUpperCase()}-
              {student.usn.slice(-3) || student.initials}
              <br />
              Verified by coordinator check-in. Not an institutional credential.
            </small>
          </div>
          <button className="button" onClick={() => window.print()}>
            <Icon name="download" size={16} />
            Print / save as PDF
          </button>
        </Dialog>
      )}
      {feedback && (
        <Dialog
          title="A little reflection goes a long way"
          onClose={() => setFeedback(null)}
        >
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              if (
                await onFeedback(
                  feedback.id,
                  Number(data.get("rating")),
                  data.get("comment"),
                )
              )
                setFeedback(null);
            }}
          >
            <p className="muted">How was {feedback.title}?</p>
            <label>
              Your experience
              <select name="rating" defaultValue="5">
                <option value="5">5 — Loved it</option>
                <option value="4">4 — Really useful</option>
                <option value="3">3 — Good</option>
                <option value="2">2 — Could be better</option>
                <option value="1">1 — Didn’t meet expectations</option>
              </select>
            </label>
            <label>
              Your takeaway
              <textarea
                required
                name="comment"
                maxLength="1000"
                placeholder="What did you learn? What could be better?"
                rows="4"
              />
            </label>
            <button className="button" type="submit">
              Save my reflection <Icon name="check" size={17} />
            </button>
          </form>
        </Dialog>
      )}
    </>
  );
}
