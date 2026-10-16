
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function UserLayout() {
  return (
    <>
      <nav>
        <Navbar />
      </nav>

      <main className="user-layout-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default UserLayout;
