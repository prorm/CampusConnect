import { useState } from "react";
import Icon from "../components/Icon";
export default function CampusAdmin({ state, onDecision, onBroadcast }) {
  const [message, setMessage] = useState(state.announcement);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            A campus that works together<span className="mint-text">.</span>
          </h1>
          <p className="muted">
            A little coordination makes room for a lot of possibility.
          </p>
        </div>
        <span className="pill">
          <Icon name="shield" size={16} />
          Campus administration
        </span>
      </div>
      <div className="admin-layout">
        <section className="glass admin-panel">
          <h2>New communities, new connections</h2>
          <p className="muted">
            Review proposals from the people making campus their own.
          </p>
          {state.proposals.length ? (
            state.proposals.map((p) => (
              <article className="proposal" key={p.id}>
                <h3>{p.name}</h3>
                <p className="muted">{p.description}</p>
                <div className="action-row">
                  <button
                    className="button small"
                    onClick={() => onDecision(p, true)}
                  >
                    Approve <Icon name="check" size={15} />
                  </button>
                  <button
                    className="button small secondary"
                    onClick={() => onDecision(p, false)}
                  >
                    Decline
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state compact">
              <Icon name="check" size={32} />
              <h3>You’re all caught up.</h3>
              <p>New proposals appear here when someone starts a community.</p>
            </div>
          )}
        </section>
        <section className="glass admin-panel">
          <h2>A note for your campus</h2>
          <p className="muted">Make the important things easier to find.</p>
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
              <button className="button" type="submit">
                Publish demo announcement <Icon name="arrow" size={16} />
              </button>
              <span className="small-text muted">{message.length}/300</span>
            </div>
            <p className="small-text muted">
              Visible in My campus today. Stored locally in this browser.
            </p>
          </form>
        </section>
      </div>
      <section className="campus-note">
        <Icon name="shield" />
        <div>
          <strong>One coherent campus experience</strong>
          <p>
            Discover → Decide → Attend → Verify → Grow. Communities and
            announcements support the student journey.
          </p>
        </div>
      </section>
    </>
  );
}
