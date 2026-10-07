import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { Brand } from "./Brand";
import useSpotlight from "../hooks/useSpotlight";
import { NAV, PAGE_META } from "../data/nav";
import { clock, DEMO_NOW } from "../data/campus";

const ROLE_LABEL = {
  student: "Student",
  coordinator: "Coordinator",
  admin: "Administrator",
};

export default function AppShell({
  page,
  navigate,
  user,
  demoAccounts,
  onSwitchAccount,
  onHome,
  onSignOut,
  onAssistant,
  onReset,
  ai,
  busy,
  children,
}) {
  useSpotlight();
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
  const go = (id) => {
    navigate(id);
    setMenuOpen(false);
  };
  const demoEmail = demoAccounts.find((a) => a.email === user.email)?.email;

  return (
    <div className="app-shell">
      <div className="aurora-field quiet" aria-hidden="true" />
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
      <aside
        ref={sidebar}
        className={`sidebar ${menuOpen ? "open" : ""}`}
        aria-label="Workspace"
      >
        <Brand onClick={onHome} />
        <div className="campus-location">
          <span className="live-dot" />
          <span>
            Ramaiah Institute of Technology
            <small>{ROLE_LABEL[user.role]} workspace</small>
          </span>
        </div>
        <nav aria-label="Workspace navigation" className="side-nav">
          {NAV[user.role].map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`side-link ${page === id ? "active" : ""}`}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon name={PAGE_META[id][0]} size={19} />
              {PAGE_META[id][1]}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="assistant-prompt spot" onClick={onAssistant}>
            <span className="assistant-orb" aria-hidden="true">
              <Icon name="spark" size={16} />
            </span>
            <span>
              Ask your campus
              <small>{ai.enabled ? "Claude-powered assistant" : "Campus assistant"}</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>
          {demoEmail && (
            <label className="role-switch">
              Switch demo account
              <select
                value={demoEmail}
                disabled={busy}
                onChange={(e) => {
                  setMenuOpen(false);
                  onSwitchAccount(e.target.value);
                }}
              >
                {demoAccounts.map((a) => (
                  <option key={a.email} value={a.email}>
                    {ROLE_LABEL[a.role]} · {a.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="profile">
            <span className="avatar">{user.initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.title}</small>
            </div>
            <button
              className="icon-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={onSignOut}
            >
              <Icon name="logout" size={17} />
            </button>
          </div>
          {onReset && (
            <button
              className="text-button reset-demo"
              onClick={() => {
                setMenuOpen(false);
                onReset();
              }}
            >
              <Icon name="refresh" size={14} />
              Reset demo campus
            </button>
          )}
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
            <span>Your campus</span>
            <Icon name="chevron" size={14} />
            <strong>{PAGE_META[page][1]}</strong>
          </div>
          <div className="header-right">
            <span className="clock-chip" title="Campus clock (fixed for the demo)">
              <span className="live-dot" />
              Wed 7 Oct · {clock(DEMO_NOW)}
            </span>
            <span className={`ai-chip ${ai.enabled ? "on" : ""}`}>
              <Icon name="spark" size={13} />
              {ai.enabled ? "Claude on" : "Rule-based AI"}
            </span>
            <button
              className="icon-button"
              aria-label="Open campus assistant"
              onClick={onAssistant}
            >
              <Icon name="chat" />
            </button>
            <span className="avatar small-avatar" aria-hidden="true">
              {user.initials}
            </span>
          </div>
        </header>
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
          <span>CampusConnect · MERN · Ramaiah Institute of Technology</span>
        </footer>
      </div>
    </div>
  );
}
