
import { useEffect, useState } from "react";
import "./ManageLectures.css";

const API_BASE = "http://localhost/server/api/admin";

const MODULES_API = `${API_BASE}/modules.php`;
const LESSONS_API = `${API_BASE}/lessons.php`;
const ADD_MODULE_API = `${API_BASE}/add-module.php`;
const ADD_API = `${API_BASE}/add-lesson.php`;
const UPDATE_API = `${API_BASE}/update-lesson.php`;
const DELETE_API = `${API_BASE}/delete-lesson.php`;
const PLAYLIST_API = `${API_BASE}/import-playlist.php`;
const COURSES_API = `${API_BASE}/courses.php`;

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Request complete nahi ho paayi."
    );
  }

  return data;
}

const emptyForm = {
  title: "",
  duration: "",
  video: "",
};

function ManageLectures() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");

  const [mode, setMode] = useState("single");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingModule, setCreatingModule] = useState(false);
  const [importing, setImporting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load courses and modules when the page opens.
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        setError("");

        const [courseResponse, moduleResponse] = await Promise.all([
          fetch(COURSES_API),
          fetch(MODULES_API),
        ]);

        const courseData = await readResponse(courseResponse);
        const moduleData = await readResponse(moduleResponse);

        if (!active) return;

        const courseList = courseData.courses || [];
        const moduleList = moduleData.modules || [];

        setCourses(courseList);
        setModules(moduleList);

        if (moduleList.length > 0) {
          setModuleId(String(moduleList[0].id));
          setCourseId(String(moduleList[0].course_id));
        } else {
          setModuleId("");
          setCourseId(
            courseList.length ? String(courseList[0].id) : ""
          );
        }
      } catch (err) {
        if (active) {
          setError(
            `${err.message} Courses/modules API check karo.`
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Load lectures whenever the selected module changes.
  useEffect(() => {
    let active = true;

    async function fetchLessons() {
      if (!moduleId) {
        setLessons([]);
        return;
      }

      try {
        const response = await fetch(
          `${LESSONS_API}?module_id=${encodeURIComponent(moduleId)}`
        );

        const data = await readResponse(response);

        if (active) {
          setLessons(data.lessons || []);
        }
      } catch (err) {
        if (active) {
          setLessons([]);
          setError(err.message || "Lectures load nahi hue.");
        }
      }
    }

    fetchLessons();

    return () => {
      active = false;
    };
  }, [moduleId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function startEditing(lesson) {
    setError("");
    setMessage("");

    setEditingId(String(lesson.id));

    setEditForm({
      title: lesson.title || "",
      duration: lesson.duration || "",
      video: lesson.video || "",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  async function handleCreateModule(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!courseId) {
      setError("create course first.");
      return;
    }

    if (!moduleTitle.trim()) {
      setError("enter the Module title .");
      return;
    }

    try {
      setCreatingModule(true);

      const response = await fetch(ADD_MODULE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
          title: moduleTitle.trim(),
        }),
      });

      const data = await readResponse(response);
      const createdModuleId = data.module?.id;

      const moduleResponse = await fetch(MODULES_API);
      const moduleData = await readResponse(moduleResponse);
      const moduleList = moduleData.modules || [];

      setModules(moduleList);
      setModuleTitle("");

      if (createdModuleId) {
        const newId = String(createdModuleId);
        setModuleId(newId);

        const created = moduleList.find(
          (item) => String(item.id) === newId
        );

        if (created) {
          setCourseId(String(created.course_id));
        }
      }

      setMessage(
        data.message || "Module successfully create ho gaya."
      );
    } catch (err) {
      setError(err.message || "Module  does not create successfully.");
    } finally {
      setCreatingModule(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!moduleId) {
      setError("Pehle module select ya create karo.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(ADD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          ...form,
          title: form.title.trim(),
          video: form.video.trim(),
        }),
      });

      const data = await readResponse(response);

      setForm(emptyForm);

      const lessonsResponse = await fetch(
        `${LESSONS_API}?module_id=${encodeURIComponent(moduleId)}`
      );
      const lessonsData = await readResponse(lessonsResponse);

      setLessons(lessonsData.lessons || []);
      setMessage(data.message || "Lecture add successfully .");
    } catch (err) {
      setError(err.message || "Lecture  does not add .");
    } finally {
      setSaving(false);
    }
  }

  async function handlePlaylistImport(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!moduleId) {
      setError("create a module first.");
      return;
    }

    if (!playlistUrl.trim()) {
      setError(" Past the YouTube playlist URL  .");
      return;
    }

    try {
      setImporting(true);

      const response = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          playlist_url: playlistUrl.trim(),
        }),
      });

      const data = await readResponse(response);

      const lessonsResponse = await fetch(
        `${LESSONS_API}?module_id=${encodeURIComponent(moduleId)}`
      );
      const lessonsData = await readResponse(lessonsResponse);

      setLessons(lessonsData.lessons || []);
      setPlaylistUrl("");

      setMessage(
        data.message ||
          `Playlist import complete. Imported: ${data.imported ?? 0}, skipped: ${data.skipped ?? 0}.`
      );
    } catch (err) {
      setError(err.message || "Playlist import  error .");
    } finally {
      setImporting(false);
    }
  }

  // Update an existing lecture.
  async function handleUpdateLesson(event, lessonId) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!editForm.title.trim()) {
      setError("Lecture title  are required .");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(UPDATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lessonId,
          title: editForm.title.trim(),
          duration: editForm.duration.trim(),
          video: editForm.video.trim(),
        }),
      });

      const data = await readResponse(response);

      const lessonsResponse = await fetch(
        `${LESSONS_API}?module_id=${encodeURIComponent(moduleId)}`
      );
      const lessonsData = await readResponse(lessonsResponse);

      setLessons(lessonsData.lessons || []);
      setEditingId(null);
      setEditForm(emptyForm);

      setMessage(data.message || "Lecture update ho gaya.");
    } catch (err) {
      setError(err.message || "Lecture are not  update .");
    } finally {
      setUpdating(false);
    }
  }

  // Delete a lecture after confirmation.
  async function handleDeleteLesson(lesson) {
    const confirmed = window.confirm(
      `you want "${lesson.title}" delete the lacture. this action can not undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      setDeletingId(String(lesson.id));

      const response = await fetch(DELETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lesson.id,
        }),
      });

      const data = await readResponse(response);

      setLessons((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(lesson.id)
        )
      );

      if (String(editingId) === String(lesson.id)) {
        cancelEditing();
      }

      setMessage(data.message || "Lecture delete ho gaya.");
    } catch (err) {
      setError(err.message || "Lecture is not   delete .");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="manage-lectures">
      <header className="lectures-heading">
        <div>
          <p className="lectures-eyebrow">CONTENT MANAGEMENT</p>
          <h1>Manage Lectures</h1>
          <p>
            Create modules, add videos, import playlists, and manage
            existing lectures.
          </p>
        </div>
      </header>

      {error && (
        <p className="lecture-alert lecture-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="lecture-alert lecture-success" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <section className="lecture-panel">
          <p>Loading courses and modules...</p>
        </section>
      ) : (
        <>
          {/* CREATE MODULE */}
          <section className="lecture-panel">
            <h2>1. Create Course Module</h2>

            {courses.length === 0 ? (
              <p className="lecture-empty">
                No courses available. Create a course first.
              </p>
            ) : (
              <form
                className="lecture-form"
                onSubmit={handleCreateModule}
              >
                <label htmlFor="courseId">Select Course</label>

                <select
                  id="courseId"
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  disabled={creatingModule || saving || importing}
                  required
                >
                  {courses.map((course) => (
                    <option key={course.id} value={String(course.id)}>
                      {course.title}
                    </option>
                  ))}
                </select>

                <label htmlFor="moduleTitle">Module Title</label>

                <input
                  id="moduleTitle"
                  value={moduleTitle}
                  onChange={(event) => setModuleTitle(event.target.value)}
                  placeholder="e.g. Introduction to React"
                  maxLength={255}
                  required
                />

                <button
                  type="submit"
                  disabled={creatingModule || saving || importing}
                >
                  {creatingModule ? "Creating Module..." : "+ Create Module"}
                </button>
              </form>
            )}
          </section>

          {/* ADD LECTURES */}
          <section className="lecture-panel">
            <h2>2. Add Lectures</h2>

            {modules.length === 0 ? (
              <p className="lecture-empty">
                No modules available. Create a module first.
              </p>
            ) : (
              <>
                <label htmlFor="moduleId">Select Course Module</label>

                <select
                  id="moduleId"
                  value={moduleId}
                  onChange={(event) => {
                    const nextModuleId = event.target.value;
                    const selected = modules.find(
                      (item) => String(item.id) === nextModuleId
                    );

                    setModuleId(nextModuleId);

                    if (selected) {
                      setCourseId(String(selected.course_id));
                    }

                    cancelEditing();
                    setError("");
                    setMessage("");
                  }}
                  disabled={saving || importing || creatingModule || updating}
                  required
                >
                  {modules.map((module) => (
                    <option key={module.id} value={String(module.id)}>
                      {module.course_title} — {module.module_title}
                    </option>
                  ))}
                </select>

                <div className="lecture-mode-switch">
                  <button
                    type="button"
                    className={mode === "single" ? "active" : ""}
                    onClick={() => {
                      setMode("single");
                      setError("");
                      setMessage("");
                    }}
                    disabled={saving || importing}
                  >
                    Single Video
                  </button>

                  <button
                    type="button"
                    className={mode === "playlist" ? "active" : ""}
                    onClick={() => {
                      setMode("playlist");
                      setError("");
                      setMessage("");
                    }}
                    disabled={saving || importing}
                  >
                    YouTube Playlist
                  </button>
                </div>

                {mode === "single" ? (
                  <form
                    onSubmit={handleSubmit}
                    className="lecture-form"
                  >
                    <label htmlFor="title">Lecture Title</label>
                    <input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Introduction to React"
                      maxLength={255}
                      required
                    />

                    <label htmlFor="duration">Duration</label>
                    <input
                      id="duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="e.g. 08:30"
                      maxLength={50}
                    />

                    <label htmlFor="video">YouTube Video URL</label>
                    <input
                      id="video"
                      name="video"
                      type="url"
                      value={form.video}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />

                    <button type="submit" disabled={saving || importing}>
                      {saving ? "Saving..." : "+ Add Lecture"}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handlePlaylistImport}
                    className="lecture-form"
                  >
                    <label htmlFor="playlistUrl">
                      YouTube Playlist URL
                    </label>

                    <input
                      id="playlistUrl"
                      type="url"
                      value={playlistUrl}
                      onChange={(event) => setPlaylistUrl(event.target.value)}
                      placeholder="https://www.youtube.com/playlist?list=..."
                      required
                    />

                    <p className="playlist-help">
                      
                      past the url of publick playlist.
                    </p>

                    <button
                      type="submit"
                      disabled={importing || saving || creatingModule}
                    >
                      {importing
                        ? "Importing Playlist..."
                        : "Import YouTube Playlist"}
                    </button>
                  </form>
                )}
              </>
            )}
          </section>

          {/* LECTURE LIST */}
          <section className="lecture-panel">
            <h2>3. Lecture List</h2>

            <p className="lecture-count">
              {lessons.length} lecture{lessons.length !== 1 ? "s" : ""}
            </p>

            {!moduleId ? (
              <p>Select or create a module to see its lectures.</p>
            ) : lessons.length === 0 ? (
              <p className="lecture-empty">
                There are no lectures in this module.
              </p>
            ) : (
              <div className="lecture-list">
                {lessons.map((lesson, index) => {
                  const isEditing =
                    String(editingId) === String(lesson.id);

                  return (
                    <article className="lecture-item" key={lesson.id}>
                      <div className="lecture-number">{index + 1}</div>

                      <div className="lecture-details">
                        {isEditing ? (
                          <form
                            className="lecture-form lecture-edit-form"
                            onSubmit={(event) =>
                              handleUpdateLesson(event, lesson.id)
                            }
                          >
                            <label htmlFor={`edit-title-${lesson.id}`}>
                              Lecture Title
                            </label>
                            <input
                              id={`edit-title-${lesson.id}`}
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              maxLength={255}
                              required
                            />

                            <label htmlFor={`edit-duration-${lesson.id}`}>
                              Duration
                            </label>
                            <input
                              id={`edit-duration-${lesson.id}`}
                              name="duration"
                              value={editForm.duration}
                              onChange={handleEditChange}
                              maxLength={50}
                              placeholder="e.g. 08:30"
                            />

                            <label htmlFor={`edit-video-${lesson.id}`}>
                              Video URL
                            </label>
                            <input
                              id={`edit-video-${lesson.id}`}
                              name="video"
                              type="url"
                              value={editForm.video}
                              onChange={handleEditChange}
                              placeholder="https://www.youtube.com/watch?v=..."
                            />

                            <div className="lecture-actions">
                              <button
                                type="submit"
                                disabled={updating || deletingId !== null}
                              >
                                {updating ? "Saving..." : "Save Changes"}
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={updating}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h3>{lesson.title}</h3>
                            <p>{lesson.duration || "Duration not set"}</p>

                            <div className="lecture-actions">
                              {lesson.video && (
                                <a
                                  href={lesson.video}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="lecture-preview"
                                >
                                  Preview video
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => startEditing(lesson)}
                                disabled={updating || deletingId !== null}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(lesson)}
                                disabled={updating || deletingId !== null}
                              >
                                {deletingId === String(lesson.id)
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default ManageLectures;
