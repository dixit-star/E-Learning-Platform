// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// import { COURSES } from "../../data/courses";
// import CourseCard from "../../components/user/CourseCard";

// import "./Courses.css";

// function Courses() {
//   const [search, setSearch] = useState("");

//   const [searchParams, setSearchParams] = useSearchParams();

//   // URL se category read karo
//   const urlCategory = searchParams.get("category");

//   const [category, setCategory] = useState(
//     urlCategory || "All"
//   );

//   // Categories
//   const categories = [
//     "All",
//     ...new Set(
//       COURSES.map((course) => course.category)
//     ),
//   ];

//   // URL category change hone par state update
//   useEffect(() => {
//     setCategory(urlCategory || "All");
//   }, [urlCategory]);

//   // Category select
//   const handleCategory = (item) => {
//     setCategory(item);

//     if (item === "All") {
//       setSearchParams({});
//     } else {
//       setSearchParams({
//         category: item,
//       });
//     }
//   };

//   // Search + Category
//   const filteredCourses = COURSES.filter((course) => {
//     const searchText = search
//       .trim()
//       .toLowerCase();

//     const matchesSearch =
//       searchText === "" ||
//       course.title
//         .toLowerCase()
//         .includes(searchText) ||
//       course.instructor
//         .toLowerCase()
//         .includes(searchText) ||
//       course.category
//         .toLowerCase()
//         .includes(searchText);

//     const matchesCategory =
//       category === "All" ||
//       course.category === category;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <main className="courses-page">

//       {/* Header */}
//       <div className="courses-header">

//         <div>
//           <span className="courses-label">
//             EXPLORE
//           </span>

//           <h1>Course Catalog</h1>

//           <p>
//             Learn new skills from practical,
//             expert-led courses.
//           </p>
//         </div>

//       </div>


//       {/* Search */}
//       <div className="course-search">

//         <span className="search-icon">
//           🔍
//         </span>

//         <input
//           type="search"
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           placeholder="Search courses, instructors or categories..."
//         />

//         {search && (
//           <button
//             className="clear-search"
//             onClick={() => setSearch("")}
//           >
//             ✕
//           </button>
//         )}

//       </div>


//       {/* Categories */}
//       <div className="category-filter">

//         {categories.map((item) => (

//           <button
//             key={item}
//             type="button"
//             className={
//               category === item
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               handleCategory(item)
//             }
//           >
//             {item}
//           </button>

//         ))}

//       </div>


//       {/* Result Info */}
//       <div className="course-result-info">

//         <p>
//           <strong>
//             {filteredCourses.length}
//           </strong>{" "}
//           {filteredCourses.length === 1
//             ? "course"
//             : "courses"}{" "}
//           found
//         </p>

//         {category !== "All" && (
//           <p>
//             Category:{" "}
//             <strong>{category}</strong>
//           </p>
//         )}

//       </div>


//       {/* Course Cards */}
//       {filteredCourses.length > 0 ? (

//         <div className="catalog-grid">

//           {filteredCourses.map((course) => (

//             <CourseCard
//               key={course.id}
//               course={course}
//             />

//           ))}

//         </div>

//       ) : (

//         <div className="no-courses">

//           <div className="no-course-icon">
//             🔎
//           </div>

//           <h2>No courses found</h2>

//           <p>
//             Try another course or category.
//           </p>

//           <button
//             onClick={() => {
//               setSearch("");
//               handleCategory("All");
//             }}
//           >
//             Clear Filters
//           </button>

//         </div>

//       )}

//     </main>
//   );
// }

// export default Courses;
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import API_BASE_URL from "../../config/api";
import CourseCard from "../../components/user/CourseCard";

import "./Courses.css";

function Courses() {
  const [search, setSearch] = useState("");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // URL se category read karo
  const urlCategory = searchParams.get("category");

  const [category, setCategory] = useState(
    urlCategory || "All"
  );

  // ================================
  // Fetch courses from PHP API
  // ================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/courses/get-courses.php`
        );

        if (!response.ok) {
          throw new Error("Server response failed");
        }

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
        } else {
          setError(
            data.message || "Failed to load courses"
          );
        }
      } catch (error) {
        console.error("Course Fetch Error:", error);

        setError(
          "Unable to fetch courses from server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ================================
  // Categories
  // ================================

  const categories = [
    "All",
    ...new Set(
      courses.map((course) => course.category)
    ),
  ];

  // ================================
  // URL category change
  // ================================

  useEffect(() => {
    setCategory(urlCategory || "All");
  }, [urlCategory]);

  // ================================
  // Category select
  // ================================

  const handleCategory = (item) => {
    setCategory(item);

    if (item === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: item,
      });
    }
  };

  // ================================
  // Search + Category Filter
  // ================================

  const filteredCourses = courses.filter(
    (course) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        searchText === "" ||
        course.title
          ?.toLowerCase()
          .includes(searchText) ||
        course.instructor
          ?.toLowerCase()
          .includes(searchText) ||
        course.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        course.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // ================================
  // Loading
  // ================================

  if (loading) {
    return (
      <main className="courses-page">
        <div className="courses-header">
          <div>
            <span className="courses-label">
              EXPLORE
            </span>

            <h1>Course Catalog</h1>

            <p>
              Loading courses...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // Error
  // ================================

  if (error) {
    return (
      <main className="courses-page">
        <div className="no-courses">
          <div className="no-course-icon">
            ⚠️
          </div>

          <h2>Unable to load courses</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="courses-page">

      {/* Header */}
      <div className="courses-header">

        <div>
          <span className="courses-label">
            EXPLORE
          </span>

          <h1>Course Catalog</h1>

          <p>
            Learn new skills from practical,
            expert-led courses.
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="course-search">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search courses, instructors or categories..."
        />

        {search && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}

      </div>

      {/* Categories */}
      <div className="category-filter">

        {categories.map((item) => (

          <button
            key={item}
            type="button"
            className={
              category === item
                ? "active"
                : ""
            }
            onClick={() =>
              handleCategory(item)
            }
          >
            {item}
          </button>

        ))}

      </div>

      {/* Result Info */}
      <div className="course-result-info">

        <p>
          <strong>
            {filteredCourses.length}
          </strong>{" "}

          {filteredCourses.length === 1
            ? "course"
            : "courses"}{" "}

          found
        </p>

        {category !== "All" && (
          <p>
            Category:{" "}
            <strong>
              {category}
            </strong>
          </p>
        )}

      </div>

      {/* Course Cards */}
      {filteredCourses.length > 0 ? (

        <div className="catalog-grid">

          {filteredCourses.map(
            (course) => (

              <CourseCard
                key={course.id}
                course={course}
              />

            )
          )}

        </div>

      ) : (

        <div className="no-courses">

          <div className="no-course-icon">
            🔎
          </div>

          <h2>No courses found</h2>

          <p>
            Try another course or category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              handleCategory("All");
            }}
          >
            Clear Filters
          </button>

        </div>

      )}

    </main>
  );
}

export default Courses;