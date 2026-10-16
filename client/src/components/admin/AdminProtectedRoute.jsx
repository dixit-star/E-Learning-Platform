
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(
          "http://localhost/server/api/admin/check-session.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (active) {
          setStatus(
            response.ok && data.authenticated
              ? "authenticated"
              : "unauthenticated"
          );
        }
      } catch (error) {
        console.error("Admin session check failed:", error);

        if (active) {
          setStatus("error");
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <p>Checking admin session...</p>;
  }

  if (status === "error") {
    return <p>Server connection failed. Please check XAMPP.</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
