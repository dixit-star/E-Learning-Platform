
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load logged-in user
  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      setUser(parsedUser?.id ? parsedUser : null);
    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    setMenuOpen(false);
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  // Close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <span className="logo-icon">E</span>
        <span>E-Learning</span>
      </Link>

      {/* Navigation menu */}
      <div className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/courses" onClick={closeMenu}>
          Courses
        </Link>

        {user && (
          <Link to="/my-learning" onClick={closeMenu}>
            My Courses
          </Link>
        )}

        {!user && (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
              onClick={closeMenu}
            >
              Register
            </Link>
          </>
        )}

        {/* Logout inside the mobile menu */}
        {user && (
          <button
            type="button"
            className="logout-btn mobile-menu-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {/* User controls shown in the header */}
      <div className="navbar-actions">
        {user && (
          <>
            <span className="navbar-user" title={user.name}>
              <span className="user-avatar" aria-hidden="true">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="navbar-username">
                {user.name || "Student"}
              </span>
            </span>

            <button
              type="button"
              className="logout-btn desktop-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

        {/* Hamburger button: visible on mobile */}
        <button
          type="button"
          className="navbar-menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <span className={menuOpen ? "bar bar-one open" : "bar bar-one"} />
          <span className={menuOpen ? "bar bar-two open" : "bar bar-two"} />
          <span className={menuOpen ? "bar bar-three open" : "bar bar-three"} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
