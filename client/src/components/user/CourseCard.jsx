import { Link } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="course-card"
      style={{ "--accent": course.accent }}
    >
      <div className="course-card-top"></div>

      <div className="course-card-content">

        <span className="course-category">
          {course.category}
        </span>

        <h2>{course.title}</h2>

        <p className="course-instructor">
          {course.instructor} · {course.difficulty}
        </p>

        <div className="course-rating">
          <span className="stars">★★★★★</span>

          <span className="reviews">
            ({course.reviewCount})
          </span>
        </div>

        <div className="course-duration">
          <span>◷</span>
          <span>{course.duration}</span>
        </div>

      </div>
    </Link>
  );
}

export default CourseCard;