
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  function handleLogout() {
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  }

  return (
    <header className="admin-topbar">
      <NavLink
        to="/admin/dashboard"
        className="admin-topbar-brand"
      >
        <span className="admin-topbar-brand-icon">
          E
        </span>

        <span>
          E-Learning
          <small>ADMIN PANEL</small>
        </span>
      </NavLink>

      <nav className="admin-common-nav">
        <NavLink to="/admin/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/admin/courses">
          Courses
        </NavLink>

        <NavLink to="/admin/lessons">
          Lessons
        </NavLink>

        <NavLink to="/admin/students">
          Students
        </NavLink>
      </nav>

      <div className="admin-common-profile">
        <div className="admin-common-avatar">
          {(admin?.name || "A")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="admin-common-user">
          <strong>{admin?.name || "Admin"}</strong>
          <small>Administrator</small>
        </div>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
