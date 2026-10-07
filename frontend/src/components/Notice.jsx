import { useEffect, useRef } from "react";
import Icon from "./Icon";

export default function Notice({ notice, onClose }) {
  const error = notice?.tone === "error";
  const toast = useRef(null);
  // The toast lives in the top layer so it stays visible above open dialogs.
  // Re-showing it moves it above any dialog opened since the last message.
  useEffect(() => {
    const node = toast.current;
    if (!node?.showPopover) return;
    try {
      if (node.matches(":popover-open")) node.hidePopover();
      node.showPopover();
    } catch {
      /* Popover unsupported: the fixed-position fallback still applies. */
    }
  }, [notice?.id]);
  return (
    <div
      ref={toast}
      popover="manual"
      className={`toast ${notice ? "visible" : ""} ${error ? "error" : ""}`}
      role={error ? "alert" : "status"}
      aria-live={error ? "assertive" : "polite"}
    >
      {notice && (
        <>
          <span className="toast-icon">
            <Icon name={error ? "warning" : "check"} size={18} />
          </span>
          <span className="toast-text">{notice.text}</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
          {/* Restart the dismiss timer bar for every new message. */}
          <i className="toast-timer" key={notice.id} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
