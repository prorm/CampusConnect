import { useState } from "react";
import Icon from "../components/Icon";
import { Brand } from "../components/Brand";
import Art from "../components/Art";
import { api } from "../api/client";
import { SKILLS } from "../data/campus";

const ROLE_COPY = {
  student: ["sun", "Plan around my timetable"],
  coordinator: ["grid", "Run events and check-ins"],
  admin: ["shield", "Approve communities, read analytics"],
};

export default function AuthPage({
  demoAccounts,
  onSession,
  onHome,
  signedIn,
  onContinue,
}) {
  const [mode, setMode] = useState("signin"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(""),
    [interests, setInterests] = useState(["AI / ML"]),
    [show, setShow] = useState(false);

  const attempt = async (key, call) => {
    setBusy(key);
    setError("");
    try {
      onSession(await call());
    } catch (e) {
      setError(e.message);
      setBusy("");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (mode === "signin") attempt("form", () => api.login(f.email, f.password));
    else
      attempt("form", () =>
        api.register({
          name: f.name,
          email: f.email,
          password: f.password,
          usn: f.usn,
          department: f.department,
          year: Number(f.year),
          interests,
        }),
      );
  };

  return (
    <div className="auth-page">
      <div className="aurora-field" aria-hidden="true" />
      <header className="auth-header">
        <Brand onClick={onHome} />
        <button className="text-button" onClick={onHome}>
          Back to the landing <Icon name="arrow" size={15} />
        </button>
      </header>
      <main className="auth-layout">
        <section className="auth-story" aria-hidden="true">
          <div className="auth-orbit">
            <Art kind="orbit" />
          </div>
          <h2>
            One sign-in.
            <br />
            <span>Every hour between classes.</span>
          </h2>
          <ul>
            <li>
              <Icon name="clock" size={17} /> Opportunities that fit your real
              timetable
            </li>
            <li>
              <Icon name="users" size={17} /> Waitlists that move in order
            </li>
            <li>
              <Icon name="shield" size={17} /> Attendance-verified skill
              passport
            </li>
          </ul>
        </section>

        <section className="auth-card glass" aria-labelledby="auth-title">
          {signedIn ? (
            <div className="auth-signed-in">
              <h1 id="auth-title">You’re already signed in.</h1>
              <button className="button" onClick={onContinue}>
                Continue to your campus <Icon name="arrow" size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="auth-tabs" role="tablist" aria-label="Account">
                {[
                  ["signin", "Sign in"],
                  ["signup", "Create account"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={mode === id}
                    className={mode === id ? "active" : ""}
                    onClick={() => {
                      setMode(id);
                      setError("");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <h1 id="auth-title">
                {mode === "signin" ? "Welcome back." : "Make room for possibility."}
              </h1>
              <p className="muted">
                {mode === "signin"
                  ? "Sign in to see what fits your day."
                  : "Student accounts start with a sample timetable you can edit in My schedule."}
              </p>

              <form className="form-stack" onSubmit={submit} key={mode}>
                {mode === "signup" && (
                  <label>
                    Full name
                    <span className="field-icon">
                      <Icon name="user" size={17} />
                      <input name="name" required maxLength="80" autoComplete="name" />
                    </span>
                  </label>
                )}
                <label>
                  College email
                  <span className="field-icon">
                    <Icon name="mail" size={17} />
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@college.edu"
                    />
                  </span>
                </label>
                <label>
                  Password
                  <span className="field-icon">
                    <Icon name="lock" size={17} />
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      required
                      minLength={mode === "signup" ? 8 : undefined}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      placeholder={mode === "signup" ? "At least 8 characters" : ""}
                    />
                    <button
                      type="button"
                      className="icon-button reveal"
                      aria-label={show ? "Hide password" : "Show password"}
                      aria-pressed={show}
                      onClick={() => setShow(!show)}
                    >
                      <Icon name="eye" size={16} />
                    </button>
                  </span>
                </label>
                {mode === "signup" && (
                  <>
                    <div className="form-grid">
                      <label>
                        USN <span className="optional">optional</span>
                        <input name="usn" maxLength="20" placeholder="1MS24CI000" />
                      </label>
                      <label>
                        Year
                        <select name="year" defaultValue="1">
                          <option value="1">Year 1</option>
                          <option value="2">Year 2</option>
                          <option value="3">Year 3</option>
                          <option value="4">Year 4</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      Department
                      <input name="department" maxLength="60" defaultValue="Computer Science" />
                    </label>
                    <fieldset className="interest-picker">
                      <legend>What are you curious about?</legend>
                      {SKILLS.map((skill) => {
                        const on = interests.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            aria-pressed={on}
                            className={on ? "active" : ""}
                            onClick={() =>
                              setInterests(
                                on
                                  ? interests.filter((i) => i !== skill)
                                  : [...interests, skill],
                              )
                            }
                          >
                            {on && <Icon name="check" size={13} />}
                            {skill}
                          </button>
                        );
                      })}
                    </fieldset>
                  </>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    <Icon name="warning" size={16} />
                    {error}
                  </p>
                )}
                <button className="button wide" type="submit" disabled={!!busy}>
                  {busy === "form"
                    ? mode === "signin"
                      ? "Signing in…"
                      : "Creating your account…"
                    : mode === "signin"
                      ? "Sign in"
                      : "Create my account"}
                  <Icon name="arrow" size={17} />
                </button>
              </form>

              {demoAccounts.length > 0 && (
                <div className="demo-accounts">
                  <p>
                    <span>Presentation accounts</span>
                  </p>
                  <div>
                    {demoAccounts.map((a) => (
                      <button
                        key={a.email}
                        className="demo-account spot"
                        disabled={!!busy}
                        onClick={() => attempt(a.email, () => api.demoLogin(a.email))}
                      >
                        <span className={`demo-icon ${a.role}`}>
                          <Icon name={ROLE_COPY[a.role][0]} size={17} />
                        </span>
                        <span>
                          <strong>{busy === a.email ? "Signing in…" : a.name}</strong>
                          <small>{ROLE_COPY[a.role][1]}</small>
                        </span>
                        <Icon name="arrow" size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
