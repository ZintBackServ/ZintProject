import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TopInfo from "./pages/TopInfo";
import Footer from "./pages/Footer";
import DataProvider from "./context/DataProvider";
import { AdminRoute, PrivateRoute } from "./components/ProtectedRoute";
import NotificationPopup from "./components/Notification";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";

// ── Eagerly loaded (Home page main view) ────────────────────────────────────
import Home from "./pages/Home";

// ── Lazy-loaded routes (split into separate JS chunks) ─────────────────────
const ContactUS            = lazy(() => import("./components/ContactUS"));
const MagicBento           = lazy(() => import("./pages/MagicBento"));
const Antigravity          = lazy(() => import("./pages/Antigravity"));
const VideoLectures        = lazy(() => import("./components/VideoLectures"));
const PlacedStudent        = lazy(() => import("./components/PlacedStudentSlider"));

// ── Lazy-loaded routes (split into separate JS chunks) ─────────────────────
const Courses              = lazy(() => import("./pages/Courses"));
const CourseDetail         = lazy(() => import("./pages/CourseDetail"));
const About                = lazy(() => import("./pages/About"));
const Login                = lazy(() => import("./pages/Login"));
const SignUp               = lazy(() => import("./pages/SignUp"));
const Events               = lazy(() => import("./pages/Events"));
const Internship           = lazy(() => import("./pages/Internship"));
const Blog                 = lazy(() => import("./pages/Blog"));
const OnlineTraining       = lazy(() => import("./pages/OnlineTraining"));
const PlacementRegistration = lazy(() => import("./pages/PlacementRegistration"));
const GoogleAuthSuccess    = lazy(() => import("./pages/Googleauthsuccess"));

// ── Components used as routes ──────────────────────────────────────────────
const Admission         = lazy(() => import("./components/Admission"));
const PrivacyPolicy     = lazy(() => import("./components/PrivacyPolicy"));
const RefundPolicy      = lazy(() => import("./components/RefundPolicy"));
const TermsConditions   = lazy(() => import("./components/TermsConditions"));
const Careers           = lazy(() => import("./components/Careers"));
const ApplyCertificate  = lazy(() => import("./pages/ApplyCertificate"));
const OnlineTest        = lazy(() => import("./pages/OnlineTest"));
const Services          = lazy(() => import("./pages/Services"));
const Webinar           = lazy(() => import("./pages/Webinar"));
const Workshop          = lazy(() => import("./pages/Workshop"));

// ── Protected / admin ──────────────────────────────────────────────────────
const AdminDashboard       = lazy(() => import("./pages/admin/AdminDashboard"));
const Dashboard            = lazy(() => import("./pages/user/Dashboard"));
const FeePay               = lazy(() => import("./pages/user/FeePay"));
const AdminRatingDashboard = lazy(() => import("./pages/admin/Rating").then(m => ({ default: m.AdminRatingDashboard })));

function App() {
  return (
    <DataProvider>
      <ScrollToTop />
      <TopInfo />
      <Navbar />
      <NotificationPopup />

      {/* Suspense fallback shown while any lazy chunk is loading */}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/"                    element={<Home />} />
          <Route path="/about"               element={<About />} />
          <Route path="/courses"             element={<Courses />} />
          <Route path="/OnlineTraining"      element={<OnlineTraining />} />
          <Route path="/PrivacyPolicy"       element={<PrivacyPolicy />} />
          <Route path="/RefundPolicy"        element={<RefundPolicy />} />
          <Route path="/TermsConditions"     element={<TermsConditions />} />
          <Route path="/contact"             element={<ContactUS />} />
          <Route path="/careers"             element={<Careers />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/signup"              element={<SignUp />} />
          <Route path="/courses/:id"         element={<CourseDetail />} />
          <Route path="/courses/:id/fee"     element={<FeePay />} />
          <Route path="/Events"              element={<Events />} />
          {/* <Route path="/Blog"                element={<Blog />} /> */}
          <Route path="/Internship"          element={<Internship />} />
          <Route path="/PlacedStudent"       element={<PlacedStudent />} />
          <Route path="/OnlineAdmission"       element={<Admission />} />
          <Route path="/PlacementRegistration"  element={<PlacementRegistration />} />
          <Route path="/auth/google/success"    element={<GoogleAuthSuccess />} />
          <Route path="/magic-bento"            element={<MagicBento />} />
          <Route path="/antigravity"            element={<Antigravity />} />
          <Route path="/video-lectures"         element={<VideoLectures />} />
          <Route path="/ApplyCertificate"       element={<ApplyCertificate />} />
          <Route path="/OnlineTest"             element={<OnlineTest />} />
          {/* <Route path="/Services"               element={<Services />} /> */}
          <Route path="/Webinar"                element={<Webinar />} />
          <Route path="/Workshop"               element={<Workshop />} />

          {/* Logged in users only */}
          <Route path="/user/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/dashboard/*" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/ratings" element={<AdminRatingDashboard />} />
        </Routes>
      </Suspense>

      <Footer />
    </DataProvider>
  );
}

export default App;