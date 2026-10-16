import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost/server/api/auth/login.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!data.success) {
        setError(data.message);
        return;
      }

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Login successful
      alert("Login successful!");

      navigate("/");

    } catch (error) {
      console.error("Login Error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-container">

        {/* ================= LEFT SIDE ================= */}

        <div className="login-info">

          <span className="login-label">
            WELCOME BACK
          </span>

          <h1>
            Continue your
            <span> learning journey.</span>
          </h1>

          <p>
            Sign in to access your courses,
            track your progress, and continue
            learning from where you left off.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              Access your enrolled courses
            </div>

            <div>
              <span>✓</span>
              Track your learning progress
            </div>

            <div>
              <span>✓</span>
              Complete quizzes and earn certificates
            </div>

          </div>

        </div>


        {/* ================= LOGIN CARD ================= */}

        <div className="login-card">

          <div className="login-card-header">

            <h2>Sign in</h2>

            <p>
              Enter your details to continue.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

            </div>


            {/* Error */}

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}


            {/* Remember / Forgot */}

            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <Link to="#">
                Forgot password?
              </Link>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>


          {/* Register */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;