import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { DEMO_DATE, fitFor, clock, toMinutes } from "../data/campus";
import { api } from "../api/client";

const samples = {
  hack: "Event: GenAI Hackathon\nClub: CodeCraft\nCategory: Hackathons\nDate: 2026-10-12\nStart: 14:00\nEnd: 17:00\nVenue: Seminar Hall 2\nDeadline: 2026-10-10\nCapacity: 60\nYears: 1, 2, 3\nTags: AI / ML, Hackathons",
  clash:
    "Event: Robotics build lab\nClub: Cognitive Minds\nCategory: Technology\nDate: 2026-10-07\nStart: 15:30\nEnd: 17:00\nVenue: Robotics Lab 304\nDeadline: 2026-10-07\nCapacity: 40\nYears: 2, 3, 4\nTags: Robotics, AI / ML",
};
const WALK = 5;

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("That image couldn’t be read."));
    reader.readAsDataURL(file);
  });
}

export default function Poster({ state, busy: publishing, onPublish }) {
  const [text, setText] = useState(samples.hack),
    [image, setImage] = useState(null),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false),
    [draft, setDraft] = useState(null),
    [source, setSource] = useState(null),
    [dragging, setDragging] = useState(false);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.url);
    },
    [image],
  );

  const choose = (file) => {
    setError("");
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a PNG, JPG, or WebP poster smaller than 5 MB.");
      return;
    }
    setImage({ url: URL.createObjectURL(file), name: file.name, file });
    setDraft(null);
    if (state.ai.enabled) setText("");
  };

  const extract = async () => {
    setError("");
    setDraft(null);
    setReading(true);
    try {
      const body = { text };
      if (image && state.ai.enabled)
        body.image = { data: await readAsBase64(image.file), mediaType: image.file.type };
      const result = await api.readPoster(body);
      setDraft({ ...result.draft, id: "draft", walk: WALK });
      setSource(result.source);
    } catch (e) {
      setError(e.message);
    } finally {
      setReading(false);
    }
  };

  const fit = draft && fitFor(state, draft);
  const canRead = (image && state.ai.enabled) || text.trim();
  const student = state.user.role === "student";

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            From a poster to a possibility<span className="accent-dot">.</span>
          </h1>
          <p className="muted">
            Scattered details become a plan you can actually make.
          </p>
        </div>
        <span className={`ai-chip ${state.ai.enabled ? "on" : ""}`}>
          <Icon name="spark" size={14} />
          {state.ai.enabled ? "Claude reads poster images" : "Text parsing · add an API key for images"}
        </span>
      </div>
      <div className="poster-workspace">
        <section className="glass poster-input">
          <h2>Bring the details into focus</h2>
          <p className="muted">
            {state.ai.enabled
              ? "Drop a poster image and Claude will read it, or paste the text."
              : "Paste the poster’s text in labeled lines, or try a sample."}
          </p>
          <div className="sample-controls">
            <button
              className="chip-button"
              onClick={() => {
                setText(samples.hack);
                setDraft(null);
                setError("");
              }}
            >
              <Icon name="poster" size={14} /> Hackathon sample
            </button>
            <button
              className="chip-button"
              onClick={() => {
                setText(samples.clash);
                setDraft(null);
                setError("");
              }}
            >
              <Icon name="warning" size={14} /> Timetable clash sample
            </button>
          </div>
          <label
            className={`upload-zone ${image ? "has-image" : ""} ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              choose(e.dataTransfer.files[0]);
            }}
          >
            {image ? (
              <>
                <img src={image.url} alt={`Preview of ${image.name}`} />
                <span>
                  {image.name} ·{" "}
                  {state.ai.enabled ? "Claude will read this" : "preview only"} ·
                  click to replace
                </span>
              </>
            ) : (
              <>
                <Icon name="image" size={28} />
                <strong>Drop a poster into your orbit</strong>
                <span>or click to choose · PNG, JPG, WebP · up to 5 MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Choose poster image"
              onChange={(e) => choose(e.target.files[0])}
            />
          </label>
          <label className="form-label" htmlFor="poster-text">
            Poster text {image && state.ai.enabled && <span className="optional">optional notes</span>}
            <textarea
              id="poster-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setDraft(null);
              }}
              rows="9"
              maxLength="4000"
              placeholder={"Event: …\nDate: YYYY-MM-DD\nStart: HH:MM\nEnd: HH:MM\nVenue: …"}
            />
          </label>
          {error && (
            <p role="alert" className="form-error">
              <Icon name="warning" size={16} />
              {error}
            </p>
          )}
          <button className="button" onClick={extract} disabled={reading || !canRead}>
            {reading ? (
              <>
                <span className="spinner" />
                {image && state.ai.enabled ? "Claude is reading…" : "Finding the details…"}
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
            <div className="draft-reveal">
              <span className="pill mint">
                <Icon name="check" size={15} />
                {source === "claude" ? "Read by Claude" : "Parsed from text"} · review
                before adding
              </span>
              <form
                className="form-stack"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    draft.date < DEMO_DATE ||
                    draft.deadline < DEMO_DATE ||
                    draft.deadline > draft.date ||
                    draft.end <= draft.start
                  ) {
                    setError(
                      "Check the dates and times: the deadline must be today or later and no later than the event, and the end must follow the start.",
                    );
                    return;
                  }
                  setError("");
                  const { id: _id, ...fields } = draft;
                  if (await onPublish(fields)) setDraft(null);
                }}
              >
                <label>
                  Event title
                  <input
                    required
                    maxLength="100"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Host
                    <input
                      required
                      maxLength="60"
                      value={draft.club}
                      onChange={(e) => setDraft({ ...draft, club: e.target.value })}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    >
                      {["Technology", "Hackathons", "Design", "Culture", "Career", "Sports"].map(
                        (c) => (
                          <option key={c}>{c}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label>
                    Date
                    <input
                      required
                      type="date"
                      min={DEMO_DATE}
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
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
                      onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                    />
                  </label>
                  <label>
                    Starts
                    <input
                      required
                      type="time"
                      value={clock(draft.start)}
                      onChange={(e) =>
                        e.target.value && setDraft({ ...draft, start: toMinutes(e.target.value) })
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
                        e.target.value && setDraft({ ...draft, end: toMinutes(e.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Venue
                    <input
                      required
                      maxLength="100"
                      value={draft.venue}
                      onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                    />
                  </label>
                  <label>
                    Seats
                    <input
                      type="number"
                      required
                      min="1"
                      max="5000"
                      value={draft.capacity}
                      onChange={(e) => setDraft({ ...draft, capacity: Number(e.target.value) })}
                    />
                  </label>
                </div>
                {student && (
                  <div className={`feasibility ${fit.ok ? "fits" : "conflict"}`}>
                    <Icon name={fit.ok ? "check" : "warning"} />
                    <div>
                      <strong>
                        {fit.ok ? "This one fits your day." : "A clash in your calendar."}
                      </strong>
                      <p>{fit.reason}</p>
                    </div>
                  </div>
                )}
                <div className="extracted-tags">
                  {draft.tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                  <span className="pill">Years {draft.years.join(", ")}</span>
                </div>
                <button className="button" type="submit" disabled={publishing}>
                  {publishing ? "Publishing…" : "Publish to CampusConnect"}
                  <Icon name="arrow" size={17} />
                </button>
                <p className="small-text muted">
                  {student
                    ? "Published as a student-shared listing so classmates can find it."
                    : "Published as an organizer event."}
                </p>
              </form>
            </div>
          ) : (
            <div className="poster-empty">
              <div className={`scanning-frame ${reading ? "scanning" : ""}`}>
                {image ? (
                  <img src={image.url} alt="" />
                ) : (
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
                )}
                <div className="scan-line" />
              </div>
              <h2>
                {reading ? "Connecting the details…" : "A plan is hiding in that poster."}
              </h2>
              <p className="muted">
                Event, venue, eligibility, deadline, and a timetable check.
                Everything you need to say yes.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
