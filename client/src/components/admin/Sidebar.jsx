
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    // Temporary frontend logout; server-side logout will be connected next.
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  }

  const links = [
    { to: "/admin/dashboard", icon: "▦", label: "Dashboard" },
    { to: "/admin/courses", icon: "▣", label: "Courses" },
    { to: "/admin/lessons", icon: "▤", label: "Lessons" },
    { to: "/admin/students", icon: "♙", label: "Students" },
    { to: "/admin/reports", icon: "▥", label: "Reports" },
  ];

  return (
    <aside className="admin-sidebar">
      <NavLink to="/admin/dashboard" className="admin-brand">
        <span className="admin-brand-icon">E</span>
        <span>E-Learning</span>
      </NavLink>

      <p className="admin-label">WORKSPACE</p>

      <nav className="admin-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-help-card">
          <span className="admin-help-icon">?</span>
          <strong>Need help?</strong>
          <p>Manage your learning platform with ease.</p>
        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <span>↪</span> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
