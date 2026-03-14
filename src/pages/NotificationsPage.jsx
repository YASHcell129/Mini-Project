import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../style.css";

const roleConfig = {
  Student: {
    backPath: "/student",
    badge: "ACAD-HUB STUDENT PORTAL",
    subtitle: "Your notifications"
  },
  Faculty: {
    backPath: "/faculty",
    badge: "ACAD-HUB FACULTY PORTAL",
    subtitle: "Your notifications"
  },
  Admin: {
    backPath: "/admin",
    badge: "ACAD-HUB ADMIN PORTAL",
    subtitle: "Your notifications"
  }
};

const NotificationsPage = ({ role }) => {
  const config = roleConfig[role] || roleConfig.Student;
  const [displayName, setDisplayName] = useState(role);
  const [notifications, setNotifications] = useState([]);
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

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:5000/notifications", {
          params: { role }
        });
        if (active) {
          setNotifications(res.data?.notifications || []);
        }
      } catch (error) {
        if (active) {
          setNotifications([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, [role]);

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
                window.location.href = config.backPath;
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="portal-back-icon">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="portal-menu-text">Back</div>
          </div>

          <div className="portal-topbar-center">
            <div className="portal-campus-badge">{config.badge}</div>
            <div className="portal-campus-subtitle">{config.subtitle}</div>
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
            <p className="portal-eyebrow">Notifications</p>
            <h1>Notifications</h1>
            <p className="portal-intro">All messages sent to you appear here.</p>
          </div>
        </section>

        <section className="notifications-page">
          {loading ? (
            <div className="notifications-empty-card">Loading notifications...</div>
          ) : notifications.length ? (
            notifications.map((item) => (
              <article key={item.id} className="notifications-card">
                <div className="notifications-date">
                  {item.createdAt ? item.createdAt.slice(0, 10) : "Latest"}
                </div>
                {item.kind === "circular" ? (
                  <>
                    <h2>{item.title || "Student Circular"}</h2>
                    <a className="announcement-pdf-link" href={item.pdfData} download={item.pdfName || "student-circular.pdf"}>
                      Download PDF
                    </a>
                  </>
                ) : (
                  <p>{item.message}</p>
                )}
              </article>
            ))
          ) : (
            <div className="notifications-empty-card">No Notifications</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NotificationsPage;
