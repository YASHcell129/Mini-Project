import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ role, goBack }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
        role
      });

      if (res.data.success) {
        // store returned user info so dashboards can read the display name
        try {
          if (res.data.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            if (res.data.user.name) localStorage.setItem("userName", res.data.user.name);
          }
        } catch (err) {
          // ignore storage errors
        }

        if (role === "Student") {
          window.location.href = "/student";
        } else if (role === "Faculty") {
          window.location.href = "/faculty";
        } else if (role === "Admin") {
          window.location.href = "/admin";
        }
      }
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="card">
      <h2>{role} Login</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" type="text" placeholder="Username" required />

        <div className="password-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((s) => !s)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.52 0-10-4.48-10-10 0-2.47.88-4.73 2.35-6.5" />
                <path d="M1 1l22 22" />
                <path d="M9.53 9.53A3.5 3.5 0 0 0 14.47 14.47" />
                <path d="M12 6a6 6 0 0 1 6 6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </span>
        </div>

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>

      <p className="back" onClick={goBack}>← Back</p>
    </div>
  );
};

export default LoginForm;
