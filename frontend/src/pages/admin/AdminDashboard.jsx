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
import PlacedStudentDashboard from "./PlacedStudentDashboard";
import Rating from "./Rating";
import EnrolledStudent from "./EnrolledStudent";
import Notification from "./Notification";
import AddLatestUpdate from "./AddLatestUpdate";
import Enquiries from "./Enquiries";
import TimeTable from "./TimeTable";
import AddCategory from "./AddCategory";
import EditCourse  from "./EditCourse";
import InternshipRegistration from "./InternshipRegistration";
import PlacementRegistration from "./PlacementRegistration";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top navbar — passes toggle function */}
      <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex relative">

        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto min-h-screen">
          <Routes>
            <Route path="/"   element={<DashboardHome/>} />
            <Route path="/AddCourse" element={<AddCourse/>} />
            <Route path="/EditCourse/:id" element={<EditCourse/>} />
            <Route path="/ShowAllCourse" element={<ShowAllCourse/>} />
            <Route path="/AddMentor"  element={<AddMentor/>}/>
            <Route path="/UserAdminDashboard" element={<UserAdminDashboard/>} />
            <Route path="/AllEventRegistration" element={<AllEventRegistration/>} />
            <Route path="/PlacedStudentDashboard"  element={<PlacedStudentDashboard/>} />
            <Route path="/Rating"   element={<Rating/>} />
            <Route path="/EnrolledStudent"   element={<EnrolledStudent/>} />
            <Route path="/Notification"   element={<Notification/>} />
            <Route path="/AddLatestUpdate"   element={<AddLatestUpdate/>} />
            <Route path="/AddCategory" element={<AddCategory />} />
            <Route path="/Enquiries" element={<Enquiries />} />
            <Route path="/TimeTable" element={<TimeTable />} />
            <Route path="/InternshipRegistration" element={<InternshipRegistration />} />
            <Route path="/PlacementRegistration" element={<PlacementRegistration />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default AdminDashboard;


