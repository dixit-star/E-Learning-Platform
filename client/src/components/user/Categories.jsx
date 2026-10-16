import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../../config/api";

import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/courses/get-courses.php`
        );

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Categories Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // MySQL se aayi courses ke unique categories
  const categories = [
    ...new Set(
      courses.map((course) => course.category)
    ),
  ];

  const categoryIcons = {
    "Web Development": "💻",
    Design: "🎨",
    Backend: "⚙️",
    Data: "📊",
    Marketing: "📢",
  };

  const handleCategoryClick = (category) => {
    navigate(
      `/courses?category=${encodeURIComponent(category)}`
    );
  };

  if (loading) {
    return (
      <section className="categories-section">
        <div className="categories-header">
          <div>
            <span className="section-label">
              EXPLORE
            </span>

            <h2>Browse by Category</h2>

            <p>Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">

      <div className="categories-header">

        <div>
          <span className="section-label">
            EXPLORE
          </span>

          <h2>Browse by Category</h2>

          <p>
            Find the right course for your learning goals.
          </p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/courses")}
        >
          View All Courses →
        </button>

      </div>

      <div className="categories-grid">

        {categories.map((category) => {

          const courseCount = courses.filter(
            (course) =>
              course.category === category
          ).length;

          return (
            <button
              className="category-card"
              key={category}
              onClick={() =>
                handleCategoryClick(category)
              }
            >

              <div className="category-icon">
                {categoryIcons[category] || "📚"}
              </div>

              <div className="category-content">

                <h3>{category}</h3>

                <p>
                  {courseCount}{" "}
                  {courseCount === 1
                    ? "Course"
                    : "Courses"}
                </p>

              </div>

              <span className="category-arrow">
                →
              </span>

            </button>
          );
        })}

      </div>

    </section>
  );
}

export default Categories;