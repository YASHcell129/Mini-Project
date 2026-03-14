import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import "../style.css";

const ModuleIcon = ({ kind }) => {
  const icons = {
    users: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 19a4 4 0 0 0-8 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18.5 17.5a3 3 0 0 0-2.2-2.9M17 7.5a2.5 2.5 0 1 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    faculty: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 9 8-4 8 4-8 4-8-4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 11.5V15c0 1.7 1.8 3 4 3s4-1.3 4-3v-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    student: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 18a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    departments: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h16M6 20V7l6-3 6 3v13M10 10h4M10 14h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    fees: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4v2M16 4v2M8 18v2M16 18v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    announcements: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 13V9a2 2 0 0 1 2-2h3l5-2v14l-5-2H7a2 2 0 0 1-2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 9.5a3 3 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 19h12M8 16V9M12 16V5M16 16v-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.7a7.6 7.6 0 0 0-1.7-1L14.5 3h-5l-.4 2.7a7.6 7.6 0 0 0-1.7 1L5 6l-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.4-.7a7.6 7.6 0 0 0 1.7 1l.4 2.7h5l.4-2.7a7.6 7.6 0 0 0 1.7-1l2.3.7 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return icons[kind] || null;
};

const modules = [
  { title: "User Management", icon: "users" },
  { title: "Faculty Records", icon: "faculty" },
  { title: "Student Records", icon: "student" },
  { title: "Departments", icon: "departments" },
  { title: "Fees Control", icon: "fees" },
  { title: "Announcements", icon: "announcements" },
  { title: "Reports", icon: "reports" },
  { title: "System Settings", icon: "settings" }
];

const defaultOverview = [
  { label: "Total Students", value: "0" },
  { label: "Faculty Members", value: "0" },
  { label: "Admin Accounts", value: "0" },
  { label: "Open Requests", value: "0" }
];

const defaultControls = [
  { label: "Current Session", value: "2025-26 Even Semester" },
  { label: "Fee Verification Queue", value: "0 records pending" },
  { label: "Pending Approvals", value: "0 records need admin review" },
  { label: "Active Notices", value: "0" }
];

const initialForm = {
  id: "",
  kind: "notification",
  audience: "Student",
  title: "",
  message: "",
  pdfName: "",
  pdfData: ""
};

const AdminDashboard = ({ name }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState(initialForm);
  const [announcementSending, setAnnouncementSending] = useState(false);
  const [managedItems, setManagedItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [concern, setConcern] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [displayName, setDisplayName] = useState(name || "Admin");
  const [currentUsername, setCurrentUsername] = useState("");
  const [overview, setOverview] = useState(defaultOverview);
  const [controls, setControls] = useState(defaultControls);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");
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
        if (parsed?.name) setDisplayName(parsed.name);
        if (parsed?.username) setCurrentUsername(parsed.username);
        return;
      }

      const storedName = localStorage.getItem("userName");
      if (storedName) setDisplayName(storedName);
    } catch (e) {
      // ignore storage errors
    }
  }, [name]);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoadingData(true);
      setLoadError("");

      try {
        let username = "";
        const stored = localStorage.getItem("user");

        if (stored) {
          const parsed = JSON.parse(stored);
          username = parsed?.username || "";
        }

        const res = await axios.get("http://127.0.0.1:5000/admin/dashboard", {
          params: { username }
        });

        if (!active) return;

        if (res.data?.admin?.name) setDisplayName(res.data.admin.name);
        if (res.data?.admin?.username) setCurrentUsername(res.data.admin.username);
        setOverview(res.data?.overview?.length ? res.data.overview : defaultOverview);
        setControls(res.data?.controls?.length ? res.data.controls : defaultControls);
      } catch (error) {
        if (!active) return;
        setLoadError("Unable to load admin dashboard data.");
        setOverview(defaultOverview);
        setControls(defaultControls);
      } finally {
        if (active) setLoadingData(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!helpOpen && !announcementOpen && !logoutConfirmOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setAnnouncementOpen(false);
        setLogoutConfirmOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [helpOpen, announcementOpen, logoutConfirmOpen]);

  const fireToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    window.setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
    }, 2500);
  };

  const loadManagedItems = async () => {
    setItemsLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/announcements", {
        params: { createdBy: currentUsername }
      });
      setManagedItems(res.data?.items || []);
    } catch (error) {
      setManagedItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const openAnnouncementManager = async () => {
    setAnnouncementOpen(true);
    setAnnouncementForm(initialForm);
    await loadManagedItems();
  };

  const handleModuleClick = (section) => {
    setUserMenuOpen(false);

    if (section === "Announcements") {
      openAnnouncementManager();
      return;
    }

    alert(`${section} section coming soon`);
  };

  const handleConcernSubmit = (e) => {
    e.preventDefault();
    if (!concern.trim()) return;

    setHelpOpen(false);
    setConcern("");
    fireToast("Concern Raised\u2705");
  };

  const handleAnnouncementTypeChange = (kind) => {
    setAnnouncementForm((prev) => ({
      ...prev,
      kind,
      audience: kind === "circular" ? "Student" : prev.audience === "Student" || prev.audience === "Faculty" || prev.audience === "All" ? prev.audience : "Student",
      title: kind === "circular" && !prev.title ? "Student Circular" : prev.title,
      message: kind === "circular" ? "" : prev.message
    }));
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      fireToast("Only PDF files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAnnouncementForm((prev) => ({
        ...prev,
        pdfName: file.name,
        pdfData: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setAnnouncementSending(true);

    try {
      const payload = {
        kind: announcementForm.kind,
        audience: announcementForm.kind === "circular" ? "Student" : announcementForm.audience,
        title: announcementForm.kind === "circular" ? (announcementForm.title || "Student Circular") : "",
        message: announcementForm.kind === "notification" ? announcementForm.message.trim() : "",
        pdfName: announcementForm.kind === "circular" ? announcementForm.pdfName : "",
        pdfData: announcementForm.kind === "circular" ? announcementForm.pdfData : "",
        createdBy: currentUsername
      };

      if (announcementForm.id) {
        await axios.put(`http://127.0.0.1:5000/admin/announcements/${announcementForm.id}`, payload);
        fireToast("Item Updated\u2705");
      } else {
        await axios.post("http://127.0.0.1:5000/admin/announcements", payload);
        fireToast("Item Sent\u2705");
      }

      setAnnouncementForm(initialForm);
      await loadManagedItems();
    } catch (error) {
      fireToast("Unable to save item");
    } finally {
      setAnnouncementSending(false);
    }
  };

  const handleEditItem = (item) => {
    setAnnouncementForm({
      id: item.id,
      kind: item.kind || "notification",
      audience: item.audience || "Student",
      title: item.title || "",
      message: item.message || "",
      pdfName: item.pdfName || "",
      pdfData: item.pdfData || ""
    });
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/announcements/${itemId}`);
      if (announcementForm.id === itemId) {
        setAnnouncementForm(initialForm);
      }
      await loadManagedItems();
      fireToast("Item Deleted\u2705");
    } catch (error) {
      fireToast("Unable to delete item");
    }
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
      <aside className="portal-sidebar" aria-label="Admin navigation">
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
            <div className="portal-campus-badge">ACAD-HUB ADMIN PORTAL</div>
            <div className="portal-campus-subtitle">Administrative control and campus operations</div>
          </div>

          <div className="portal-topbar-right" ref={menuRef}>
            <button
              type="button"
              className="portal-notify-btn"
              aria-label="Notifications"
              onClick={() => {
                window.location.href = "/admin/notifications";
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
            <p className="portal-eyebrow">Admin Dashboard</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="portal-intro">
              Monitor institution activity, manage records, and handle campus administration.
            </p>
            {loadingData ? (
              <p className="portal-status-note">Loading dashboard data...</p>
            ) : loadError ? (
              <p className="portal-status-note error">{loadError}</p>
            ) : (
              <p className="portal-status-note">Backend connected. Live admin data loaded.</p>
            )}
          </div>
        </section>

        <section className="portal-summary-grid" aria-label="Admin overview">
          {overview.map((item) => (
            <div key={item.label} className="portal-summary-card">
              <span className="portal-summary-label">{item.label}</span>
              <strong className="portal-summary-value">{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="portal-data-section">
          <div className="portal-section-heading">
            <h2>Administrative Snapshot</h2>
            <span className="portal-pill">Admin</span>
          </div>
          <div className="portal-data-grid">
            {controls.map((item) => (
              <div key={item.label} className="portal-field-card">
                <span className="portal-field-label">{item.label}</span>
                <span className="portal-field-value">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="portal-grid" aria-label="Admin modules">
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

      {announcementOpen ? (
        <div className="help-modal-overlay" onClick={() => setAnnouncementOpen(false)} role="presentation">
          <div
            className="help-modal announcement-manager-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="announcement-modal-title">Announcement Manager</h3>
            <p>Create notifications or upload student circular PDFs. You can also edit or delete sent items.</p>

            <form onSubmit={handleAnnouncementSubmit}>
              <label className="help-label">Type</label>
              <div className="announcement-kind-row">
                <button
                  type="button"
                  className={`announcement-kind-btn ${announcementForm.kind === "notification" ? "active" : ""}`}
                  onClick={() => handleAnnouncementTypeChange("notification")}
                >
                  Notification
                </button>
                <button
                  type="button"
                  className={`announcement-kind-btn ${announcementForm.kind === "circular" ? "active" : ""}`}
                  onClick={() => handleAnnouncementTypeChange("circular")}
                >
                  Student Circular
                </button>
              </div>

              {announcementForm.kind === "notification" ? (
                <>
                  <label className="help-label" htmlFor="announcement-audience">
                    Send To
                  </label>
                  <select
                    id="announcement-audience"
                    className="announcement-select"
                    value={announcementForm.audience}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({ ...prev, audience: e.target.value }))
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="All">All</option>
                  </select>

                  <label className="help-label" htmlFor="announcement-message">
                    Message
                  </label>
                  <textarea
                    id="announcement-message"
                    className="help-textarea"
                    placeholder="Write your announcement here..."
                    value={announcementForm.message}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    rows="5"
                    required
                  />
                </>
              ) : (
                <>
                  <label className="help-label" htmlFor="circular-title">
                    Circular Title
                  </label>
                  <input
                    id="circular-title"
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Student Circular"
                  />

                  <label className="help-label" htmlFor="circular-file">
                    Upload PDF
                  </label>
                  <input
                    id="circular-file"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => handlePdfUpload(e.target.files?.[0])}
                  />
                  <p className="announcement-file-name">
                    {announcementForm.pdfName || "No PDF selected"}
                  </p>
                </>
              )}

              <div className="help-actions">
                <button
                  type="button"
                  className="help-cancel-btn"
                  onClick={() => setAnnouncementForm(initialForm)}
                >
                  Clear
                </button>
                <button type="submit" className="help-send-btn" disabled={announcementSending}>
                  {announcementSending ? "Saving..." : announcementForm.id ? "Update" : "Send"}
                </button>
              </div>
            </form>

            <div className="announcement-manager-list">
              <div className="portal-section-heading">
                <h2>Sent Items</h2>
              </div>
              {itemsLoading ? (
                <div className="notifications-empty-card">Loading sent items...</div>
              ) : managedItems.length ? (
                managedItems.map((item) => (
                  <div key={item.id} className="announcement-manage-card">
                    <div className="announcement-manage-top">
                      <div>
                        <strong>{item.kind === "circular" ? item.title || "Student Circular" : "Notification"}</strong>
                        <p>
                          {item.kind === "circular"
                            ? `Student Circular${item.pdfName ? ` • ${item.pdfName}` : ""}`
                            : `Sent to ${item.audience}`}
                        </p>
                      </div>
                      <div className="announcement-manage-actions">
                        <button type="button" className="manage-action-btn" onClick={() => handleEditItem(item)}>
                          Edit
                        </button>
                        <button type="button" className="manage-action-btn danger" onClick={() => handleDeleteItem(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    {item.kind === "notification" ? (
                      <div className="announcement-manage-message">{item.message}</div>
                    ) : (
                      <a className="announcement-pdf-link" href={item.pdfData} download={item.pdfName || "student-circular.pdf"}>
                        Download PDF
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="notifications-empty-card">No sent notifications or circulars yet.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {helpOpen ? (
        <div className="help-modal-overlay" onClick={() => setHelpOpen(false)} role="presentation">
          <div
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-help-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="admin-help-modal-title">Raise a Concern</h3>
            <p>Describe the issue you want to report.</p>
            <form onSubmit={handleConcernSubmit}>
              <label className="help-label" htmlFor="admin-concern-message">
                Your concern
              </label>
              <textarea
                id="admin-concern-message"
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

      {showToast ? (
        <div className="concern-toast" role="status" aria-live="polite">
          {toastMessage}
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

export default AdminDashboard;
