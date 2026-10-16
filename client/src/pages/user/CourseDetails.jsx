import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import API_BASE_URL from "../../config/api";

import "./CourseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  // =================================
  // FETCH COURSE FROM PHP + MYSQL
  // =================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/courses/get-course.php?id=${id}`
        );

        if (!response.ok) {
          throw new Error("Server response failed");
        }

        const data = await response.json();

        if (data.success) {
          setCourse(data.course);

          // First lesson automatically select
          if (
            data.course.modules?.length > 0 &&
            data.course.modules[0].lessons?.length > 0
          ) {
            setSelectedLesson(
              data.course.modules[0].lessons[0]
            );
          }
        } else {
          setError(
            data.message || "Course not found."
          );
        }
      } catch (error) {
        console.error(
          "Course Details Error:",
          error
        );

        setError(
          "Unable to fetch course from server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // =================================
  // LOADING
  // =================================

  if (loading) {
    return (
      <main className="course-details">
        <h2>Loading course...</h2>
      </main>
    );
  }

  // =================================
  // ERROR
  // =================================

  if (error || !course) {
    return (
      <main className="course-details">
        <h2>
          {error || "Course not found"}
        </h2>
      </main>
    );
  }

  // =================================
  // ENROLL COURSE
  // =================================

  const handleEnroll = async () => {
    setEnrollMessage("");

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem("user");

      alert(
        "Session expired. Please login again."
      );

      navigate("/login");
      return;
    }

    if (!user?.id) {
      alert(
        "User information not found. Please login again."
      );

      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);

      const response = await fetch(
        `${API_BASE_URL}/enrollment/enroll.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,
            course_id: course.id,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Enrollment Response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error(
          "Invalid JSON from PHP:",
          responseText
        );

        setEnrollMessage(
          "Server returned an invalid response. Check enroll.php."
        );

        return;
      }

      if (!response.ok) {
        setEnrollMessage(
          data.message ||
            "Enrollment failed."
        );

        return;
      }

      if (!data.success) {
        if (
          data.message
            ?.toLowerCase()
            .includes("already")
        ) {
          setEnrolled(true);
        }

        setEnrollMessage(
          data.message ||
            "Unable to enroll in course."
        );

        return;
      }

      setEnrolled(true);

      setEnrollMessage(
        data.message ||
          "Successfully enrolled in this course!"
      );

    } catch (error) {
      console.error(
        "Enrollment Error:",
        error
      );

      setEnrollMessage(
        "Unable to connect to server. Make sure XAMPP Apache is running."
      );
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <main className="course-details">

      {/* =================================
          COURSE HEADER
      ================================= */}

      <section
        className="course-header"
        style={{
          "--accent": course.accent,
        }}
      >

        <span className="course-category">
          {course.category}
        </span>

        <h1>
          {course.title}
        </h1>

        <p className="course-by">
          By {course.instructor} ·{" "}
          {course.difficulty}
        </p>

        <div className="course-detail-meta">

          <span>
            ◷ {course.duration}
          </span>

          <span>
            ★★★★★
          </span>

          <span>
            {course.rating} (
            {course.review_count || 0} reviews)
          </span>

        </div>

        <p className="course-description">
          {course.description}
        </p>

        {/* ENROLL BUTTON */}

        <button
          className="enroll-btn"
          onClick={handleEnroll}
          disabled={
            enrolling || enrolled
          }
        >
          {enrolling
            ? "Enrolling..."
            : enrolled
            ? "✓ Enrolled"
            : "Enroll in this course"}
        </button>

        {/* ENROLL MESSAGE */}

        {enrollMessage && (
          <p
            className={`enroll-message ${
              enrolled
                ? "enroll-success"
                : "enroll-error"
            }`}
          >
            {enrollMessage}
          </p>
        )}

      </section>


      {/* =================================
          VIDEO PLAYER
      ================================= */}

      {selectedLesson && (
        <section className="course-video-section">

          <div className="video-header">

            <div>
              <span>
                Now Playing
              </span>

              <h2>
                {selectedLesson.title}
              </h2>
            </div>

            <span>
              {selectedLesson.duration}
            </span>

          </div>

          <div className="video-player">

            <iframe
              key={selectedLesson.id}
              src={selectedLesson.video}
              title={selectedLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

          </div>

        </section>
      )}


      {/* =================================
          CURRICULUM + REVIEWS
      ================================= */}

      <div className="course-lower">

        {/* CURRICULUM */}

        <section className="curriculum">

          <h2>
            Curriculum
          </h2>

          {course.modules?.map(
            (module, index) => (

              <div
                className="module"
                key={module.id}
              >

                <h3>
                  {index + 1}.{" "}
                  {module.title}
                </h3>

                {module.lessons?.map(
                  (lesson) => (

                    <button
                      type="button"
                      className={`lesson ${
                        selectedLesson?.id ===
                        lesson.id
                          ? "lesson-active"
                          : ""
                      }`}
                      key={lesson.id}
                      onClick={() =>
                        setSelectedLesson(
                          lesson
                        )
                      }
                    >

                      <span>
                        ▶ {lesson.title}
                      </span>

                      <span>
                        {lesson.duration}
                      </span>

                    </button>

                  )
                )}

              </div>
            )
          )}


          {/* FINAL QUIZ */}

          <div className="final-quiz">

            <div>

              <h3>
                Final quiz
              </h3>

              <p>
                {course.quiz?.length || 0}{" "}
                questions · pass with 60%
                or higher
              </p>

            </div>

            <button type="button">
              Take quiz
            </button>

          </div>

        </section>


        {/* REVIEWS */}

        <section className="reviews">

          <h2>
            Reviews
          </h2>

          <div className="review">

            <strong>
              Jordan K.
            </strong>

            <span>
              ★★★★★
            </span>

            <p>
              Finally understood state vs
              props for real.
            </p>

          </div>

          <div className="review">

            <strong>
              Ana R.
            </strong>

            <span>
              ★★★★☆
            </span>

            <p>
              Fast-paced but worth it.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default CourseDetails;