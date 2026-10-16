import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/server/api/admin/login.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Admin login failed.");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Server connection failed. Please check XAMPP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-layout">

      {/* Header */}
      <header className="admin-login-header">
        <NavLink to="/" className="admin-login-brand">
          <span className="admin-login-brand-icon">E</span>

          <span>
            E-Learning
            <small>LEARNING PLATFORM</small>
          </span>
        </NavLink>

        <NavLink to="/" className="admin-login-home">
          Back to Website
        </NavLink>
      </header>

      {/* Login Section */}
      <main className="admin-login-main">
        <div className="admin-login-page">
          <form className="admin-login-card" onSubmit={handleSubmit}>
            <div className="admin-login-icon">A</div>

            <h1>Admin Login</h1>
            <p>Sign in to manage your learning platform</p>

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="admin-login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-login-footer">
        <p>
          © {new Date().getFullYear()} E-Learning Platform.
          All rights reserved.
        </p>

        <span>Learn. Grow. Succeed.</span>
      </footer>

    </div>
  );
}

export default AdminLogin;