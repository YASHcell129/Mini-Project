import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import StudentCircularsPage from "./pages/StudentCircularsPage";
import StudentAdmitCardPage from "./pages/StudentAdmitCardPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import UserProfile from "./pages/UserProfile";
import "./style.css";

function App() {
  const path = window.location.pathname;
  const isStudentPage = path === "/student";
  const isFacultyPage = path === "/faculty";
  const isAdminPage = path === "/admin";
  const isAdminUserManagementPage = path === "/admin/users";
  const isStudentCircularsPage = path === "/student/circulars";
  const isStudentAdmitCardPage = path === "/student/admit-card";
  const isStudentNotificationsPage = path === "/student/notifications";
  const isFacultyNotificationsPage = path === "/faculty/notifications";
  const isAdminNotificationsPage = path === "/admin/notifications";
  const isProfilePage = path === "/profile";

  return (
    <div className={`app-background ${isStudentPage || isFacultyPage || isAdminPage || isAdminUserManagementPage || isStudentCircularsPage || isStudentAdmitCardPage || isStudentNotificationsPage || isFacultyNotificationsPage || isAdminNotificationsPage || isProfilePage ? "blur-bg" : ""}`}>
      {isProfilePage ? (
        <UserProfile />
      ) : isAdminUserManagementPage ? (
        <AdminUserManagementPage />
      ) : isStudentAdmitCardPage ? (
        <StudentAdmitCardPage />
      ) : isStudentCircularsPage ? (
        <StudentCircularsPage />
      ) : isStudentNotificationsPage ? (
        <NotificationsPage role="Student" />
      ) : isFacultyNotificationsPage ? (
        <NotificationsPage role="Faculty" />
      ) : isAdminNotificationsPage ? (
        <NotificationsPage role="Admin" />
      ) : isStudentPage ? (
        <StudentDashboard />
      ) : isFacultyPage ? (
        <FacultyDashboard />
      ) : isAdminPage ? (
        <AdminDashboard />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
