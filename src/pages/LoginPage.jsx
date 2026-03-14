import { useState } from "react";
import RoleSelector from "../components/RoleSelector";
import LoginForm from "../components/LoginForm";
import "../style.css";

const LoginPage = () => {
  const [role, setRole] = useState(null);

  return (
    <div className="student-portal no-sidebar login-template-page">
      <main className="portal-main">
        <header className="portal-topbar login-template-topbar">
          <div className="login-topbar-spacer" />

          <div className="portal-topbar-center login-topbar-center">
            <div className="portal-campus-badge login-topbar-badge">ACAD-HUB</div>
            <div className="portal-campus-subtitle">Unified academic access for students, faculty and admin</div>
          </div>

          <div className="login-topbar-spacer" />
        </header>

        <section className="login-template-body">
          <div className="login-template-visual">
            <div className="login-template-copy">
              <p className="portal-eyebrow">Welcome</p>
              <h1>Sign in to ACAD-HUB</h1>
              <p className="portal-intro">
                Use the same portal design to access student, faculty, and admin workflows from one place.
              </p>
            </div>
          </div>

          <div className="login-template-panel">
            {!role ? (
              <RoleSelector setRole={setRole} />
            ) : (
              <LoginForm role={role} goBack={() => setRole(null)} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
