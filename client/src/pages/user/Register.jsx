import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost/server/api/auth/register.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Registration successful
      alert("Registration successful!");

      navigate("/login");

    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        {/* Left Section */}
        <div className="register-info">

          <span className="register-label">
            START LEARNING
          </span>

          <h1>
            Build skills.
            <span> Grow your future.</span>
          </h1>

          <p>
            Create your account and start learning
            from expert instructors with practical,
            career-focused courses.
          </p>

          <div className="register-features">

            <div>
              <span>✓</span>
              Access quality courses
            </div>

            <div>
              <span>✓</span>
              Track your learning progress
            </div>

            <div>
              <span>✓</span>
              Earn course certificates
            </div>

          </div>

        </div>


        {/* Register Card */}
        <div className="register-card">

          <div className="register-card-header">

            <h2>Create account</h2>

            <p>
              Join our learning community today.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="register-form-group">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>


            {/* Email */}
            <div className="register-form-group">

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
            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-password">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}
            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

            </div>


            {/* Error */}
            {error && (
              <p className="register-error">
                {error}
              </p>
            )}


            {/* Terms */}
            <label className="terms-check">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions
              </span>

            </label>


            {/* Submit */}
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* Login */}
          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Register;