import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import "./MyLearning.css";

function MyLearning() {
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!user?.id) {
        localStorage.removeItem("user");
        navigate("/login");
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

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON:", text);
        setError("Server returned an invalid response.");
        return;
      }

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to load your courses."
        );
        return;
      }

      setMyCourses(
        Array.isArray(data.courses)
          ? data.courses
          : []
      );
    } catch (error) {
      console.error("My Courses Error:", error);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="my-learning-page">
        <section className="my-learning-loading">
          <div className="loading-spinner"></div>
          <p>Loading your courses...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="my-learning-page">

      <section className="my-learning-header">
        <span className="my-learning-label">
          MY LEARNING
        </span>

        <h1>
          Continue your learning journey
        </h1>

        <p>
          Access your enrolled courses and continue
          where you left off.
        </p>
      </section>

      {error && (
        <section className="my-learning-error">
          <div>
            <strong>Unable to load courses</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchMyCourses}
          >
            Try Again
          </button>
        </section>
      )}

      {!error && myCourses.length === 0 && (
        <section className="empty-learning">
          <div className="empty-icon">📚</div>

          <h2>No courses yet</h2>

          <p>
            You haven't enrolled in any courses yet.
          </p>

          <Link
            to="/courses"
            className="browse-courses-btn"
          >
            Browse Courses
          </Link>
        </section>
      )}

      {!error && myCourses.length > 0 && (
        <section className="my-courses-section">

          <div className="my-courses-top">
            <div>
              <span className="section-label">
                YOUR COURSES
              </span>

              <h2>My Courses</h2>
            </div>

            <span className="course-count">
              {myCourses.length}{" "}
              {myCourses.length === 1
                ? "course"
                : "courses"}
            </span>
          </div>

          <div className="my-courses-grid">

            {myCourses.map((course) => {

              const progress =
                Number(course.progress) || 0;

              return (
                <article
                  className="my-course-card"
                  key={course.course_id}
                >

                  <div
                    className="my-course-accent"
                    style={{
                      background:
                        course.accent || "#B8860B",
                    }}
                  />

                  <div className="my-course-content">

                    <span className="my-course-category">
                      {course.category}
                    </span>

                    <h3>
                      {course.title}
                    </h3>

                    <p className="my-course-instructor">
                      By {course.instructor}
                    </p>

                    <div className="my-course-meta">
                      <span>
                        ◷ {course.duration}
                      </span>

                      <span>
                        ★ {course.rating}
                      </span>

                      <span>
                        {course.difficulty}
                      </span>
                    </div>

                    {course.enrolled_at && (
                      <p className="enrolled-date">
                        Enrolled on{" "}
                        {new Date(
                          course.enrolled_at
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <div className="progress-info">
                      <span>Progress</span>

                      <strong>
                        {progress}%
                      </strong>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-value"
                        style={{
                          width: `${progress}%`,
                          background:
                            course.accent ||
                            "#B8860B",
                        }}
                      />
                    </div>

                    <Link
                      to={`/learn/${course.course_id}`}
                      className="continue-btn"
                      style={{
                        background:
                          course.accent ||
                          "#B8860B",
                      }}
                    >
                      Continue Learning →
                    </Link>

                  </div>
                </article>
              );
            })}

          </div>
        </section>
      )}

    </main>
  );
}

export default MyLearning;