import React, { useState, useEffect, useRef } from "react";
import "../style.css";

const StudentDashboard = ({ name }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [displayName, setDisplayName] = useState(name || "Student");

  useEffect(() => {
    const handleDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  useEffect(() => {
    if (name) return; // prefer prop when provided
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) setDisplayName(parsed.name);
      } else {
        const maybe = localStorage.getItem("userName");
        if (maybe) setDisplayName(maybe);
      }
    } catch (e) {
      // ignore
    }
  }, [name]);

  const handleClick = (section) => {
    alert(`${section} section coming soon 🚀`);
    setMenuOpen(false);
  };

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === "logout") {
      localStorage.removeItem("user");
      localStorage.removeItem("userName");
      window.location.href = "/";
    } else if (action === "Profile") {
      window.location.href = "/profile";
    } else {
      alert(`${action} clicked`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Left Brand (same glowing text) */}
      <div className="brand">STUDENT DASHBOARD</div>

      {/* Top-right menu with logout and other actions */}
      <div className="menu" ref={menuRef}>
        <button
          className="menu-btn"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
        >
          ☰
        </button>

        <div className={`menu-dropdown ${menuOpen ? "open" : ""}`}>
          <button className="menu-item" onClick={() => handleMenuAction("Profile")}>
            Profile
          </button>
          <button className="menu-item" onClick={() => handleMenuAction("Settings")}>
            Settings
          </button>
          <button className="menu-item" onClick={() => handleMenuAction("Help")}>
            Help
          </button>
          <div className="menu-divider" />
          <button className="menu-item logout" onClick={() => handleMenuAction("logout")}>
            Logout
          </button>
        </div>
      </div>

      {/* page header with welcome message */}
      <div className="dashboard-header">
        <h2>Welcome Back, {displayName}</h2>
      </div>

      {/* Dashboard Top: larger primary actions side-by-side */}
      <div className="dashboard-top">
        <div className="dash-card large" onClick={() => handleClick("Attendance")}>
          <h3>📅 Attendance</h3>
          <p>View your attendance percentage</p>
        </div>

        <div className="dash-card large" onClick={() => handleClick("Timetable")}>
          <h3>🕒 Timetable</h3>
          <p>Check your daily class schedule</p>
        </div>
      </div>

      {/* Other dashboard cards below */}
      <div className="dashboard-cards">

        <div className="dash-card" onClick={() => handleClick("Fees")}>
          <h3>💰 Fees</h3>
          <p>View fee status and payment details</p>
        </div>

        <div className="dash-card" onClick={() => handleClick("Notifications")}>
          <h3>🔔 Notifications</h3>
          <p>Important notices & updates</p>
        </div>

        <div className="dash-card" onClick={() => handleClick("Assignments")}>
          <h3>📝 Assignments</h3>
          <p>View & submit assignments</p>
        </div>

        <div className="dash-card" onClick={() => handleClick("Admit Card")}>
          <h3>🎫 Admit Card</h3>
          <p>Download exam admit card</p>
        </div>

        <div className="dash-card" onClick={() => handleClick("Report Card")}>
          <h3>📊 Report Card</h3>
          <p>View academic performance</p>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
