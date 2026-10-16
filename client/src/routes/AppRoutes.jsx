
import { Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// User Pages
import Home from "../pages/user/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Courses from "../pages/user/Courses";
import CourseDetails from "../pages/user/CourseDetails";
import MyLearning from "../pages/user/MyLearning";
import LearnCourses from "../pages/user/LearnCourses";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AdminCourses from "../pages/admin/AdminCourses";

// Admin Protection
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";
import ManageLectures from "../pages/admin/ManageLectures";

import Students from "../pages/admin/Students";
function AppRoutes() {
    return (
        <Routes>
            {/* =========================
          USER ROUTES
      ========================= */}

            <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />

                <Route
                    path="/courses/:id"
                    element={<CourseDetails />}
                />

                <Route
                    path="/my-learning"
                    element={<MyLearning />}
                />

                <Route
                    path="/my-courses"
                    element={<MyLearning />}
                />

                <Route
                    path="/learn/:id"
                    element={<LearnCourses />}
                />
            </Route>

            {/* =========================
          ADMIN LOGIN
      ========================= */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* =========================
          PROTECTED ADMIN ROUTES
      ========================= */}

            <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="courses"
                        element={<AdminCourses />}
                    />

                    <Route
                        path="courses/add"
                        element={<AddCourse />}
                    />
                    <Route
                        path="courses/edit/:id"
                        element={<EditCourse />}
                    />
                    <Route path="lessons" element={<ManageLectures />} />
                    <Route
    path="students"
    element={<Students />}
/>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
