import { useState } from "react";
import Icon from "../components/Icon";
import EventCard from "../components/EventCard";
import { DEMO_DATE, DEMO_NOW, fitFor, freeFor } from "../data/campus";
export default function Explore({ state, onOpen, free = false }) {
  const window = freeFor(state);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [fits, setFits] = useState(free),
    [duration, setDuration] = useState(
      free ? Math.max(10, Math.floor(window.minutes / 10) * 10) : 100,
    ),
    [day, setDay] = useState(free ? "today" : "all"),
    [sort, setSort] = useState("match");
  const categories = ["All", ...new Set(state.events.map((e) => e.category))];
  const filtered = state.events
    .filter(
      (e) =>
        `${e.title} ${e.club} ${e.tags.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (category === "All" || e.category === category) &&
        (day === "all" || e.date === DEMO_DATE) &&
        e.date >= DEMO_DATE &&
        (!fits ||
          (fitFor(state, e).ok &&
            (day !== "today" ||
              e.end + e.walk <= Math.min(DEMO_NOW + duration, window.until)) &&
            e.end - e.start + e.walk <= duration)),
    )
    .sort((a, b) =>
      sort === "match"
        ? b.score - a.score
        : `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Follow your curiosity<span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            There’s something out there for the person you’re becoming.
          </p>
        </div>
        <span className="pill">
          <Icon name="compass" size={16} />
          {state.events.length} opportunities in your orbit
        </span>
      </div>
      <div className="discovery-controls glass">
        <label className="search-field">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search opportunities"
            placeholder="An interest, a workshop, a little inspiration…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="filter-controls">
          <label>
            When
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="all">This week</option>
              <option value="today">Today</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="match">Best match</option>
              <option value="date">Soonest first</option>
            </select>
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={fits}
              onChange={(e) => setFits(e.target.checked)}
            />
            <span className="toggle-switch" />
            Fits my free time
          </label>
        </div>
        {fits && (
          <div className="duration-filter">
            <Icon name="clock" size={17} />
            <label htmlFor="free-duration">
              I have <strong>{duration} minutes</strong>
            </label>
            <input
              id="free-duration"
              type="range"
              min="10"
              max="180"
              step="10"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <span className="small-text muted">Includes walking time</span>
          </div>
        )}
      </div>
      <div className="category-tabs" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            className={c === category ? "active" : ""}
            key={c}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="results-label">
        <span>
          {filtered.length}{" "}
          {filtered.length === 1 ? "opportunity" : "opportunities"} to make your
          day bigger
        </span>
        <span>
          <Icon name="spark" size={14} />
          Opportunity scores are illustrative
        </span>
      </div>
      {filtered.length ? (
        <div className="event-grid" key={`${category}-${day}-${fits}-${sort}`}>
          {filtered.map((event, i) => (
            <EventCard
              event={event}
              state={state}
              onOpen={onOpen}
              key={event.id}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state glass">
          <Icon name="compass" size={36} />
          <h2>A little too specific?</h2>
          <p>Try another interest, a longer break, or clear your filters.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setFits(false);
              setDay("all");
            }}
          >
            Clear filters <Icon name="arrow" />
          </button>
        </div>
      )}
    </>
  );
}
