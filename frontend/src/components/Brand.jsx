export function BrandMark({ className = "" }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="CampusConnect home">
      <BrandMark />
      <span className="brand-word">
        campus<span>connect</span>
      </span>
    </button>
  );
}
