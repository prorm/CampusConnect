import { useRef, useState } from "react";
import Icon from "../components/Icon";
import Art from "../components/Art";
import Atmosphere from "../components/Atmosphere";

export function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="CampusConnect home">
      <span className="brand-mark">
        <span />
        <span />
        <span />
      </span>
      <span>
        campus<span className="brand-light">connect</span>
        <small>MAKE ROOM FOR POSSIBILITY</small>
      </span>
    </button>
  );
}

export default function Landing({ onEnter }) {
  const [paused, setPaused] = useState(false);
  const scene = useRef(null);
  const move = (e) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty(
      "--mx",
      `${(e.clientX - rect.left) / rect.width - 0.5}`,
    );
    scene.current?.style.setProperty(
      "--my",
      `${(e.clientY - rect.top) / rect.height - 0.5}`,
    );
  };
  return (
    <div className={`landing ${paused ? "motion-paused" : ""}`}>
      <a className="skip-link" href="#landing-main">
        Skip to content
      </a>
      <header className="landing-nav">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <nav aria-label="Main navigation">
          <a href="#possibilities">The possibilities</a>
          <a href="#how-it-works">How it works</a>
          <button className="text-button" onClick={() => onEnter("organizer")}>
            For organizers <Icon name="arrow" size={16} />
          </button>
        </nav>
        <button className="button small" onClick={() => onEnter("today")}>
          Enter campus <Icon name="arrow" size={16} />
        </button>
      </header>
      <main id="landing-main">
        <section
          className="hero"
          onPointerMove={move}
          onPointerLeave={() => {
            scene.current?.style.setProperty("--mx", 0);
            scene.current?.style.setProperty("--my", 0);
          }}
        >
          <Atmosphere paused={paused} />
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-copy">
            <h1>
              Your next
              <br />
              big thing is
              <br />
              <span className="hero-word">
                right here.
                <svg viewBox="0 0 440 24" aria-hidden="true">
                  <path d="M3 16C110 0 315 3 432 13" />
                </svg>
              </span>
            </h1>
            <p>
              The workshop that clicks. The people who get you.
              <br className="desktop-break" /> The hour between classes that
              changes everything.
              <br className="desktop-break" /> Meet a campus that moves with
              you.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => onEnter("today")}>
                Find my next opportunity <Icon name="arrow" />
              </button>
              <a className="secondary-link" href="#how-it-works">
                <span className="play-circle">
                  <Icon name="play" size={13} />
                </span>
                See the connection
              </a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>PM</span>
                <span>SJ</span>
                <span>PN</span>
                <span>+</span>
              </div>
              <div>
                Your interests. Your timetable. Your possibilities.
                <small>
                  Built for life at Ramaiah Institute of Technology.
                </small>
              </div>
            </div>
          </div>
          <div
            className="hero-scene"
            ref={scene}
            aria-label="Preview of a personalized campus opportunity"
          >
            <div className="orbit-label orbit-label-one">
              <span className="live-dot" /> YOUR CAMPUS, CONNECTED
            </div>
            <div className="floating-chip chip-time glass">
              <span className="chip-icon">
                <Icon name="clock" />
              </span>
              <div>
                A gap in your day.<strong>1h 40m of possibility</strong>
              </div>
            </div>
            <div className="hero-event glass">
              <div className="preview-top">
                <span>
                  <Icon name="spark" size={14} /> Picked for your next chapter
                </span>
                <span className="tiny-dots">•••</span>
              </div>
              <div className="preview-art mint">
                <Art kind="orbit" />
                <span className="art-caption">THINK IT. BUILD IT.</span>
                <span className="match-tag">
                  94% match <Icon name="spark" size={12} />
                </span>
              </div>
              <div className="preview-body">
                <span className="muted small-text">
                  CODECRAFT · TODAY, 12:45 PM
                </span>
                <h2>
                  Build your first
                  <br />
                  AI agent.
                </h2>
                <div className="preview-meta">
                  <span>
                    <Icon name="pin" size={14} />4 min away
                  </span>
                  <span>
                    <Icon name="users" size={14} />
                    11 seats left
                  </span>
                </div>
                <div className="preview-fit">
                  <Icon name="check" size={15} /> Ends before your next class
                </div>
                <button
                  className="button preview-cta"
                  onClick={() => onEnter("today")}
                >
                  That’s my kind of thing <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
            <div className="floating-chip chip-growth glass">
              <span className="growth-stamp">
                <Icon name="passport" size={24} />
              </span>
              <div>
                Every experience counts.<strong>Your story, verified.</strong>
                <div className="mini-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <div className="floating-chip chip-fit glass">
              <span className="live-dot" /> Fits your day. Fuels your future.
            </div>
            <div className="orbit-coordinate">
              12.20 PM / INFINITE POSSIBILITIES
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#possibilities">
              <span className="scroll-line" />A campus worth exploring
            </a>
            <button
              className="motion-toggle"
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
            >
              {paused ? "Resume motion" : "Pause motion"}
              <span>{paused ? "▶" : "Ⅱ"}</span>
            </button>
          </div>
        </section>
        <div className="campus-marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 2 }, (_, i) => (
              <span key={i}>
                MAKE SOMETHING <Icon name="spark" /> FIND YOUR PEOPLE{" "}
                <Icon name="spark" /> FOLLOW YOUR CURIOSITY{" "}
                <Icon name="spark" /> GROW BEYOND CLASS <Icon name="spark" />
              </span>
            ))}
          </div>
        </div>
        <section className="possibilities section-wrap" id="possibilities">
          <div className="section-intro">
            <h2>
              Less “I wish I knew.”
              <br />
              <span className="muted">More “I was there.”</span>
            </h2>
            <p>
              Your campus is full of things worth doing. CampusConnect brings
              the right ones into your orbit, at the right time.
            </p>
          </div>
          <div className="feature-composition">
            <div className="feature-major glass">
              <div className="feature-copy">
                <Icon name="compass" size={28} />
                <h3>
                  Find the extraordinary
                  <br />
                  in your everyday.
                </h3>
                <p>
                  Have 45 minutes or two hours? Discover opportunities that fit
                  the space between your classes.
                </p>
                <button
                  className="text-button mint-text"
                  onClick={() => onEnter("explore")}
                >
                  Explore your free time <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="free-time-visual">
                <div className="time-window">
                  <Icon name="clock" />
                  <span>FREE UNTIL 2:00 PM</span>
                  <strong>
                    100<span>min</span>
                  </strong>
                </div>
                <div className="mini-opportunity">
                  <span className="mini-art mint">
                    <Art />
                  </span>
                  <div>
                    <strong>Build your first AI agent</strong>
                    <small>55 min · 4 min walk · Made for you</small>
                  </div>
                  <Icon name="check" />
                </div>
              </div>
            </div>
            <button
              className="feature-poster glass"
              onClick={() => onEnter("poster")}
            >
              <div className="poster-paper">
                <span>CODECRAFT PRESENTS</span>
                <strong>
                  IDEAS
                  <br />
                  INTO
                  <br />
                  <em>REALITY.</em>
                </strong>
                <small>07 OCT / INNOVATION LAB</small>
              </div>
              <div>
                <h3>A poster. A possibility.</h3>
                <p>
                  Turn scattered event details into a plan you can actually
                  make.
                </p>
              </div>
              <span className="round-arrow">
                <Icon name="arrow" />
              </span>
            </button>
            <button
              className="feature-passport glass"
              onClick={() => onEnter("passport")}
            >
              <div>
                <Icon name="passport" size={28} />
                <h3>
                  Build a story.
                  <br />
                  Not a folder of certificates.
                </h3>
                <p>
                  A skill passport that grows with every verified experience.
                </p>
              </div>
              <div className="passport-decoration">
                <span>PRANAV R MANE</span>
                <strong>
                  Curiosity,
                  <br />
                  on record.
                </strong>
                <span>
                  <Icon name="shield" size={14} /> CAMPUS SKILL PASSPORT
                </span>
              </div>
              <span className="round-arrow">
                <Icon name="arrow" />
              </span>
            </button>
          </div>
        </section>
        <section className="connection-section section-wrap" id="how-it-works">
          <div className="section-intro">
            <h2>
              Small moments.
              <br />A bigger version of you.
            </h2>
            <p>
              One connected journey, from “that looks interesting” to “look what
              I can do.”
            </p>
          </div>
          <div className="journey">
            {[
              ["compass", "Discover", "Your interests meet your free time."],
              ["clock", "Decide", "Know if you can actually make it."],
              ["users", "Attend", "Show up. Make a connection."],
              ["shield", "Verify", "Your participation, on record."],
              ["passport", "Grow", "Let your next chapter begin."],
            ].map(([icon, title, text], i) => (
              <div className="journey-step" key={title}>
                <span>
                  <Icon name={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                {i < 4 && <i className="journey-line" />}
              </div>
            ))}
          </div>
        </section>
        <section className="organizer-landing section-wrap">
          <div className="organizer-inner glass">
            <div>
              <h2>
                You bring the idea.
                <br />
                <span className="muted">We bring it together.</span>
              </h2>
              <p>
                Less group-chat chaos. More people in the room. Plan events,
                understand turnout, manage waitlists, and connect attendance to
                real growth.
              </p>
              <button
                className="button secondary"
                onClick={() => onEnter("organizer")}
              >
                Meet your organizer workspace <Icon name="arrow" />
              </button>
            </div>
            <div className="attendance-visual">
              <span>
                <span className="live-dot" /> YOUR NEXT WORKSHOP
              </span>
              <div className="attendance-bars">
                <i style={{ height: "85%" }} />
                <i style={{ height: "67%" }} />
                <i style={{ height: "94%" }} />
                <i style={{ height: "77%" }} />
                <i style={{ height: "89%" }} />
                <i style={{ height: "72%" }} />
                <i style={{ height: "82%" }} />
              </div>
              <div className="attendance-labels">
                <span>Registrations</span>
                <strong>Turnout, understood.</strong>
              </div>
              <small>Illustrative attendance forecast · frontend demo</small>
            </div>
          </div>
        </section>
        <section className="final-cta section-wrap">
          <div className="cta-orbit" aria-hidden="true" />
          <h2>
            Make today
            <br />
            <span className="mint-text">a little bigger.</span>
          </h2>
          <button className="button" onClick={() => onEnter("today")}>
            Your campus is waiting <Icon name="arrow" />
          </button>
          <p>No account needed. Step into the interactive demo.</p>
        </section>
      </main>
      <footer className="landing-footer section-wrap">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <p>
          Made with curiosity at Ramaiah Institute of Technology.
          <small>Sinchana Jeppu · Pranav R Mane · Prajwal N</small>
        </p>
        <span>© 2026 CampusConnect</span>
      </footer>
    </div>
  );
}
