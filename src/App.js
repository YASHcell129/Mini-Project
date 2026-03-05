import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import UserProfile from "./pages/UserProfile";
import "./style.css";

function App() {
  const path = window.location.pathname;
  const isStudentPage = path === "/student";
  const isProfilePage = path === "/profile";

  return (
    <div className={`app-background ${isStudentPage || isProfilePage ? "blur-bg" : ""}`}>
      {isProfilePage ? <UserProfile /> : isStudentPage ? <StudentDashboard /> : <LoginPage />}
    </div>
  );
}

export default App;
