
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const API_URL =
  "http://localhost/server/api/admin/dashboard-stats.php";

function Dashboard() {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    completedLessons: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load statistics"
          );
        }

        if (isMounted) {
          setStatsData(data.stats);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Server se connection nahi ho paya."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: statsData.totalCourses,
      note: "Courses on your platform",
      icon: "▣",
      color: "purple",
    },
    {
      title: "Total Students",
      value: statsData.totalStudents,
      note: "Registered learners",
      icon: "♙",
      color: "blue",
    },
    {
      title: "Enrollments",
      value: statsData.totalEnrollments,
      note: "Course enrollments",
      icon: "▤",
      color: "orange",
    },
    {
      title: "Completed Lessons",
      value: statsData.completedLessons,
      note: "Lessons completed",
      icon: "✓",
      color: "green",
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-welcome">
        <div>
          <span className="admin-welcome-tag">
            ADMIN WORKSPACE
          </span>

          <h2>Manage learning. Inspire growth.</h2>

          <p>
            Keep your courses, students and learning content
            organized from one place.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="admin-primary-btn"
          >
            Manage Courses <span>→</span>
          </button>
        </div>

        <div className="admin-welcome-art" aria-hidden="true">
          <div className="admin-art-circle">
            <span>✦</span>
          </div>

          <div className="admin-art-card">
            <span className="admin-art-icon">▣</span>
            <div className="admin-art-line long" />
            <div className="admin-art-line short" />
            <div className="admin-art-progress">
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Platform Overview</h2>
            <p>Your platform at a glance</p>
          </div>
        </div>

        {error && (
          <p className="admin-error-message" role="alert">
            {error}
          </p>
        )}

        <div className="admin-stats">
          {stats.map((stat) => (
            <article
              className="admin-stat-card"
              key={stat.title}
            >
              <div className="admin-stat-top">
                <span
                  className={`admin-stat-icon ${stat.color}`}
                >
                  {stat.icon}
                </span>

                <span className="admin-stat-dot">●</span>
              </div>

              <p className="admin-stat-title">{stat.title}</p>

              <h3>
                {loading ? "..." : stat.value.toLocaleString()}
              </h3>

              <p className="admin-stat-note">{stat.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-bottom-grid">
        <article className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Common tasks for your platform</p>
            </div>
          </div>

          <button
            type="button"
            className="admin-action-row"
            onClick={() => navigate("/admin/courses")}
          >
            <span className="admin-action-icon purple">＋</span>

            <span className="admin-action-copy">
              <strong>Manage Courses</strong>
              <small>Organize your course catalog</small>
            </span>

            <span className="admin-action-arrow">→</span>
          </button>

          <button
            type="button"
            className="admin-action-row"
            onClick={() => navigate("/admin/lessons")}
          >
            <span className="admin-action-icon blue">▤</span>

            <span className="admin-action-copy">
              <strong>Manage Lessons</strong>
              <small>Organize course learning content</small>
            </span>

            <span className="admin-action-arrow">→</span>
          </button>

          <button
            type="button"
            className="admin-action-row"
            onClick={() => navigate("/admin/students")}
          >
            <span className="admin-action-icon orange">♙</span>

            <span className="admin-action-copy">
              <strong>View Students</strong>
              <small>Review registered learners</small>
            </span>

            <span className="admin-action-arrow">→</span>
          </button>
        </article>

        <article className="admin-panel admin-status-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>System Status</h2>
              <p>Development environment</p>
            </div>

            <span className="admin-status-dot" />
          </div>

          <div className="admin-status-row">
            <span>Frontend</span>
            <span className="admin-status-badge">Ready</span>
          </div>

          <div className="admin-status-row">
            <span>Admin interface</span>
            <span className="admin-status-badge">Ready</span>
          </div>

          <div className="admin-status-row">
            <span>Live statistics API</span>
            <span className={
              error
                ? "admin-pending-badge"
                : "admin-status-badge"
            }>
              {loading
                ? "Loading..."
                : error
                  ? "Error"
                  : "Connected"}
            </span>
          </div>

          <p className="admin-status-footnote">
            {error
              ? "Statistics could not be loaded. Check the API and database connection."
              : loading
                ? "Fetching statistics from your database..."
                : "Statistics are loaded from your database."}
          </p>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
