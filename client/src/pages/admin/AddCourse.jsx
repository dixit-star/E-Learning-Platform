
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCourse.css";

const API_URL =
  "http://localhost/server/api/admin/add-course.php";

function AddCourse() {
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          data.message || "Unable to add course"
        );
      }

      setMessage("Course added successfully!");

      setTimeout(() => {
        navigate("/admin/courses");
      }, 800);
    } catch (err) {
      setError(
        err.message ||
          "Server se connection nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="add-course-page">
      <div className="add-course-heading">
        <div>
          <p className="add-course-eyebrow">
            COURSE MANAGEMENT
          </p>

          <h1>Add New Course</h1>

          <p>
            Enter the details to publish a new course.
          </p>
        </div>

        <button
          type="button"
          className="add-course-back"
          onClick={() => navigate("/admin/courses")}
        >
          ← Back to Courses
        </button>
      </div>

      <form
        className="add-course-form"
        onSubmit={handleSubmit}
      >
        {message && (
          <div className="add-course-success">
            {message}
          </div>
        )}

        {error && (
          <div className="add-course-error">
            {error}
          </div>
        )}

        <div className="add-course-grid">
          <div className="add-course-field">
            <label htmlFor="title">
              Course Title *
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete React Course"
              maxLength={255}
              required
            />
          </div>

          <div className="add-course-field">
            <label htmlFor="instructor">
              Instructor Name *
            </label>

            <input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              maxLength={150}
              required
            />
          </div>

          <div className="add-course-field">
            <label htmlFor="category">
              Category *
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select category
              </option>
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
              <option value="Database">
                Database
              </option>
              <option value="Design">
                Design
              </option>
            </select>
          </div>

          <div className="add-course-field">
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
              <option value="Beginner">
                Beginner
              </option>
              <option value="Intermediate">
                Intermediate
              </option>
              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          <div className="add-course-field">
            <label htmlFor="duration">
              Course Duration
            </label>

            <input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 12 hours"
              maxLength={50}
            />
          </div>

          <div className="add-course-field">
            <label htmlFor="rating">
              Initial Rating (optional)
            </label>

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

          <div className="add-course-field">
            <label htmlFor="accent">
              Course Accent Color
            </label>

            <div className="add-course-color">
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

          <div className="add-course-field add-course-full">
            <label htmlFor="description">
              Course Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn..."
              rows="5"
            />
          </div>
        </div>

        <div className="add-course-actions">
          <button
            type="button"
            className="add-course-cancel"
            onClick={() =>
              navigate("/admin/courses")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-course-submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Course"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddCourse;
