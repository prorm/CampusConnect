import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { DEMO_DATE, feasibility, clock } from "../data/campus";
const samples = {
  hack: "Event: GenAI Hackathon\nClub: CodeCraft\nDate: 2026-10-12\nStart: 14:00\nEnd: 17:00\nVenue: Seminar Hall 2\nDeadline: 2026-10-10\nCapacity: 60\nYears: 1, 2, 3\nTags: AI / ML, Hackathons",
  clash:
    "Event: Robotics build lab\nClub: Cognitive Minds\nDate: 2026-10-07\nStart: 15:30\nEnd: 17:00\nVenue: Robotics Lab 304\nDeadline: 2026-10-07\nCapacity: 40\nYears: 2, 3, 4\nTags: Robotics, AI / ML",
};
const minutes = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
export default function Poster({ state, onPublish }) {
  const [text, setText] = useState(samples.hack),
    [image, setImage] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [draft, setDraft] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.url);
    },
    [image],
  );
  const file = (selected) => {
    setError("");
    if (!selected) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(selected.type) ||
      selected.size > 5 * 1024 * 1024
    ) {
      setError("Choose a PNG, JPG, or WebP poster smaller than 5 MB.");
      return;
    }
    setImage({ url: URL.createObjectURL(selected), name: selected.name });
    setDraft(null);
  };
  const extract = () => {
    setError("");
    setDraft(null);
    const values = Object.fromEntries(
      text
        .split("\n")
        .filter((l) => l.includes(":"))
        .map((l) => {
          const at = l.indexOf(":");
          return [l.slice(0, at).trim().toLowerCase(), l.slice(at + 1).trim()];
        }),
    );
    if (
      !values.event ||
      !values.venue ||
      !/^\d{4}-\d{2}-\d{2}$/.test(values.date || "") ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.start || "") ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.end || "")
    ) {
      setError(
        "Use the sample format: Event, Date (YYYY-MM-DD), Start, End (HH:MM), and Venue are required.",
      );
      return;
    }
    if (minutes(values.end) <= minutes(values.start)) {
      setError("The end time must be after the start time.");
      return;
    }
    setBusy(true);
    timer.current = setTimeout(() => {
      setDraft({
        id: `poster-${Date.now()}`,
        title: values.event,
        club: values.club || "Campus community",
        date: values.date,
        start: minutes(values.start),
        end: minutes(values.end),
        venue: values.venue,
        deadline: values.deadline || values.date,
        capacity: Math.max(1, Number(values.capacity) || 60),
        registered: 0,
        waitlist: 0,
        years: (values.years || "1,2,3,4")
          .split(",")
          .map(Number)
          .filter((y) => [1, 2, 3, 4].includes(y)),
        tags: (values.tags || "AI / ML").split(",").map((t) => t.trim()),
        walk: 8,
        score: 94,
        color: "violet",
        art: "cube",
        category: "Technology",
        description:
          "An opportunity created from your poster details. Review the event with the organizer before attending.",
        friends: 0,
      });
      setBusy(false);
    }, 850);
  };
  const fit = draft && feasibility(draft, state.registrations, state.events);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            From a poster to a possibility<span className="mint-text">.</span>
          </h1>
          <p className="muted">
            Scattered details become a plan you can actually make.
          </p>
        </div>
        <span className="pill">
          <Icon name="spark" size={15} />
          Poster intelligence demo
        </span>
      </div>
      <div className="poster-workspace">
        <section className="glass poster-input">
          <h2>Bring the details into focus</h2>
          <p className="muted">
            Try a sample, or preview a poster and paste its text.
          </p>
          <div className="sample-controls">
            <button
              className="button small secondary"
              onClick={() => {
                setText(samples.hack);
                setDraft(null);
                setError("");
              }}
            >
              Try hackathon poster
            </button>
            <button
              className="button small secondary"
              onClick={() => {
                setText(samples.clash);
                setDraft(null);
                setError("");
              }}
            >
              Try timetable clash
            </button>
          </div>
          <label
            className={`upload-zone ${image ? "has-image" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              file(e.dataTransfer.files[0]);
            }}
          >
            {image ? (
              <>
                <img src={image.url} alt={`Preview of ${image.name}`} />
                <span>{image.name} · Click to replace</span>
              </>
            ) : (
              <>
                <Icon name="upload" size={28} />
                <strong>Drop a poster into your orbit</strong>
                <span>or click to choose · PNG, JPG, WebP · up to 5 MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Choose poster image"
              onChange={(e) => file(e.target.files[0])}
            />
          </label>
          <label className="form-label" htmlFor="poster-text">
            Poster text
            <textarea
              id="poster-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setDraft(null);
              }}
              rows="10"
              maxLength="5000"
            />
          </label>
          <p className="small-text muted">
            Local text parsing demo. Images stay in your browser; image OCR and
            live AI are not connected. Use labeled fields as shown in the
            samples.
          </p>
          {error && (
            <p role="alert" className="form-error">
              <Icon name="warning" size={16} />
              {error}
            </p>
          )}
          <button
            className="button"
            onClick={extract}
            disabled={busy || !text.trim()}
          >
            {busy ? (
              <>
                <span className="spinner" />
                Finding the details…
              </>
            ) : (
              <>
                <Icon name="spark" size={17} />
                Extract event details
              </>
            )}
          </button>
        </section>
        <section className="glass poster-result" aria-live="polite">
          {draft ? (
            <>
              <span className="pill mint-text">
                <Icon name="check" size={15} />
                Details found · review before adding
              </span>
              <form
                className="form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    draft.date < DEMO_DATE ||
                    draft.deadline < DEMO_DATE ||
                    draft.deadline > draft.date ||
                    draft.end <= draft.start ||
                    !draft.years.length
                  ) {
                    setError(
                      "Check the dates, end time, and eligible years. Deadline must be today or later, and no later than the event.",
                    );
                    return;
                  }
                  onPublish(draft);
                  setDraft(null);
                }}
              >
                <label>
                  Event title
                  <input
                    required
                    maxLength="100"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Date
                    <input
                      required
                      type="date"
                      min={DEMO_DATE}
                      value={draft.date}
                      onChange={(e) =>
                        setDraft({ ...draft, date: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Deadline
                    <input
                      required
                      type="date"
                      min={DEMO_DATE}
                      max={draft.date}
                      value={draft.deadline}
                      onChange={(e) =>
                        setDraft({ ...draft, deadline: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Starts
                    <input
                      required
                      type="time"
                      value={clock(draft.start)}
                      onChange={(e) =>
                        setDraft({ ...draft, start: minutes(e.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Ends
                    <input
                      required
                      type="time"
                      value={clock(draft.end)}
                      onChange={(e) =>
                        setDraft({ ...draft, end: minutes(e.target.value) })
                      }
                    />
                  </label>
                </div>
                <label>
                  Venue
                  <input
                    required
                    value={draft.venue}
                    onChange={(e) =>
                      setDraft({ ...draft, venue: e.target.value })
                    }
                  />
                </label>
                <label>
                  Capacity
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    value={draft.capacity}
                    onChange={(e) =>
                      setDraft({ ...draft, capacity: Number(e.target.value) })
                    }
                  />
                </label>
                <div className={`feasibility ${fit.ok ? "fits" : "conflict"}`}>
                  <Icon name={fit.ok ? "check" : "warning"} />
                  <div>
                    <strong>
                      {fit.ok
                        ? "This one fits your day."
                        : "A clash in your calendar."}
                    </strong>
                    <p>{fit.reason}</p>
                  </div>
                </div>
                <div className="extracted-tags">
                  {draft.tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                  <span className="pill">Years {draft.years.join(", ")}</span>
                </div>
                <button className="button" type="submit">
                  Add to CampusConnect <Icon name="arrow" size={17} />
                </button>
                <p className="small-text muted">
                  Adds a discoverable event to this browser’s demo. You can
                  review conflicts before registering.
                </p>
              </form>
            </>
          ) : (
            <div className="poster-empty">
              <div className="scanning-frame">
                <div className="poster-paper">
                  <span>CODECRAFT PRESENTS</span>
                  <strong>
                    YOUR
                    <br />
                    NEXT
                    <br />
                    <em>WHAT IF.</em>
                  </strong>
                  <small>12 OCT / SEMINAR HALL 2</small>
                </div>
                <div className={`scan-line ${busy ? "scanning" : ""}`} />
              </div>
              <h2>
                {busy
                  ? "Connecting the details…"
                  : "A plan is hiding in that poster."}
              </h2>
              <p className="muted">
                Event details, eligibility, deadline, and a timetable check.
                Everything you need to say yes.
              </p>
              <div className="extraction-preview">
                <span>
                  <Icon name="check" size={15} />
                  Event + venue
                </span>
                <span>
                  <Icon name="check" size={15} />
                  Time + deadline
                </span>
                <span>
                  <Icon name="check" size={15} />
                  Can I attend?
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
