
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import "./LearnCourses.css";

// Convert YouTube video or playlist URLs into embed URLs
function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return "";

  try {
    const cleanUrl = url.replace(/&amp;/g, "&").trim();

    // Allow a playlist ID directly
    if (
      /^(PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(
        cleanUrl
      )
    ) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
        cleanUrl
      )}`;
    }

    const parsedUrl = new URL(cleanUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;

    const isYouTube =
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com" ||
      hostname === "www.youtube-nocookie.com";

    // YouTube playlist embed URL
    if (
      isYouTube &&
      pathname === "/embed/videoseries"
    ) {
      const playlistId = parsedUrl.searchParams.get("list") || "";

      if (/^[a-zA-Z0-9_-]+$/.test(playlistId)) {
        return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
          playlistId
        )}`;
      }

      return "";
    }

    let videoId = "";

    // Short YouTube URL
    if (hostname === "youtu.be") {
      videoId = pathname.split("/").filter(Boolean)[0] || "";
    } else if (isYouTube) {
      if (pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      } else if (
        pathname.startsWith("/embed/") ||
        pathname.startsWith("/shorts/")
      ) {
        videoId = pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

// Sort modules' lessons by database sort_order.
// Keep original order as fallback if sort_order is missing.
function sortModuleLessons(modules = []) {
  return modules.map((module) => ({
    ...module,
    lessons: [...(module.lessons || [])].sort((a, b) => {
      const orderA = Number(a.sort_order);
      const orderB = Number(b.sort_order);

      const validA =
        a.sort_order !== null &&
        a.sort_order !== undefined &&
        a.sort_order !== "";

      const validB =
        b.sort_order !== null &&
        b.sort_order !== undefined &&
        b.sort_order !== "";

      if (validA && validB && orderA !== orderB) {
        return orderA - orderB;
      }

      if (validA !== validB) {
        return validA ? -1 : 1;
      }

      return 0;
    }),
  }));
}

function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  // Fetch course
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourse() {
      try {
        setLoadingCourse(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/courses/get-course.php?id=${encodeURIComponent(
            id
          )}`,
          { signal: controller.signal }
        );

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid Course JSON:", text);
          setError("Server returned an invalid response.");
          return;
        }

        if (!response.ok || !data.success) {
          setError(data.message || "Unable to load course.");
          return;
        }

        // Sort lessons before storing the course.
        const sortedCourse = {
          ...data.course,
          modules: sortModuleLessons(data.course.modules || []),
        };

        setCourse(sortedCourse);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Course Fetch Error:", err);
          setError("Unable to connect to server.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCourse(false);
        }
      }
    }

    if (id) {
      fetchCourse();
    } else {
      setError("Course ID is missing.");
      setLoadingCourse(false);
    }

    return () => controller.abort();
  }, [id]);

  // Flatten lessons in module and lesson order
  const allLessons = useMemo(
    () =>
      course?.modules?.flatMap(
        (module) => module.lessons || []
      ) || [],
    [course]
  );

  // Load completed lessons
  useEffect(() => {
    if (!course) return;

    const controller = new AbortController();

    async function fetchCompletedLessons() {
      try {
        setLoadingProgress(true);

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
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/progress/my-progress.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              user_id: Number(user.id),
              course_id: String(course.id),
            }),
          }
        );

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid Progress JSON:", text);
          return;
        }

        if (!response.ok || !data.success) {
          console.error(
            data.message || "Unable to load progress."
          );
          return;
        }

        const lessons = Array.isArray(data.completed_lessons)
          ? data.completed_lessons.map((lessonId) =>
              String(lessonId)
            )
          : [];

        setCompletedLessons(lessons);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Load Progress Error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProgress(false);
        }
      }
    }

    fetchCompletedLessons();

    return () => controller.abort();
  }, [course, navigate]);

  // Choose the first incomplete lesson when course/progress loads.
  useEffect(() => {
    if (!course || loadingProgress || allLessons.length === 0) {
      return;
    }

    setSelectedLesson((previous) => {
      // Keep a user's current selection if it still exists.
      if (
        previous &&
        allLessons.some(
          (lesson) => String(lesson.id) === String(previous.id)
        )
      ) {
        return (
          allLessons.find(
            (lesson) => String(lesson.id) === String(previous.id)
          ) || previous
        );
      }

      return (
        allLessons.find(
          (lesson) =>
            !completedLessons.includes(String(lesson.id))
        ) || allLessons[allLessons.length - 1]
      );
    });
  }, [course, loadingProgress, allLessons, completedLessons]);

  if (loadingCourse) {
    return (
      <main className="learn-course-page">
        <div className="learn-loading">Loading course...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="learn-course-page">
        <div className="learn-not-found">
          <h1>Unable to load course</h1>
          <p>{error}</p>
          <Link to="/courses">← Back to Courses</Link>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="learn-course-page">
        <div className="learn-not-found">
          <h1>Course not found</h1>
          <Link to="/courses">Back to Courses</Link>
        </div>
      </main>
    );
  }

  const firstIncompleteLesson = allLessons.find(
    (lesson) =>
      !completedLessons.includes(String(lesson.id))
  );

  const defaultLesson =
    firstIncompleteLesson || allLessons[allLessons.length - 1];

  const currentLesson = selectedLesson || defaultLesson;

  const progress =
    allLessons.length > 0
      ? Math.round(
          (allLessons.filter((lesson) =>
            completedLessons.includes(String(lesson.id))
          ).length /
            allLessons.length) *
            100
        )
      : 0;

  // Mark current lesson complete and select the next lesson
  const markLessonComplete = async () => {
    try {
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

      if (!user?.id || !course?.id || !currentLesson?.id) {
        alert("User ID, Course ID and Lesson ID are required.");
        return;
      }

      const lessonId = String(currentLesson.id);

      if (completedLessons.includes(lessonId)) {
        return;
      }

      setCompleting(true);

      const response = await fetch(
        `${API_BASE_URL}/progress/complete-lesson.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(user.id),
            course_id: String(course.id),
            lesson_id: lessonId,
          }),
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid Complete Lesson JSON:", text);
        alert("Server returned an invalid response.");
        return;
      }

      if (!response.ok || !data.success) {
        alert(data.message || "Unable to complete lesson.");
        return;
      }

      setCompletedLessons((previous) =>
        previous.includes(lessonId)
          ? previous
          : [...previous, lessonId]
      );

      const currentIndex = allLessons.findIndex(
        (lesson) => String(lesson.id) === lessonId
      );

      const nextLesson = allLessons[currentIndex + 1];

      if (nextLesson) {
        setSelectedLesson(nextLesson);
      } else {
        alert("Congratulations! You completed the course.");
      }
    } catch (err) {
      console.error("Complete Lesson Error:", err);
      alert("Unable to connect to server.");
    } finally {
      setCompleting(false);
    }
  };

  if (loadingProgress) {
    return (
      <main className="learn-course-page">
        <div className="learn-loading">
          Loading your course...
        </div>
      </main>
    );
  }

  const currentVideoUrl = getYouTubeEmbedUrl(
    currentLesson?.video
  );

  return (
    <main className="learn-course-page">
      {/* Header */}
      <header className="learn-header">
        <div className="learn-header-left">
          <Link to="/my-learning" className="back-learning">
            ← My Learning
          </Link>

          <div>
            <span className="learn-category">
              {course.category}
            </span>

            <h1>{course.title}</h1>
            <p>By {course.instructor}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="learn-progress">
          <span>Course Progress</span>
          <strong>{progress}%</strong>

          <div className="learn-progress-bar">
            <div
              style={{
                width: `${progress}%`,
                background: course.accent,
              }}
            />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="learn-layout">
        <section className="learn-main">
          {/* Video player */}
          <div className="learn-video">
            {currentVideoUrl ? (
              <iframe
                key={`${currentLesson?.id}-${currentVideoUrl}`}
                src={currentVideoUrl}
                title={currentLesson?.title || "Course lesson"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="no-video">
                <p>
                  {currentLesson?.video
                    ? "Invalid YouTube video or playlist URL."
                    : "Video not available for this lesson."}
                </p>
              </div>
            )}
          </div>

          {/* Current lesson */}
          <div className="current-lesson">
            <span>NOW PLAYING</span>
            <h2>{currentLesson?.title || "No lessons available"}</h2>
            <p>{currentLesson?.duration || ""}</p>

            <button
              type="button"
              className="complete-lesson-btn"
              onClick={markLessonComplete}
              disabled={
                completing ||
                !currentLesson?.id ||
                completedLessons.includes(
                  String(currentLesson?.id)
                )
              }
              style={{
                background: completedLessons.includes(
                  String(currentLesson?.id)
                )
                  ? "#16a34a"
                  : course.accent,
              }}
            >
              {completedLessons.includes(
                String(currentLesson?.id)
              )
                ? "✓ Lesson Completed"
                : completing
                ? "Saving..."
                : "Mark as Complete"}
            </button>
          </div>

          {/* About course */}
          <section className="learn-about">
            <h2>About this course</h2>
            <p>{course.description}</p>

            <div className="learn-instructor">
              <strong>Instructor</strong>
              <span>{course.instructor}</span>
            </div>
          </section>
        </section>

        {/* Lesson sidebar */}
        <aside className="lesson-sidebar">
          <div className="sidebar-header">
            <div>
              <span>COURSE CONTENT</span>
              <h2>Lessons</h2>
            </div>

            <strong>{allLessons.length}</strong>
          </div>

          <div className="modules">
            {course.modules?.map((module, moduleIndex) => (
              <div className="learn-module" key={module.id}>
                <div className="module-heading">
                  <span>Module {moduleIndex + 1}</span>
                  <h3>{module.title}</h3>
                </div>

                <div className="lesson-list">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const lessonId = String(lesson.id);

                    const active =
                      String(currentLesson?.id) === lessonId;

                    const completed =
                      completedLessons.includes(lessonId);

                    return (
                      <button
                        type="button"
                        key={lesson.id}
                        className={`learn-lesson ${
                          active ? "active" : ""
                        } ${completed ? "completed" : ""}`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <span className="lesson-number">
                          {completed ? "✓" : lessonIndex + 1}
                        </span>

                        <span className="lesson-info">
                          <strong>{lesson.title}</strong>
                          <small>{lesson.duration || ""}</small>
                        </span>

                        <span className="lesson-play">
                          {active
                            ? "▶"
                            : completed
                            ? "✓"
                            : "○"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default LearnCourse;
