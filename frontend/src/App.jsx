import React from "react";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import Internship from "./pages/Internship";
import Admission from "./components/Admission";
import Blog from "./pages/Blog";

  //placement
import PlacementRegistration from "./pages/PlacementRegistration";
import PlacedStudent from "./components/PlacedStudentSlider";

import AdminDashboard from "./pages/admin/AdminDashboard";  // admin dashboard
import Dashboard from "./pages/user/Dashboard";
import OnlineTraining from "./pages/OnlineTraining";
import { Routes, Route } from "react-router-dom"; // removed BrowserRouter
import Navbar from "./components/Navbar";
import TopInfo from "./pages/TopInfo";  //top info bar
import Footer from "./pages/Footer";   //footer
import DataProvider from "./context/DataProvider";
import { AdminRoute, PrivateRoute } from "./components/ProtectedRoute";
import { AdminRatingDashboard } from "./pages/admin/Rating";
import NotificationPopup from "./components/Notification";

function App() {
  return (
    // No BrowserRouter here — it lives in main.jsx now
    <DataProvider>
      <TopInfo />
      <Navbar />
      <NotificationPopup />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/OnlineTraining" element={<OnlineTraining />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/Internship" element={<Internship />} />
        <Route path="/PlacedStudent" element={<PlacedStudent />} />
        <Route path="/OnlineAdmission" element={<Admission />} />
        <Route path="/PlacementRegistration" element={<PlacementRegistration />} />
       
        {/* Logged in users only */}
      <Route path="/user/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

        {/* Admin only route */}
        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/ratings" element={<AdminRatingDashboard />} />
      </Routes>
      <Footer/>
    </DataProvider>
  );
}

export default App;