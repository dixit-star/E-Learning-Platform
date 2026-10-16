import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCourse.css";

const GET_API =
  "http://localhost/server/api/admin/courses.php";

const UPDATE_API =
  "http://localhost/server/api/admin/update-course.php";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
    accent: "#4f46e5",
    rating: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(GET_API);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load courses"
          );
        }

        const course = data.courses.find(
          (item) => String(item.id) === id
        );

        if (!course) {
          throw new Error("Course not found");
        }

        setFormData({
          title: course.title || "",
          instructor: course.instructor || "",
          category: course.category || "",
          difficulty: course.difficulty || "Beginner",
          duration: course.duration || "",
          accent: course.accent || "#4f46e5",
          rating: course.rating ?? "",
          description: course.description || "",
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(UPDATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...formData,
          rating:
            formData.rating === ""
              ? null
              : Number(formData.rating),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update course"
        );
      }

      setSuccess("Course updated successfully!");

      setTimeout(() => {
        navigate("/admin/courses");
      }, 700);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-course-page">
        Loading course details...
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="edit-course-page">
        <p className="edit-course-error">{error}</p>

        <button
          type="button"
          className="edit-course-btn"
          onClick={() => navigate("/admin/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <section className="edit-course-page">
      <div className="edit-course-heading">
        <div>
          <p className="edit-course-eyebrow">
            COURSE MANAGEMENT
          </p>
          <h1>Edit Course</h1>
          <p>Update the details of your existing course.</p>
        </div>

        <button
          type="button"
          className="edit-course-back"
          onClick={() => navigate("/admin/courses")}
        >
          ← Back to Courses
        </button>
      </div>

      <form
        className="edit-course-form"
        onSubmit={handleSubmit}
      >
        {success && (
          <p className="edit-course-success">{success}</p>
        )}

        {error && (
          <p className="edit-course-error">{error}</p>
        )}

        <div className="edit-course-grid">
          <div className="edit-course-field">
            <label htmlFor="title">Course Title *</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={255}
              required
            />
          </div>

          <div className="edit-course-field">
            <label htmlFor="instructor">
              Instructor *
            </label>
            <input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="edit-course-field">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Web Development">
                Web Development
              </option>
              <option value="Programming">
                Programming
              </option>
              <option value="Data Science">
                Data Science
              </option>
              <option value="AI & Machine Learning">
                AI & Machine Learning
              </option>
              <option value="Database">Database</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="edit-course-field">
            <label htmlFor="difficulty">
              Difficulty *
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">
                Intermediate
              </option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="edit-course-field">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              maxLength={50}
              placeholder="e.g. 12 hours"
            />
          </div>

          <div className="edit-course-field">
            <label htmlFor="rating">Rating (optional)</label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="9.9"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
            />
          </div>

          <div className="edit-course-field">
            <label htmlFor="accent">Accent Color</label>
            <div className="edit-course-color">
              <input
                id="accent"
                name="accent"
                type="color"
                value={formData.accent}
                onChange={handleChange}
              />
              <span>{formData.accent}</span>
            </div>
          </div>

          <div className="edit-course-field edit-course-full">
            <label htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn..."
            />
          </div>
        </div>

        <div className="edit-course-actions">
          <button
            type="button"
            className="edit-course-cancel"
            onClick={() => navigate("/admin/courses")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-course-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditCourse;