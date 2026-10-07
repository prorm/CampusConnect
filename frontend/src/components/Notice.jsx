import Icon from "./Icon";
export default function Notice({ message, onClose }) {
  return (
    <div
      className={`toast glass ${message ? "visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <Icon name="check" />
          <span>{message}</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </>
      )}
    </div>
  );
}
