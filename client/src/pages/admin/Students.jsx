
import { useEffect, useMemo, useState } from "react";
import "../students.css";

const API_URL = "http://localhost/server/api/admin/students.php";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Students load nahi ho paaye.");
        }

        setStudents(data.students || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Server se connection nahi ho paya.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchStudents();

    return () => controller.abort();
  }, [retry]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        String(student.id).includes(query)
    );
  }, [students, search]);

  const getInitials = (name = "") => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "S"
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date.replace(" ", "T"));

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="students-page">
      {/* Page Header */}
      <header className="students-header">
        <div>
          <span className="students-eyebrow">ADMINISTRATION</span>
          <h1>Students</h1>
          <p>Manage and keep track of your learning community.</p>
        </div>

        <div className="students-header-badge">
          <span className="students-live-dot" />
          Student Directory
        </div>
      </header>

      {/* Overview */}
      <section className="students-overview">
        <div className="students-overview-icon">♙</div>

        <div className="students-overview-content">
          <p>Total Registered Students</p>
          <h2>
            {loading ? "..." : students.length.toLocaleString("en-IN")}
          </h2>
          <span>All registered student accounts</span>
        </div>

        <div className="students-overview-art" aria-hidden="true">
          <span>♙</span>
          <span>♙</span>
          <span>♙</span>
        </div>
      </section>

      {/* Student Directory */}
      <section className="students-directory">
        <div className="students-directory-heading">
          <div>
            <h2>All Students</h2>
            <p>View registered students and their account details.</p>
          </div>

          <span className="students-count">
            {loading ? "Loading..." : `${filteredStudents.length} students`}
          </span>
        </div>

        <div className="students-toolbar">
          <div className="students-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or ID..."
              aria-label="Search students"
            />

            {search && (
              <button
                type="button"
                className="students-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="students-refresh-btn"
            onClick={() => setRetry((value) => value + 1)}
            disabled={loading}
          >
            <span aria-hidden="true">↻</span> Refresh
          </button>
        </div>

        {error && (
          <div className="students-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        <div className="students-table-wrap">
          <table className="students-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>STUDENT ID</th>
                <th>EMAIL ADDRESS</th>
                <th>REGISTERED ON</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="students-state-cell">
                    <span className="students-spinner" />
                    Loading students...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="students-state-cell">
                    Student data load nahi ho paya.
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="students-state-cell">
                    <div className="students-empty-icon">⌕</div>
                    <strong>
                      {search ? "No students found" : "No students yet"}
                    </strong>
                    <p>
                      {search
                        ? "Try another name, email or student ID."
                        : "Registered students will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>
                      <div className="students-person">
                        <div className={`students-avatar avatar-${index % 5}`}>
                          {getInitials(student.name)}
                        </div>

                        <div className="students-person-info">
                          <strong>{student.name}</strong>
                          <span>Student account</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="students-id">
                        #{String(student.id).padStart(4, "0")}
                      </span>
                    </td>

                    <td>
                      <span className="students-email">
                        {student.email}
                      </span>
                    </td>

                    <td>
                      <span className="students-date">
                        {formatDate(student.created_at)}
                      </span>
                    </td>

                    <td>
                      <span className="students-status">
                        <span />
                        Registered
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && filteredStudents.length > 0 && (
          <footer className="students-table-footer">
            <span>
              Showing <strong>{filteredStudents.length}</strong> of{" "}
              <strong>{students.length}</strong> students
            </span>
            <span className="students-footer-note">
              Data synced from database
            </span>
          </footer>
        )}
      </section>
    </main>
  );
}

export default Students;
