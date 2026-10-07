import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { Brand } from "../pages/Landing";
const studentNav = [
  ["today", "sun", "My campus today"],
  ["explore", "compass", "Discover"],
  ["schedule", "calendar", "My schedule"],
  ["poster", "poster", "Poster intelligence"],
  ["passport", "passport", "Skill passport"],
  ["communities", "users", "Communities"],
];
const organizerNav = [
  ["organizer", "grid", "Event workspace"],
  ["poster", "poster", "Poster intelligence"],
  ["communities", "users", "Communities"],
];
const adminNav = [
  ["admin", "shield", "Campus management"],
  ["organizer", "grid", "Event workspace"],
  ["communities", "users", "Communities"],
];
export default function AppShell({
  page,
  navigate,
  role,
  setRole,
  onHome,
  onAssistant,
  onReset,
  children,
  storageError,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null),
    sidebar = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    sidebar.current?.querySelector("button")?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menuOpen]);
  const nav =
    role === "student"
      ? studentNav
      : role === "coordinator"
        ? organizerNav
        : adminNav;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#app-main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("app-main");
          main?.focus();
          main?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      <aside ref={sidebar} className={`sidebar ${menuOpen ? "open" : ""}`}>
        <Brand onClick={onHome} />
        <div className="campus-location">
          <span className="live-dot" />
          Ramaiah Institute of Technology<small>Your campus, connected.</small>
        </div>
        <nav aria-label="Workspace navigation">
          {nav.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => {
                navigate(id);
                setMenuOpen(false);
              }}
              className={`side-link ${page === id ? "active" : ""}`}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon name={icon} size={19} />
              {label}
              {id === "today" && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="assistant-prompt glass" onClick={onAssistant}>
            <span>
              <Icon name="spark" />A little guidance?
            </span>
            <small>Ask your campus assistant</small>
            <Icon name="arrow" size={16} />
          </button>
          <label className="role-switch">
            Demo workspace
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setMenuOpen(false);
              }}
            >
              <option value="student">Student · Pranav</option>
              <option value="coordinator">Coordinator · Rajesh</option>
              <option value="admin">Admin · Ananya</option>
            </select>
          </label>
          <button className="side-link" onClick={onHome}>
            <Icon name="logout" size={18} />
            Back to the landing
          </button>
          <button
            className="side-link reset-demo"
            onClick={() => {
              setMenuOpen(false);
              onReset();
            }}
          >
            <Icon name="compass" size={16} />
            Reset local demo
          </button>
          <div className="profile">
            <span className="avatar">
              {role === "student" ? "PM" : role === "coordinator" ? "RS" : "AS"}
            </span>
            <div>
              <strong>
                {role === "student"
                  ? "Pranav R Mane"
                  : role === "coordinator"
                    ? "Dr. Rajesh Sharma"
                    : "Prof. Ananya Sen"}
              </strong>
              <small>
                {role === "student"
                  ? "Computer Science · Year 3"
                  : role === "coordinator"
                    ? "CodeCraft · Faculty lead"
                    : "Dean of Student Affairs"}
              </small>
            </div>
          </div>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="app-body">
        <header className="workspace-header">
          <button
            ref={menuButton}
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            Your campus<span>/</span>
            <strong>
              {[...studentNav, ...organizerNav, ...adminNav].find(
                (n) => n[0] === page,
              )?.[2] || "Discover"}
            </strong>
          </div>
          <div className="header-right">
            <span className="demo-label">
              <span className="live-dot" />
              Interactive demo
            </span>
            <button
              className="icon-button"
              aria-label="Open campus assistant"
              onClick={onAssistant}
            >
              <Icon name="spark" />
            </button>
            <span className="avatar small-avatar">
              {role === "student" ? "PM" : role === "coordinator" ? "RS" : "AS"}
            </span>
          </div>
        </header>
        {storageError && (
          <div role="status" className="storage-warning">
            Browser storage is unavailable. Changes will last until this page is
            refreshed.
          </div>
        )}
        <main
          id="app-main"
          tabIndex={-1}
          className="workspace-content"
          key={page}
        >
          {children}
        </main>
        <footer className="workspace-footer">
          <span>Make room for possibility.</span>
          <span>Local demo · Wed, 7 Oct 2026 · 12:20 IST</span>
        </footer>
      </div>
    </div>
  );
}
