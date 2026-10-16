
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import "./HeroSection.css";

function HeroSection() {
  const [progress, setProgress] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setProgress(0);
          setCourseCount(0);
          return;
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch {
          setProgress(0);
          setCourseCount(0);
          return;
        }

        if (!user?.id) {
          setProgress(0);
          setCourseCount(0);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/enrollment/my-courses.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: Number(user.id),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch progress"
          );
        }

        const courses = Array.isArray(data.courses)
          ? data.courses
          : [];

        setCourseCount(courses.length);

        if (courses.length === 0) {
          setProgress(0);
          return;
        }

        // Average progress across enrolled courses
        const totalProgress = courses.reduce(
          (total, course) =>
            total +
            Math.min(
              100,
              Math.max(0, Number(course.progress) || 0)
            ),
          0
        );

        setProgress(
          Math.round(totalProgress / courses.length)
        );
      } catch (error) {
        console.error("Student progress error:", error);
        setProgress(0);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchStudentProgress();
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">
            🚀 Learn. Grow. Succeed.
          </span>

          <h1>
            Learn New Skills.
            <span> Build Your Future.</span>
          </h1>

          <p>
            Learn programming, web development, AI, data
            science and other in-demand skills from expert
            instructors.
          </p>

          <div className="hero-buttons">
            <Link to="/courses" className="btn-primary">
              Explore Courses
            </Link>

            <Link to="/register" className="btn-secondary">
              Get Started
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>100+</strong>
              <span>Courses</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Instructors</span>
            </div>

            <div>
              <strong>10K+</strong>
              <span>Students</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-card">
            <div className="card-icon">🎓</div>

            <h3>
              {courseCount > 0
                ? "Welcome Back!"
                : "Start Learning Today"}
            </h3>

            <p>
              {courseCount > 0
                ? `You are enrolled in ${courseCount} ${
                    courseCount === 1 ? "course" : "courses"
                  }. Keep learning!`
                : "Choose a course and start building your skills."}
            </p>

            <div className="learning-progress">
              <div className="progress-header">
                <span>Your Progress</span>

                <strong>
                  {loadingProgress ? "..." : `${progress}%`}
                </strong>
              </div>

              <div
                className="progress-bar"
                role="progressbar"
                aria-label="Your average learning progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {courseCount > 0 && (
              <Link
                to="/my-learning"
                className="btn-primary"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  textDecoration: "none",
                }}
              >
                Continue Learning →
              </Link>
            )}
          </div>

          <div className="floating-card card-one">
            📚 100+ Courses
          </div>

          <div className="floating-card card-two">
            ⭐ 4.8 Rating
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
