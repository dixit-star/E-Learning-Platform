
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCourses.css";

const API_URL = "http://localhost/server/api/admin/courses.php";
const DELETE_API = "http://localhost/server/api/admin/delete-course.php";

function AdminCourses() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch courses
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Courses load nahi ho paaye."
          );
        }

        setCourses(data.courses || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Server se connection nahi hua."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => controller.abort();
  }, []);

  // Search and filter courses
  const filteredCourses = courses.filter((course) => {
    const query = search.trim().toLowerCase();

    return [
      course.title,
      course.category,
      course.instructor,
      course.status,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  // Published courses count
  const publishedCount = courses.filter(
    (course) =>
      String(course.status || "").toLowerCase() === "published"
  ).length;

  // Edit course
  function handleEdit(courseId) {
    navigate(
      `/admin/courses/edit/${encodeURIComponent(courseId)}`
    );
  }

  // Delete course
  async function handleDelete(course) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(course.id);
      setError("");

      const response = await fetch(DELETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: course.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Course delete nahi ho paaya."
        );
      }

      // Remove deleted course from the current list
      setCourses((previousCourses) =>
        previousCourses.filter(
          (item) => item.id !== course.id
        )
      );
    } catch (err) {
      setError(
        err.message || "Server se connection nahi hua."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>Manage Courses</h1>

          <p className="admin-subtitle">
            Create, organize and manage your learning courses.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => navigate("/admin/courses/add")}
        >
          + Add Course
        </button>
      </header>

      {/* Statistics */}
      <section className="admin-stats">
        <article className="admin-stat-card">
          <p className="admin-stat-title">Total Courses</p>

          <h3>{loading ? "—" : courses.length}</h3>

          <p className="admin-stat-note">
            All courses in your catalog
          </p>
        </article>

        <article className="admin-stat-card">
          <p className="admin-stat-title">
            Published Courses
          </p>

          <h3>{loading ? "—" : publishedCount}</h3>

          <p className="admin-stat-note">
            Courses available to learners
          </p>
        </article>
      </section>

      {/* Course catalog */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Course Catalog</h2>
            <p>Search and manage your courses.</p>
          </div>
        </div>

        <input
          type="search"
          className="course-search"
          placeholder="Search courses, categories, instructors..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {error && (
          <p role="alert" className="course-error">
            {error}
          </p>
        )}

        <div className="course-table-wrap">
          <table className="course-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="course-empty">
                    Loading courses...
                  </td>
                </tr>
              ) : error && courses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="course-empty">
                    Could not load courses. Check the PHP API
                    and database.
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="course-empty">
                    {search
                      ? "No matching courses found."
                      : "No courses found. Add your first course."}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>

                    <td>{course.category || "—"}</td>

                    <td>{course.instructor || "—"}</td>

                    <td>
                      <span
                        className={`course-status ${
                          String(course.status || "").toLowerCase() ===
                          "published"
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {course.status || "Draft"}
                      </span>
                    </td>

                    <td>
                      <div className="course-actions">
                        <button
                          type="button"
                          className="admin-secondary-btn"
                          onClick={() => handleEdit(course.id)}
                          disabled={deletingId === course.id}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="course-delete-btn"
                          onClick={() => handleDelete(course)}
                          disabled={deletingId === course.id}
                        >
                          {deletingId === course.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="admin-secondary-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </section>
    </div>
  );
}

export default AdminCourses;
