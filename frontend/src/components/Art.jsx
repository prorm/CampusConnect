export default function Art({ kind = "orbit", className = "" }) {
  return (
    <div className={`abstract-art art-${kind} ${className}`} aria-hidden="true">
      {kind === "orbit" ? (
        <>
          <i />
          <i />
          <i />
          <b />
        </>
      ) : kind === "cube" ? (
        <>
          <i />
          <i />
          <i />
        </>
      ) : kind === "steps" ? (
        Array.from({ length: 5 }, (_, i) => <i key={i} style={{ "--i": i }} />)
      ) : (
        Array.from({ length: 7 }, (_, i) => <i key={i} style={{ "--i": i }} />)
      )}
    </div>
  );
}
