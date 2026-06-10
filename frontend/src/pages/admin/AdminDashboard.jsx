// pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar   from "../../components/admin/AdminNavbar";
import AdminSidebar  from "../../components/admin/AdminSidebar";
import DashboardHome from "./DashboardHome";
import AddCourse     from "./AddCourse";
import ShowAllCourse from "./ShowAllCourse";
import AllEventRegistration from "./AllEventRegistration";
import AddMentor     from "./AddMentor";     // MentorDashboard
import UserAdminDashboard from "./UserAdminDashboard";
import PlacedStudentAdminDashboard from "./PlacedStudentAdminDashboard";
import Rating from "./Rating";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top navbar — passes toggle function */}
      <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex relative">

        {/* Mobile overlay — tap outside to close sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — slides in on mobile, always visible on desktop */}
        <div
          className={`
            fixed md:static top-0 left-0 h-full z-30
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto min-h-screen">
          <Routes>
            <Route path="/"   element={<DashboardHome />} />
            <Route path="/AddCourse" element={<AddCourse />} />
            <Route path="/ShowAllCourse" element={<ShowAllCourse />} />
            <Route path="/AddMentor"  element={<AddMentor />}/>
            <Route path="/UserAdminDashboard" element={<UserAdminDashboard />} />
            <Route path="/AllEventRegistration" element={<AllEventRegistration />} />
            <Route path="/PlacedStudentAdminDashboard"  element={<PlacedStudentAdminDashboard />} />
            <Route path="/Rating"   element={<Rating />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default AdminDashboard;
