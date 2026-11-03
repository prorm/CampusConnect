import Icon from "./Icon";
import { BrandMark } from "./Brand";

export function Splash() {
  return (
    <div className="status-screen" role="status" aria-live="polite">
      <div className="aurora-field" aria-hidden="true" />
      <BrandMark className="splash-mark" />
      <p>Connecting your campus…</p>
    </div>
  );
}

export function Offline({ message, onRetry, onHome }) {
  return (
    <div className="status-screen" role="alert">
      <div className="aurora-field" aria-hidden="true" />
      <span className="status-icon">
        <Icon name="offline" size={30} />
      </span>
      <h1>The campus API isn’t answering.</h1>
      <p>{message || "The backend could not be reached."}</p>
      <ol className="status-steps">
        <li>
          Start MongoDB, then run <code>npm run dev</code> in{" "}
          <code>backend/</code>.
        </li>
        <li>
          Check <code>MONGO_URI</code> in <code>backend/.env</code>.
        </li>
      </ol>
      <div className="action-row">
        <button className="button" onClick={onRetry}>
          <Icon name="refresh" size={17} />
          Try again
        </button>
        <button className="button secondary" onClick={onHome}>
          Back to the landing
        </button>
      </div>
    </div>
  );
}
