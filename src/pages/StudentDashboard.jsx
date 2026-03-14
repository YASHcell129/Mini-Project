import React, { useEffect, useRef, useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import "../style.css";

const modules = [
  { title: "Attendance", icon: "AT" },
  { title: "Time Table", icon: "TT" },
  { title: "Assesments", icon: "AM" },
  { title: "Admit Card", icon: "ID" },
  { title: "Assignments", icon: "AS" },
  { title: "Circular", icon: "CI" },
  { title: "Courses", icon: "CO" },
  { title: "Feedback", icon: "FB" },
  { title: "Fees", icon: "FE" },
  { title: "My Report Card", icon: "RC" },
  { title: "Performances", icon: "PF" },
  { title: "Survey", icon: "SV" }
];

const StudentDashboard = ({ name }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
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
              <span className="portal-sidebtn-icon">{module.icon}</span>
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
                {module.icon}
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
    </div>
  );
};

export default StudentDashboard;
