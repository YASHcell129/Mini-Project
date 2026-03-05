import { useState } from "react";
import RoleSelector from "../components/RoleSelector";
import LoginForm from "../components/LoginForm";
import "../style.css";

const LoginPage = () => {
  const [role, setRole] = useState(null);

  return (
    <div className="container">

      {/* 🔥 BRAND */}
      <div className="brand">ACAD-HUB</div>

      {/* 🔐 LOGIN BOX */}
      {!role ? (
        <RoleSelector setRole={setRole} />
      ) : (
        <LoginForm role={role} goBack={() => setRole(null)} />
      )}

    </div>
  );
};

export default LoginPage;
