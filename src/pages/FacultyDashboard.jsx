import React, { useEffect, useRef, useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import "../style.css";

const ModuleIcon = ({ kind }) => {
  const icons = {
    attendance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 14 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    assignments: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4h6M8 7h8M7 4h10a2 2 0 0 1 2 2v13l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 11 1.5 1.5L15 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    classes: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 19h8M10 16v3M14 16v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    marksEntry: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-4 2-4-2-3 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 10h6M9 14h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    notices: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4 5 7v5c0 4.2 3 7.2 7 8 4-0.8 7-3.8 7-8V7l-7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 9v4M12 16h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    leaveRequests: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4l-4 3v-3H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 10 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 19h12M8 16V9M12 16V5M16 16v-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    timetable: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return icons[kind] || null;
};

const modules = [
  { title: "Attendance", icon: "attendance" },
  { title: "Assignments", icon: "assignments" },
  { title: "Classes", icon: "classes" },
  { title: "Marks Entry", icon: "marksEntry" },
  { title: "Notices", icon: "notices" },
  { title: "Leave Requests", icon: "leaveRequests" },
  { title: "Student Reports", icon: "reports" },
  { title: "Time Table", icon: "timetable" }
];

const overview = [
  { label: "Department", value: "Computer Science" },
  { label: "Designation", value: "Assistant Professor" },
  { label: "Classes Today", value: "04" },
  { label: "Pending Reviews", value: "11" }
];

const actions = [
  { label: "Next Lecture", value: "B.Tech CSE - 10:30 AM" },
  { label: "Room", value: "Block B / 204" },
  { label: "Upcoming Deadline", value: "Assignment grading by 5:00 PM" },
  { label: "Class Advisor", value: "2nd Year Section A" }
];

const FacultyDashboard = ({ name }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [concern, setConcern] = useState("");
  const [showConcernRaised, setShowConcernRaised] = useState(false);
  const [displayName, setDisplayName] = useState(name || "Faculty");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  useEffect(() => {
    if (name) return;

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) setDisplayName(parsed.name);
        return;
      }

      const storedName = localStorage.getItem("userName");
      if (storedName) setDisplayName(storedName);
    } catch (e) {
      // ignore storage errors
    }
  }, [name]);

  useEffect(() => {
    if (!helpOpen && !logoutConfirmOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setLogoutConfirmOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [helpOpen, logoutConfirmOpen]);

  const handleModuleClick = (section) => {
    alert(`${section} section coming soon`);
    setUserMenuOpen(false);
  };

  const handleConcernSubmit = (e) => {
    e.preventDefault();
    if (!concern.trim()) return;

    setHelpOpen(false);
    setConcern("");
    setShowConcernRaised(true);

    window.setTimeout(() => {
      setShowConcernRaised(false);
    }, 2500);
  };

  const handleMenuAction = (action) => {
    setUserMenuOpen(false);

    if (action === "logout") {
      setLogoutConfirmOpen(true);
    } else if (action === "Help") {
      setHelpOpen(true);
    } else {
      alert(`${action} clicked`);
    }
  };

  return (
    <div className={`student-portal ${sidebarExpanded ? "sidebar-expanded" : ""}`}>
      <aside className="portal-sidebar" aria-label="Faculty navigation">
        <div className="portal-logo-wrap">
          <div className="portal-logo">AH</div>
          <div className="portal-logo-text">ACAD-HUB</div>
        </div>
        <div className="portal-sidebar-stack">
          {modules.map((module, index) => (
            <button
              key={module.title}
              type="button"
              className={`portal-sidebtn ${index === 0 ? "active" : ""}`}
              aria-label={module.title}
              onClick={() => handleModuleClick(module.title)}
            >
              <span className="portal-sidebtn-icon">
                <ModuleIcon kind={module.icon} />
              </span>
              <span className="portal-sidebtn-label">{module.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="portal-menu-trigger"
              aria-expanded={sidebarExpanded}
              aria-label="Toggle sidebar"
              onClick={() => setSidebarExpanded((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <div className="portal-menu-text">Menu</div>
          </div>

          <div className="portal-topbar-center">
            <div className="portal-campus-badge">ACAD-HUB FACULTY PORTAL</div>
            <div className="portal-campus-subtitle">Teaching, evaluation and class management</div>
          </div>

          <div className="portal-topbar-right" ref={menuRef}>
            <button
              type="button"
              className="portal-notify-btn"
              aria-label="Notifications"
              onClick={() => {
                window.location.href = "/faculty/notifications";
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="portal-notify-icon">
                <path d="M12 3a4 4 0 0 0-4 4v2.1c0 .7-.2 1.4-.6 2L6 13.5V15h12v-1.5l-1.4-2.4a4 4 0 0 1-.6-2V7a4 4 0 0 0-4-4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              className="portal-user-chip"
              onClick={() => {
                setUserMenuOpen((open) => !open);
              }}
            >
              <span className="portal-user-name">{displayName}</span>
              <span className="portal-avatar">{displayName.slice(0, 1).toUpperCase()}</span>
            </button>

            <div className={`portal-user-menu ${userMenuOpen ? "open" : ""}`}>
              <button type="button" className="menu-item" onClick={() => handleMenuAction("Profile")}>
                Profile
              </button>
              <button type="button" className="menu-item" onClick={() => handleMenuAction("Settings")}>
                Settings
              </button>
              <button type="button" className="menu-item" onClick={() => handleMenuAction("Help")}>
                Help
              </button>
              <div className="menu-divider" />
              <button type="button" className="menu-item logout" onClick={() => handleMenuAction("logout")}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="portal-hero">
          <div>
            <p className="portal-eyebrow">Faculty Dashboard</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="portal-intro">
              Track classes, assessments, and student activity from one place.
            </p>
          </div>
        </section>

        <section className="portal-summary-grid" aria-label="Faculty overview">
          {overview.map((item) => (
            <div key={item.label} className="portal-summary-card">
              <span className="portal-summary-label">{item.label}</span>
              <strong className="portal-summary-value">{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="portal-data-section">
          <div className="portal-section-heading">
            <h2>Today's Priorities</h2>
            <span className="portal-pill">Faculty</span>
          </div>
          <div className="portal-data-grid">
            {actions.map((item) => (
              <div key={item.label} className="portal-field-card">
                <span className="portal-field-label">{item.label}</span>
                <span className="portal-field-value">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="portal-grid" aria-label="Faculty modules">
          {modules.map((module) => (
            <button
              key={module.title}
              type="button"
              className="portal-module-card"
              onClick={() => handleModuleClick(module.title)}
            >
              <span className="portal-module-icon" aria-hidden="true">
                <ModuleIcon kind={module.icon} />
              </span>
              <span className="portal-module-title">{module.title}</span>
            </button>
          ))}
        </section>
      </main>

      {helpOpen ? (
        <div className="help-modal-overlay" onClick={() => setHelpOpen(false)} role="presentation">
          <div
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="faculty-help-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="faculty-help-modal-title">Raise a Concern</h3>
            <p>Describe the issue you want to report.</p>
            <form onSubmit={handleConcernSubmit}>
              <label className="help-label" htmlFor="faculty-concern-message">
                Your concern
              </label>
              <textarea
                id="faculty-concern-message"
                className="help-textarea"
                placeholder="Write your concern here..."
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                rows="5"
                required
              />
              <div className="help-actions">
                <button type="button" className="help-cancel-btn" onClick={() => setHelpOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="help-send-btn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showConcernRaised ? (
        <div className="concern-toast" role="status" aria-live="polite">
          {"Concern Raised\u2705"}
        </div>
      ) : null}

      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          setLogoutConfirmOpen(false);
          localStorage.removeItem("user");
          localStorage.removeItem("userName");
          window.location.href = "/";
        }}
      />
    </div>
  );
};

export default FacultyDashboard;
