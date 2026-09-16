import React from 'react';

// Basic React Component: CertificateModal
// Generates and renders a formal college participation certificate
// Eligible students who attended an event can view and print their certificate.
function CertificateModal({ isOpen, onClose, registration }) {
  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container certificate-container" onClick={(e) => e.stopPropagation()}>
        {/* Actions bar */}
        <div className="certificate-actions no-print">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handlePrint}>🖨️ Print / Save as PDF</button>
        </div>

        {/* Certificate Frame */}
        <div className="certificate-frame">
          <div className="certificate-border-inner">
            <div className="cert-header">
              <div className="cert-logo">🏛️</div>
              <h1 className="cert-college">RAMAIAH INSTITUTE OF TECHNOLOGY</h1>
              <p className="cert-dept">Office of Student Affairs & Extracurricular Activities</p>
              <div className="cert-ribbon">CERTIFICATE OF PARTICIPATION</div>
            </div>

            <div className="cert-body">
              <p className="cert-lead">This is proudly awarded to</p>
              <h2 className="cert-student-name">{registration.studentName}</h2>
              <p className="cert-usn">USN: <strong>{registration.studentUsn}</strong> | Department of {registration.department}</p>

              <p className="cert-desc">
                for active participation and successful completion of the campus event
              </p>
              <h3 className="cert-event-title">"{registration.eventTitle}"</h3>
              <p className="cert-meta">
                Organized by <strong>{registration.clubName}</strong> on <strong>{registration.eventDate}</strong>.
              </p>
            </div>

            <div className="cert-footer">
              <div className="cert-sign">
                <div className="sign-line"></div>
                <span>Faculty Coordinator</span>
                <small>CampusConnect Council</small>
              </div>

              <div className="cert-badge-center">
                <div className="cert-seal">
                  ★ VERIFIED ★
                  <br />
                  <span>CAMPUS CONNECT</span>
                </div>
                <small className="cert-id">ID: CC-{registration.id.toUpperCase()}-2026</small>
              </div>

              <div className="cert-sign">
                <div className="sign-line"></div>
                <span>Dean of Student Affairs</span>
                <small>Head of Activities</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
