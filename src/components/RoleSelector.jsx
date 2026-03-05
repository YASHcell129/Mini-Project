const RoleSelector = ({ setRole }) => {
  return (
    <div className="card">
      <p>Select Login Type</p>

      <button className="student" onClick={() => setRole("Student")}>
        🎓 Student Login
      </button>

      <button className="faculty" onClick={() => setRole("Faculty")}>
        👨‍🏫 Faculty Login
      </button>

      <button className="admin" onClick={() => setRole("Admin")}>
        🛡️ Admin Login
      </button>
    </div>
  );
};

export default RoleSelector;
