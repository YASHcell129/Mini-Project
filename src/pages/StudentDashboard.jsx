import React, { useEffect, useRef, useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import "../style.css";

const ModuleIcon = ({ kind }) => {
  const icons = {
    attendance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 14 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    timetable: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    assessment: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5h8M8 9h8M8 13h5M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    admitCard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12.5 9h4M12.5 12h4M8 15h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    assignments: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4h6M8 7h8M7 4h10a2 2 0 0 1 2 2v13l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 11 1.5 1.5L15 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    circular: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h7l3 3v11a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 5v4h4M8 13h8M8 16h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    courses: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 7 8-3 8 3-8 3-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 9.5V15c0 1.1 2.2 2 5 2s5-.9 5-2V9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    feedback: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.5 10.5h7M8.5 13.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    fees: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4v2M16 4v2M8 18v2M16 18v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    reportCard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 9h6M9 12h6M9 15h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    performance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 16V9M12 16V6M17 16v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    survey: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h10a2 2 0 0 1 2 2v11l-4-2-3 2-3-2-4 2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 10 1.5 1.5L15 7M9 14h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return icons[kind] || null;
};

const modules = [
  { title: "Attendance", icon: "attendance" },
  { title: "Time Table", icon: "timetable" },
  { title: "Assesments", icon: "assessment" },
  { title: "Admit Card", icon: "admitCard" },
  { title: "Assignments", icon: "assignments" },
  { title: "Circular", icon: "circular" },
  { title: "Courses", icon: "courses" },
  { title: "Feedback", icon: "feedback" },
  { title: "Fees", icon: "fees" },
  { title: "My Report Card", icon: "reportCard" },
  { title: "Performances", icon: "performance" },
  { title: "Survey", icon: "survey" }
];

const StudentDashboard = ({ name }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [concern, setConcern] = useState("");
  const [showConcernRaised, setShowConcernRaised] = useState(false);
  const [displayName, setDisplayName] = useState(name || "Student");
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
    if (!helpOpen && !logoutConfirmOpen && !resetPasswordOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setLogoutConfirmOpen(false);
        setResetPasswordOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [helpOpen, logoutConfirmOpen, resetPasswordOpen]);

  const handleModuleClick = (section) => {
    if (section === "Circular") {
      window.location.href = "/student/circulars";
      return;
    }

    // ...existing code...

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
    } else if (action === "Reset Password") {
      setResetPasswordOpen(true);
    } else if (action === "Profile") {
      window.location.href = "/profile";
    } else if (action === "Help") {
      setHelpOpen(true);
    } else {
      alert(`${action} clicked`);
    }
  };

  return (
    <div className={`student-portal ${sidebarExpanded ? "sidebar-expanded" : ""}`}>
      <aside className="portal-sidebar" aria-label="Student navigation">
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
            <div className="portal-campus-badge">ACAD-HUB STUDENT PORTAL</div>
            <div className="portal-campus-subtitle">School of Engineering & Technology</div>
          </div>

          <div className="portal-topbar-right" ref={menuRef}>
            <button
              type="button"
              className="portal-notify-btn"
              aria-label="Notifications"
              onClick={() => {
                window.location.href = "/student/notifications";
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
              <button type="button" className="menu-item" onClick={() => handleMenuAction("Reset Password")}>
                Reset Password
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
            <p className="portal-eyebrow">Student Dashboard</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="portal-intro">
              Quick access to the modules you kept from the reference design.
            </p>
          </div>
        </section>

        <section className="portal-grid" aria-label="Student modules">
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
            aria-labelledby="help-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="help-modal-title">Raise a Concern</h3>
            <p>Describe the issue you want to report.</p>
            <form onSubmit={handleConcernSubmit}>
              <label className="help-label" htmlFor="concern-message">
                Your concern
              </label>
              <textarea
                id="concern-message"
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
      <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
    </div>
  );
};

export default StudentDashboard;
import React, { useEffect, useRef, useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import "../style.css";

const ModuleIcon = ({ kind }) => {
  const icons = {
    attendance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 14 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    timetable: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    assessment: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5h8M8 9h8M8 13h5M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    admitCard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12.5 9h4M12.5 12h4M8 15h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    assignments: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4h6M8 7h8M7 4h10a2 2 0 0 1 2 2v13l-4-2-3 2-3-2-4 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 11 1.5 1.5L15 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    circular: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h7l3 3v11a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 5v4h4M8 13h8M8 16h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    courses: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 7 8-3 8 3-8 3-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 9.5V15c0 1.1 2.2 2 5 2s5-.9 5-2V9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    feedback: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.5 10.5h7M8.5 13.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    fees: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4v2M16 4v2M8 18v2M16 18v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    reportCard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 9h6M9 12h6M9 15h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    performance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 16V9M12 16V6M17 16v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    survey: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h10a2 2 0 0 1 2 2v11l-4-2-3 2-3-2-4 2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 10 1.5 1.5L15 7M9 14h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return icons[kind] || null;
};

const modules = [
  { title: "Attendance", icon: "attendance" },
  { title: "Time Table", icon: "timetable" },
  { title: "Assesments", icon: "assessment" },
  { title: "Admit Card", icon: "admitCard" },
  { title: "Assignments", icon: "assignments" },
  { title: "Circular", icon: "circular" },
  { title: "Courses", icon: "courses" },
  { title: "Feedback", icon: "feedback" },
  { title: "Fees", icon: "fees" },
  { title: "My Report Card", icon: "reportCard" },
  { title: "Performances", icon: "performance" },
  { title: "Survey", icon: "survey" }
];

const StudentDashboard = ({ name }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [concern, setConcern] = useState("");
  const [showConcernRaised, setShowConcernRaised] = useState(false);
  const [displayName, setDisplayName] = useState(name || "Student");
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
    if (!helpOpen && !logoutConfirmOpen && !resetPasswordOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setLogoutConfirmOpen(false);
        setResetPasswordOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [helpOpen, logoutConfirmOpen, resetPasswordOpen]);

  const handleModuleClick = (section) => {
    if (section === "Admit Card") {
      window.location.href = "/student/admit-card";
      return;
    }

    if (section === "Circular") {
      window.location.href = "/student/circulars";
      return;
    }

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
    } else if (action === "Reset Password") {
      setResetPasswordOpen(true);
    } else if (action === "Profile") {
      window.location.href = "/profile";
    } else if (action === "Help") {
      setHelpOpen(true);
    } else {
      alert(`${action} clicked`);
    }
  };

  return (
    <div className={`student-portal ${sidebarExpanded ? "sidebar-expanded" : ""}`}>
      <aside className="portal-sidebar" aria-label="Student navigation">
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
            <div className="portal-campus-badge">ACAD-HUB STUDENT PORTAL</div>
            <div className="portal-campus-subtitle">School of Engineering & Technology</div>
          </div>

          <div className="portal-topbar-right" ref={menuRef}>
            <button
              type="button"
              className="portal-notify-btn"
              aria-label="Notifications"
              onClick={() => {
                window.location.href = "/student/notifications";
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
              <button type="button" className="menu-item" onClick={() => handleMenuAction("Reset Password")}>
                Reset Password
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
            <p className="portal-eyebrow">Student Dashboard</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="portal-intro">
              Quick access to the modules you kept from the reference design.
            </p>
          </div>
        </section>

        <section className="portal-grid" aria-label="Student modules">
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
            aria-labelledby="help-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="help-modal-title">Raise a Concern</h3>
            <p>Describe the issue you want to report.</p>
            <form onSubmit={handleConcernSubmit}>
              <label className="help-label" htmlFor="concern-message">
                Your concern
              </label>
              <textarea
                id="concern-message"
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
      <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
    </div>
  );
};

export default StudentDashboard;
