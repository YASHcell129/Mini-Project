import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import "../style.css";

const roleConfig = {
  Student: {
    backPath: "/student",
    badge: "ACAD-HUB STUDENT PORTAL",
    subtitle: "Profile"
  },
  Faculty: {
    backPath: "/faculty",
    badge: "ACAD-HUB FACULTY PORTAL",
    subtitle: "Profile"
  },
  Admin: {
    backPath: "/admin",
    badge: "ACAD-HUB ADMIN PORTAL",
    subtitle: "Profile"
  }
};

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2RkZCIvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjMwIiBmaWxsPSIjYWFhIi8+CiAgPHBhdGggZD0iTTIwLDEwMCBDMjAsODAgNDAsNjAgNjAsNjAgQzcwLDYwIDEwMCw4MCAxMDAsMTAwIiBmaWxsPSIjYWFhIi8+Cjwvc3ZnPg==";

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowImageOptions(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!logoutConfirmOpen && !resetPasswordOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setLogoutConfirmOpen(false);
        setResetPasswordOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [logoutConfirmOpen, resetPasswordOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
      }
    } catch (e) {
      // ignore storage errors
    } finally {
      setLoading(false);
    }
  }, []);

  const role = userData?.role || "Student";
  const config = roleConfig[role] || roleConfig.Student;

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

  const persistProfileImage = async (image) => {
    if (!userData?.username || !userData?.role) return;

    const res = await axios.put("http://127.0.0.1:5000/profile/image", {
      username: userData.username,
      role: userData.role,
      image
    });

    if (res.data?.user) {
      setUserData(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.name) {
        localStorage.setItem("userName", res.data.user.name);
      }
    }
  };

  if (loading) {
    return (
      <div className="student-portal no-sidebar">
        <main className="portal-main">
          <section className="notifications-page">
            <div className="notifications-empty-card">Loading...</div>
          </section>
        </main>
      </div>
    );
  }

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
              <span className="portal-user-name">{userData?.name || "User"}</span>
              <span className="portal-avatar">{(userData?.name || "U").slice(0, 1).toUpperCase()}</span>
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
            <p className="portal-eyebrow">Profile</p>
            <h1>{userData?.name || "N/A"}</h1>
            <p className="portal-intro">Manage your account details and profile image.</p>
          </div>
        </section>

        <section className="profile-template-wrap">
          <div className="profile-template-card">
            <div className="profile-template-header">
              <div className="profile-image-wrapper" ref={wrapperRef} onClick={() => setShowImageOptions((s) => !s)}>
                <img
                  src={userData?.image || defaultImage}
                  alt="Profile"
                  className="profile-page-image"
                />
                {showImageOptions ? (
                  <div className="image-options-popup">
                    <button
                      className="upload-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="profile-upload-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result;
                            persistProfileImage(result)
                              .then(() => {
                                setShowImageOptions(false);
                              })
                              .catch(() => {
                                alert("Unable to upload profile picture");
                              });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {userData?.image ? (
                      <button
                        className="remove-pic-btn small"
                        onClick={(e) => {
                          e.stopPropagation();
                          persistProfileImage(null)
                            .then(() => {
                              setShowImageOptions(false);
                            })
                            .catch(() => {
                              alert("Unable to remove profile picture");
                            });
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="profile-template-text">
                <h2>{userData?.name || "N/A"}</h2>
                <p>{userData?.role || "N/A"}</p>
              </div>
            </div>

            <div className="profile-page-details">
              {/* Common fields for all roles */}
              <div className="profile-detail-card">
                <label>Mobile Number</label>
                <p>{userData?.mobno || "N/A"}</p>
              </div>
              <div className="profile-detail-card">
                <label>Date of Birth</label>
                <p>{userData?.dob || "N/A"}</p>
              </div>
              <div className="profile-detail-card">
                <label>Username</label>
                <p>{userData?.username || "N/A"}</p>
              </div>
              <div className="profile-detail-card">
                <label>Role</label>
                <p>{userData?.role || "N/A"}</p>
              </div>

              {/* Student fields */}
              {userData?.role === "Student" && (
                <>
                  <div className="profile-detail-card">
                    <label>Roll Number</label>
                    <p>{userData?.rollno || "N/A"}</p>
                  </div>
                  <div className="profile-detail-card">
                    <label>Semester</label>
                    <p>{userData?.semester || "N/A"}</p>
                  </div>
                </>
              )}

              {/* Faculty fields */}
              {userData?.role === "Faculty" && (
                <>
                  <div className="profile-detail-card">
                    <label>Faculty ID</label>
                    <p>{userData?.facultyid || "N/A"}</p>
                  </div>
                  <div className="profile-detail-card">
                    <label>Department</label>
                    <p>{userData?.department || "N/A"}</p>
                  </div>
                  <div className="profile-detail-card">
                    <label>Course 1</label>
                    <p>{userData?.course1 || "N/A"}</p>
                  </div>
                  <div className="profile-detail-card">
                    <label>Course 2</label>
                    <p>{userData?.course2 || "N/A"}</p>
                  </div>
                  <div className="profile-detail-card">
                    <label>Course 3</label>
                    <p>{userData?.course3 || "N/A"}</p>
                  </div>
                </>
              )}

              {/* Admin fields */}
              {userData?.role === "Admin" && (
                <div className="profile-detail-card">
                  <label>Admin ID</label>
                  <p>{userData?.adminid || "N/A"}</p>
                </div>
              )}
            </div>
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
      <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
    </div>
  );
};

export default UserProfile;
