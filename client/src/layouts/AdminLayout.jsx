
import { Outlet } from "react-router-dom";

import AdminHeader from "../pages/admin/AdminHeader";
import AdminFooter from "../pages/admin/AdminFooter";

import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-layout-content">
        <AdminHeader />

        <main className="admin-main">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
