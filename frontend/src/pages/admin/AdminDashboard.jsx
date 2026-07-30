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
import InternshipRegistration from "./InternshipRegistration";
import PlacementRegistration from "./PlacementRegistration";



function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top navbar — passes toggle function */}
      <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex relative">

        {/*
          Sidebar owns ALL of its own responsive behavior internally:
          - fixed positioning + translate-x slide on mobile/tablet
          - its own backdrop (rendered only when isOpen is true)
          - switches to always-visible sticky column at the lg: breakpoint
          So we just pass state through — no extra wrapper div, no second backdrop,
          and no mismatched breakpoint (previously this wrapper used md: while
          AdminSidebar internally used lg:, and isOpen was never even passed down,
          which is why the sidebar could never actually open on mobile).
        */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto min-h-screen">
          <Routes>
            <Route path="/"   element={<DashboardHome/>} />
            <Route path="/AddCourse" element={<AddCourse/>} />
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




// // pages/admin/AdminDashboard.jsx
// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import AdminNavbar   from "../../components/admin/AdminNavbar";
// import AdminSidebar  from "../../components/admin/AdminSidebar";
// import DashboardHome from "./DashboardHome";
// import AddCourse     from "./AddCourse";
// import ShowAllCourse from "./ShowAllCourse";
// import AllEventRegistration from "./AllEventRegistration";
// import AddMentor     from "./AddMentor";     // MentorDashboard
// import UserAdminDashboard from "./UserAdminDashboard";
// import PlacedStudentDashboard from "./PlacedStudentDashboard";
// import Rating from "./Rating";
// import EnrolledStudent from "./EnrolledStudent";
// import Notification from "./Notification";
// import AddLatestUpdate from "./AddLatestUpdate";
// import Enquiries from "./Enquiries";
// import TimeTable from "./TimeTable";
// import AddCategory from "./AddCategory";
// import InternshipRegistration from "./InternshipRegistration";
// import PlacementRegistration from "./PlacementRegistration";



// function AdminDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* Top navbar — passes toggle function */}
//       <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

//       <div className="flex relative">

//         {/* Mobile overlay — tap outside to close sidebar */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar — slides in on mobile, always visible on desktop */}
//         <div
//           className={`
//             fixed md:static top-0 left-0 h-full z-30
//             transform transition-transform duration-300
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//             md:translate-x-0
//           `}
//         >
//           <AdminSidebar onClose={() => setSidebarOpen(false)} />
//         </div>

//         {/* Main content area */}
//         <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto min-h-screen">
//           <Routes>
//             <Route path="/"   element={<DashboardHome/>} />
//             <Route path="/AddCourse" element={<AddCourse/>} />
//             <Route path="/ShowAllCourse" element={<ShowAllCourse/>} />
//             <Route path="/AddMentor"  element={<AddMentor/>}/>
//             <Route path="/UserAdminDashboard" element={<UserAdminDashboard/>} />
//             <Route path="/AllEventRegistration" element={<AllEventRegistration/>} />
//             <Route path="/PlacedStudentDashboard"  element={<PlacedStudentDashboard/>} />
//             <Route path="/Rating"   element={<Rating/>} />
//             <Route path="/EnrolledStudent"   element={<EnrolledStudent/>} />
//             <Route path="/Notification"   element={<Notification/>} />
//             <Route path="/AddLatestUpdate"   element={<AddLatestUpdate/>} />
//             <Route path="/AddCategory" element={<AddCategory />} />
//             <Route path="/Enquiries" element={<Enquiries />} />
//             <Route path="/TimeTable" element={<TimeTable />} />
//             <Route path="/InternshipRegistration" element={<InternshipRegistration />} />
//             <Route path="/PlacementRegistration" element={<PlacementRegistration />} />
//           </Routes>
//         </main>

//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
