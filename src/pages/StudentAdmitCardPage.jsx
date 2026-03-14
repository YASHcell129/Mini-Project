import React, { useEffect, useRef, useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import "../style.css";

const StudentAdmitCardPage = () => {
  const [displayName, setDisplayName] = useState("Student");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [session, setSession] = useState("2025-26");
  const [semester, setSemester] = useState("Semester 4");
  const [examType, setExamType] = useState("Mid-Sem");
  const [submitted, setSubmitted] = useState(false);
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
    if (!logoutConfirmOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setLogoutConfirmOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [logoutConfirmOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) setDisplayName(parsed.name);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const handleMenuAction = (action) => {
    setUserMenuOpen(false);

    if (action === "logout") {
      setLogoutConfirmOpen(true);
    } else if (action === "Profile") {
      window.location.href = "/profile";
    } else {
      alert(`${action} clicked`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="student-portal no-sidebar">
      <main className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="portal-back-btn"
              aria-label="Back to dashboard"
              onClick={() => {
                window.location.href = "/student";
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="portal-back-icon">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="portal-menu-text">Back</div>
          </div>

          <div className="portal-topbar-center">
            <div className="portal-campus-badge">ACAD-HUB STUDENT PORTAL</div>
            <div className="portal-campus-subtitle">Admit Card</div>
          </div>

          <div className="portal-topbar-right" ref={menuRef}>
            <button
              type="button"
              className="portal-user-chip"
              onClick={() => setUserMenuOpen((open) => !open)}
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
            <p className="portal-eyebrow">Examination</p>
            <h1>Admit Card</h1>
            <p className="portal-intro">
              Select the current exam details to check whether your admit card has been uploaded.
            </p>
          </div>
        </section>

        <section className="profile-template-wrap">
          <div className="profile-template-card">
            <form className="admit-card-form" onSubmit={handleSubmit}>
              <label className="help-label" htmlFor="exam-session">
                Select Current Exam Session
              </label>
              <select
                id="exam-session"
                className="announcement-select"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>

              <label className="help-label" htmlFor="semester">
                Semester
              </label>
              <select
                id="semester"
                className="announcement-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>

              <label className="help-label" htmlFor="exam-type">
                Select Exam
              </label>
              <select
                id="exam-type"
                className="announcement-select"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="Mid-Sem">Mid-Sem</option>
                <option value="End-Sem">End-Sem</option>
              </select>

              <div className="help-actions">
                <button type="submit" className="help-send-btn">
                  Submit
                </button>
              </div>
            </form>

            {submitted ? (
              <div className="notifications-empty-card admit-card-status">
                No admit card available
              </div>
            ) : null}
          </div>
        </section>
      </main>

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

export default StudentAdmitCardPage;
