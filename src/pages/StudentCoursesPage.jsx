import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import "../style.css";

const StudentCoursesPage = () => {
  const [displayName, setDisplayName] = useState("Student");
  const [studentID, setStudentID] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        if (parsed?.name) setDisplayName(parsed.name);
        if (parsed?.StudentID) setStudentID(parsed.StudentID);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!studentID) {
        console.log("No studentID found");
        setLoading(false);
        return;
      }
      
      console.log("Fetching courses for studentID:", studentID);
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/student/courses", {
          params: {
            studentID: studentID
          }
        });
        
        console.log("Courses API response:", response.data);
        if (response.data.success) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentID]);

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
            <div className="portal-campus-subtitle">Courses</div>
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
            <p className="portal-eyebrow">Academic</p>
            <h1>Courses</h1>
            <p className="portal-intro">
              Select the session and semester to view your enrolled courses.
            </p>
          </div>
        </section>

        <section className="profile-template-wrap">
          <div className="profile-template-card">
            {loading ? (
              <div className="notifications-empty-card admit-card-status">
                Loading your courses...
              </div>
            ) : courses.length > 0 ? (
              <div className="courses-table-container">
                <table className="courses-table" style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem"
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: "2px solid #345299",
                      backgroundColor: "#f5f5f5"
                    }}>
                      <th style={{ padding: "12px", textAlign: "left", color: "#345299", fontWeight: "600" }}>Course Code</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#345299", fontWeight: "600" }}>Course Name</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#345299", fontWeight: "600" }}>Credits</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#345299", fontWeight: "600" }}>Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={index} style={{
                        borderBottom: "1px solid #ddd",
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"
                      }}>
                        <td style={{ padding: "12px" }}>{course.code}</td>
                        <td style={{ padding: "12px" }}>{course.name}</td>
                        <td style={{ padding: "12px" }}>{course.credits}</td>
                        <td style={{ padding: "12px" }}>{course.instructor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="notifications-empty-card admit-card-status">
                No courses available
              </div>
            )}
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

export default StudentCoursesPage;
