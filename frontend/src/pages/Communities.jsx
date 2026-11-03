import { useState } from "react";
import Icon from "../components/Icon";
import Art from "../components/Art";
import Dialog from "../components/Dialog";
import Counter from "../components/Counter";
export default function Communities({ state, busy, onJoin, onPropose }) {
  const [search, setSearch] = useState(""),
    [propose, setPropose] = useState(false);
  const pending = state.proposals;
  const list = state.communities.filter(
    (c) =>
      `${c.name} ${c.description} ${c.tags.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Find the people who get you<span className="accent-dot">.</span>
          </h1>
          <p className="muted">Big ideas start with a small “hey, me too.”</p>
        </div>
        <button className="button secondary" onClick={() => setPropose(true)}>
          <Icon name="plus" size={17} />
          Start a community
        </button>
      </div>
      <label className="search-field glass community-search">
        <Icon name="search" />
        <input
          type="search"
          aria-label="Search communities"
          placeholder="Find your people by name or interest"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="community-grid">
        {list.map((c, i) => {
          const joined = state.joined.includes(c.id);
          return (
            <article
              className={`community-card glass tone-${c.color} ${joined ? "joined" : ""}`}
              key={c.id}
              style={{ "--i": i }}
            >
              <div className={`community-art ${c.color}`}>
                <Art kind={c.art} />
                <span>{c.category}</span>
              </div>
              <div>
                <div className="community-title">
                  <h2>{c.name}</h2>
                  <span className="small-text muted">
                    <Counter value={c.members} /> members
                  </span>
                </div>
                <p className="muted">{c.description}</p>
                <div className="extracted-tags">
                  {c.tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  className={`button small ${joined ? "secondary" : ""}`}
                  aria-pressed={joined}
                  disabled={busy}
                  onClick={() => onJoin(c.id)}
                >
                  {joined ? "Joined · leave community" : "Find my people"}
                  <Icon name={joined ? "check" : "arrow"} size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {state.user.role !== "admin" && pending.length > 0 && (
        <section className="pending-strip">
          <Icon name="clock" size={17} />
          <p>
            Awaiting review:{" "}
            <strong>{pending.map((p) => p.name).join(", ")}</strong>
          </p>
        </section>
      )}
      {!list.length && (
        <div className="empty-state">
          <h2>No community found yet.</h2>
          <p>Try another interest or propose one of your own.</p>
        </div>
      )}
      {propose && (
        <Dialog
          title="A place for your people"
          onClose={() => setPropose(false)}
        >
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              if (
                await onPropose({
                  name: data.get("name"),
                  description: data.get("description"),
                })
              )
                setPropose(false);
            }}
          >
            <p className="muted">
              Propose a community. Campus administration reviews every
              proposal before it opens.
            </p>
            <label>
              Name
              <input name="name" required maxLength="60" />
            </label>
            <label>
              What brings you together?
              <textarea name="description" required maxLength="500" rows="4" />
            </label>
            <button className="button" type="submit" disabled={busy}>
              Send proposal for review <Icon name="arrow" size={16} />
            </button>
          </form>
        </Dialog>
      )}
    </>
  );
}
