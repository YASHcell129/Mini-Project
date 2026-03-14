import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../style.css";

const StudentCircularsPage = () => {
  const [displayName, setDisplayName] = useState("Student");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  useEffect(() => {
    let active = true;

    const loadCirculars = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:5000/notifications", {
          params: { role: "Student" }
        });
        if (active) {
          const circulars = (res.data?.notifications || []).filter((item) => item.kind === "circular");
          setItems(circulars);
        }
      } catch (error) {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCirculars();

    return () => {
      active = false;
    };
  }, []);

  const handleMenuAction = (action) => {
    setUserMenuOpen(false);

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
            <div className="portal-campus-subtitle">Student circulars</div>
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
            <p className="portal-eyebrow">Student Circulars</p>
            <h1>Circulars</h1>
            <p className="portal-intro">All student circular PDFs sent by admin appear here.</p>
          </div>
        </section>

        <section className="notifications-page">
          {loading ? (
            <div className="notifications-empty-card">Loading circulars...</div>
          ) : items.length ? (
            items.map((item) => (
              <article key={item.id} className="notifications-card">
                <div className="notifications-date">
                  {item.createdAt ? item.createdAt.slice(0, 10) : "Latest"}
                </div>
                <h2>{item.title || "Student Circular"}</h2>
                <a className="announcement-pdf-link" href={item.pdfData} download={item.pdfName || "student-circular.pdf"}>
                  Download PDF
                </a>
              </article>
            ))
          ) : (
            <div className="notifications-empty-card">No Circulars</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentCircularsPage;
