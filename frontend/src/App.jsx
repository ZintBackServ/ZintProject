import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import TopInfo from "./components/layout/TopInfo";
import Footer from "./components/layout/Footer";
import DataProvider from "./context/DataProvider";
import { AdminRoute, PrivateRoute } from "./components/auth/ProtectedRoute";
import NotificationPopup from "./components/ui/Notification";
import ScrollToTop from "./components/layout/ScrollToTop";
import Loading from "./components/ui/Loading";

// ── Eagerly loaded (Home page main view) ────────────────────────────────────
import Home from "./pages/Home";

// ── Lazy-loaded routes (split into separate JS chunks) ─────────────────────
const ContactUS            = lazy(() => import("./pages/ContactUs"));
const MagicBento           = lazy(() => import("./components/shared/MagicBento"));
const Antigravity          = lazy(() => import("./pages/Antigravity"));
const VideoLectures        = lazy(() => import("./components/shared/VideoLectures"));
const PlacedStudent        = lazy(() => import("./components/sliders/PlacedStudentSlider"));

// ── Lazy-loaded routes (split into separate JS chunks) ─────────────────────
const Courses              = lazy(() => import("./pages/Courses"));
const CourseDetail         = lazy(() => import("./pages/CourseDetail"));
const About                = lazy(() => import("./pages/About"));
const Login                = lazy(() => import("./pages/Login"));
const Events               = lazy(() => import("./pages/Events"));
const Internship           = lazy(() => import("./pages/Internship"));
const Blog                 = lazy(() => import("./pages/Blog"));
const OnlineTraining       = lazy(() => import("./pages/OnlineTraining"));
const PlacementRegistration = lazy(() => import("./pages/PlacementRegistration"));
const LatestJobUpdates     = lazy(() => import("./pages/LatestJobUpdates"));
const GoogleAuthSuccess    = lazy(() => import("./pages/Googleauthsuccess"));

// ── Pages and Legal Routes ──────────────────────────────────────────────────
const Admission         = lazy(() => import("./pages/Admission"));
const PrivacyPolicy     = lazy(() => import("./pages/legal/PrivacyPolicy"));
const RefundPolicy      = lazy(() => import("./pages/legal/RefundPolicy"));
const TermsConditions   = lazy(() => import("./pages/legal/TermsConditions"));
const Careers           = lazy(() => import("./pages/Careers"));
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
  const { pathname } = useLocation();
  const isPortal = pathname.startsWith("/user/") || pathname.startsWith("/admin/");

  return (
    <DataProvider>
      <ScrollToTop />
      {!isPortal && <TopInfo />}
      {!isPortal && <Navbar />}
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
          <Route path="/signup"              element={<Navigate to="/login" replace />} />
          <Route path="/courses/:id"         element={<CourseDetail />} />
          <Route path="/courses/:id/fee"     element={<FeePay />} />
          <Route path="/Events"              element={<Events />} />
          {/* <Route path="/Blog"                element={<Blog />} /> */}
          <Route path="/Internship"          element={<Internship />} />
          <Route path="/PlacedStudent"       element={<PlacedStudent />} />
          <Route path="/OnlineAdmission"       element={<Admission />} />
          <Route path="/PlacementRegistration"  element={<PlacementRegistration />} />
          <Route path="/LatestJobUpdates"       element={<LatestJobUpdates />} />
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

      {!isPortal && <Footer />}
    </DataProvider>
  );
}

export default App;
