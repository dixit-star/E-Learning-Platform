import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../../config/api";

import "./TopInstructors.css";

function TopInstructors() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // FETCH COURSES FROM DATABASE
  // ================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/courses/get-courses.php`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses || []);
        } else {
          console.error(
            data.message || "Unable to load courses"
          );
        }
      } catch (error) {
        console.error(
          "Top Instructors Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ================================
  // UNIQUE INSTRUCTORS
  // ================================

  const instructors = [
    ...new Map(
      courses.map((course) => [
        course.instructor,
        course,
      ])
    ).values(),
  ];

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="instructors-section">

        <div className="instructors-header">

          <div>
            <span className="section-label">
              MEET THE EXPERTS
            </span>

            <h2>
              Top Instructors
            </h2>

            <p>
              Loading instructors...
            </p>
          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="instructors-section">

      {/* ================================
          HEADER
      ================================= */}

      <div className="instructors-header">

        <div>

          <span className="section-label">
            MEET THE EXPERTS
          </span>

          <h2>
            Top Instructors
          </h2>

          <p>
            Learn from instructors who turn
            complex topics into practical skills.
          </p>

        </div>


        <button
          type="button"
          className="instructors-view-btn"
          onClick={() => navigate("/courses")}
        >
          Explore Courses →
        </button>

      </div>


      {/* ================================
          INSTRUCTOR CARDS
      ================================= */}

      <div className="instructors-grid">

        {instructors.map((course) => (

          <div
            className="instructor-card"
            key={course.instructor}
          >

            {/* Avatar */}

            <div
              className="instructor-avatar"
              style={{
                "--accent": course.accent,
              }}
            >
              {course.instructor
                ?.charAt(0)
                .toUpperCase()}
            </div>


            {/* Info */}

            <div className="instructor-info">

              <h3>
                {course.instructor}
              </h3>

              <p className="instructor-category">
                {course.category}
              </p>


              <div className="instructor-rating">

                <span>
                  ★
                </span>

                <strong>
                  {course.rating}
                </strong>

                <small>
                  ({course.review_count || 0} reviews)
                </small>

              </div>

            </div>


            {/* Featured Course */}

            <div className="instructor-course">

              <span>
                Featured Course
              </span>

              <p>
                {course.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default TopInstructors;