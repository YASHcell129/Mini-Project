import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import "../style.css";

const initialForm = {
  name: "",
  username: "",
  password: "",
  role: "Student",
  rollno: "",
  mobno: "",
  dob: "",
  department: "",
  semester: "",
  course1: "",
  course2: "",
  course3: ""
};

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%&!";
  let value = "";

  for (let i = 0; i < 10; i += 1) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }

  return value;
};

const AdminUserManagementPage = () => {
  const [displayName, setDisplayName] = useState("Admin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusKind, setStatusKind] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
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
    if (!logoutConfirmOpen && !userToDelete && !resetPasswordOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setLogoutConfirmOpen(false);
        setUserToDelete(null);
        setResetPasswordOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [logoutConfirmOpen, userToDelete, resetPasswordOpen]);

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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/users");
      setUsers(res.data?.users || []);
    } catch (error) {
      setUsers([]);
      setStatusKind("error");
      setStatusMessage("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleMenuAction = (action) => {
    setUserMenuOpen(false);

    if (action === "logout") {
      setLogoutConfirmOpen(true);
    } else if (action === "Reset Password") {
      setResetPasswordOpen(true);
    } else if (action === "Profile") {
      window.location.href = "/profile";
    } else {
      alert(`${action} clicked`);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage("");
    setStatusKind("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/admin/users", formData);
      setStatusKind("success");
      setStatusMessage(res.data?.message || "User created successfully");
      setFormData(initialForm);
      await loadUsers();
    } catch (error) {
      setStatusKind("error");
      setStatusMessage(error.response?.data?.message || "Unable to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?.id) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/admin/users/${userToDelete.id}`);
      setStatusKind("success");
      setStatusMessage("User deleted successfully");
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      setStatusKind("error");
      setStatusMessage(error.response?.data?.message || "Unable to delete user");
      setUserToDelete(null);
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
                window.location.href = "/admin";
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="portal-back-icon">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="portal-menu-text">Back</div>
          </div>

          <div className="portal-topbar-center">
            <div className="portal-campus-badge">ACAD-HUB ADMIN PORTAL</div>
            <div className="portal-campus-subtitle">User management</div>
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
            <p className="portal-eyebrow">User Management</p>
            <h1>Add Users</h1>
            <p className="portal-intro">
              Create new student, faculty, or admin accounts directly from the admin portal.
            </p>
            {statusMessage ? (
              <p className={`portal-status-note ${statusKind === "error" ? "error" : ""}`}>{statusMessage}</p>
            ) : null}
          </div>
        </section>

        <section className="profile-template-wrap">
          <div className="profile-template-card">
            <form className="user-management-form" onSubmit={handleSubmit}>
              <div className="user-form-grid">
                <div>
                  <label className="help-label" htmlFor="user-name">Name <span className="required-mark">*</span></label>
                  <input className="user-management-input" id="user-name" type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                </div>

                <div>
                  <label className="help-label" htmlFor="user-username">Username <span className="required-mark">*</span></label>
                  <input className="user-management-input" id="user-username" type="text" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} required />
                </div>

                <div>
                  <label className="help-label" htmlFor="user-password">Password <span className="required-mark">*</span></label>
                  <div className="user-password-row">
                    <input className="user-management-input" id="user-password" type="text" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
                    <button
                      type="button"
                      className="user-password-generate"
                      onClick={() => handleChange("password", generatePassword())}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="help-label" htmlFor="user-role">Role <span className="required-mark">*</span></label>
                  <select
                    id="user-role"
                    className="announcement-select user-management-input"
                    value={formData.role}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        role: nextRole,
                        department: nextRole === "Faculty" ? prev.department : "",
                        semester: nextRole === "Student" ? prev.semester : "",
                        course1: nextRole === "Faculty" ? prev.course1 : "",
                        course2: nextRole === "Faculty" ? prev.course2 : "",
                        course3: nextRole === "Faculty" ? prev.course3 : ""
                      }));
                    }}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="help-label" htmlFor="user-rollno">Roll No <span className="required-mark">*</span></label>
                  <input className="user-management-input" id="user-rollno" type="text" value={formData.rollno} onChange={(e) => handleChange("rollno", e.target.value)} required />
                </div>

                <div>
                  <label className="help-label" htmlFor="user-mobile">Mobile No <span className="required-mark">*</span></label>
                  <input className="user-management-input" id="user-mobile" type="text" value={formData.mobno} onChange={(e) => handleChange("mobno", e.target.value)} required />
                </div>

                <div>
                  <label className="help-label" htmlFor="user-dob">Date of Birth <span className="required-mark">*</span></label>
                  <input className="user-management-input" id="user-dob" type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
                </div>

                {formData.role === "Faculty" ? (
                  <div>
                    <label className="help-label" htmlFor="user-department">Department <span className="required-mark">*</span></label>
                    <input className="user-management-input" id="user-department" type="text" value={formData.department} onChange={(e) => handleChange("department", e.target.value)} required />
                  </div>
                ) : null}

                {formData.role === "Faculty" ? (
                  <div>
                    <label className="help-label" htmlFor="user-course1">Course 1 <span className="required-mark">*</span></label>
                    <input className="user-management-input" id="user-course1" type="text" value={formData.course1} onChange={(e) => handleChange("course1", e.target.value)} required />
                  </div>
                ) : null}

                {formData.role === "Faculty" ? (
                  <div>
                    <label className="help-label" htmlFor="user-course2">Course 2</label>
                    <input className="user-management-input" id="user-course2" type="text" value={formData.course2} onChange={(e) => handleChange("course2", e.target.value)} />
                  </div>
                ) : null}

                {formData.role === "Faculty" ? (
                  <div>
                    <label className="help-label" htmlFor="user-course3">Course 3</label>
                    <input className="user-management-input" id="user-course3" type="text" value={formData.course3} onChange={(e) => handleChange("course3", e.target.value)} />
                  </div>
                ) : null}

                {formData.role === "Student" ? (
                  <div>
                    <label className="help-label" htmlFor="user-semester">Semester <span className="required-mark">*</span></label>
                    <input className="user-management-input" id="user-semester" type="text" value={formData.semester} onChange={(e) => handleChange("semester", e.target.value)} required />
                  </div>
                ) : null}
              </div>

              <div className="help-actions">
                <button type="button" className="help-cancel-btn" onClick={() => setFormData(initialForm)}>
                  Reset
                </button>
                <button type="submit" className="help-send-btn" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="notifications-page">
          {loading ? (
            <div className="notifications-empty-card">Loading users...</div>
          ) : users.length ? (
            <div className="user-list-grid">
              {users.map((item) => (
                <article key={item.id || `${item.username}-${item.role}`} className="user-list-card">
                  <div className="user-list-top">
                    <div>
                      <h2>{item.name || "Unnamed User"}</h2>
                      <p>{item.role}</p>
                    </div>
                    <span className="portal-pill">{item.role}</span>
                  </div>
                  <div className="user-list-meta">
                    <span>Username: {item.username || "N/A"}</span>
                    <span>Roll No: {item.rollno || "N/A"}</span>
                    <span>Mobile: {item.mobno || "N/A"}</span>
                    <span>DOB: {item.dob || "N/A"}</span>
                    <span>Department: {item.department || "N/A"}</span>
                    <span>Semester: {item.semester || "N/A"}</span>
                    <span>Course 1: {item.course1 || "N/A"}</span>
                    <span>Course 2: {item.course2 || "N/A"}</span>
                    <span>Course 3: {item.course3 || "N/A"}</span>
                  </div>
                  <div className="user-list-actions">
                    <button
                      type="button"
                      className="manage-action-btn danger"
                      onClick={() => setUserToDelete(item)}
                    >
                      Delete User
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="notifications-empty-card">No users found.</div>
          )}
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
      <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />

      {userToDelete ? (
        <div className="help-modal-overlay" onClick={() => setUserToDelete(null)} role="presentation">
          <div
            className="help-modal logout-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-user-title">Delete User</h3>
            <p>Delete {userToDelete.name || userToDelete.username}? This action cannot be undone.</p>
            <div className="help-actions logout-confirm-actions">
              <button type="button" className="help-cancel-btn" onClick={() => setUserToDelete(null)}>
                Cancel
              </button>
              <button type="button" className="help-send-btn logout-confirm-btn" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminUserManagementPage;
