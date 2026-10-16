import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>E-Learning</h2>

          <p>
            Learn practical skills, build your knowledge,
            and grow your career with expert-led courses.
          </p>
        </div>


        {/* Platform */}
        <div className="footer-column">
          <h3>Platform</h3>

          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>


        {/* Categories */}
        <div className="footer-column">
          <h3>Categories</h3>

          <Link to="/courses?category=Web%20Development">
            Web Development
          </Link>

          <Link to="/courses?category=Design">
            Design
          </Link>

          <Link to="/courses?category=Backend">
            Backend
          </Link>

          <Link to="/courses?category=Data">
            Data
          </Link>
        </div>


        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>

          <a href="#faq">FAQ</a>
          <a href="#contact">Contact Us</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} E-Learning.
          All rights reserved.
        </p>

        <p>
          Learn. Practice. Grow.
        </p>

      </div>

    </footer>
  );
}

export default Footer;