// pages/CoursePricing.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

// ── Theme ──────────────────────────────────────────────────────────────────────
const THEME = {
  primary:       "#B026B5",
  primaryLight:  "#f9e8f9",
  primaryHover:  "#8f1e92",
  accent:        "#7c3aed",
  bg:            "#f5f5f5",
  card:          "#ffffff",
  text:          "#1a1a2e",
  textMuted:     "#6b7280",
  textFaint:     "#9ca3af",
  border:        "#e5e7eb",
  strikethrough: "#c0bfbf",
  success:       "#16a34a",
  warning:       "#f59e0b",
  error:         "#dc2626",
};

const ONLINE_FEATURES = [
  { title: "Live Online Classes",     desc: "Attend classes from anywhere via Zoom / Google Meet" },
  { title: "Recorded Sessions",       desc: "Lifetime access to all recorded lectures" },
  { title: "Doubt Clearing Sessions", desc: "Weekly live Q&A with mentors" },
  { title: "Digital Study Material",  desc: "PDFs, notes & assignments shared digitally" },
  { title: "Placement Support",       desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate",             desc: "Industry-recognised course completion certificate" },
];

const OFFLINE_FEATURES = [
  { title: "Physical Classroom",      desc: "In-person sessions at our institute campus" },
  { title: "Recorded Backup",         desc: "Access recordings if you miss a class" },
  { title: "Printed Study Material",  desc: "Comprehensive printed notes & workbooks" },
  { title: "Doubt Clearing Sessions", desc: "Face-to-face doubt sessions with faculty" },
  { title: "Placement Support",       desc: "Resume building, mock interviews & job referrals" },
  { title: "Certificate",             desc: "Industry-recognised course completion certificate" },
];

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const styles = {
    success: { background: "#f0fdf4", borderColor: "#bbf7d0", color: THEME.success },
    error:   { background: "#fef2f2", borderColor: "#fecaca", color: THEME.error },
    info:    { background: THEME.primaryLight, borderColor: `${THEME.primary}40`, color: THEME.primary },
    warning: { background: "#fffbeb", borderColor: "#fde68a", color: THEME.warning },
  };
  const s = styles[toast.type] || styles.info;
  return (
    <div className="fixed bottom-7 right-7 z-50 max-w-xs rounded-xl px-5 py-3.5 text-sm font-medium shadow-xl border transition-all duration-300"
      style={s}>
      {toast.msg}
    </div>
  );
}

// ── Tick ───────────────────────────────────────────────────────────────────────
function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="8" fill={THEME.primary} opacity="0.12" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke={THEME.primary} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ title, icon, price, originalPrice, urgency, features, recommended, onBuy, payLoading }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-2xl p-7 flex flex-col transition-all duration-200"
      style={{
        background: THEME.card,
        border:     recommended ? `2px solid ${THEME.primary}` : `1px solid ${THEME.border}`,
        boxShadow:  recommended ? `0 8px 32px ${THEME.primary}20` : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="text-3xl mb-4">{icon}</div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <h2 className="text-lg font-bold" style={{ color: THEME.text }}>{title}</h2>
        {recommended && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ background: THEME.accent }}>
            Recommended
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold" style={{ color: THEME.text }}>
          ₹ {price.toLocaleString("en-IN")}
        </span>
        {originalPrice && (
          <span className="text-lg line-through" style={{ color: THEME.strikethrough }}>
            {originalPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <p className="text-xs mb-6" style={{ color: urgency ? THEME.primary : THEME.textFaint }}>
        {urgency || "Enroll now"}
      </p>

      <button
        onClick={onBuy}
        disabled={payLoading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-8 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: hovered || recommended ? THEME.primary : THEME.primaryLight,
          color:      hovered || recommended ? "#fff" : THEME.primary,
        }}
      >
        {payLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing…
          </>
        ) : "Buy now"}
      </button>

      <div className="flex flex-col gap-4 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-3">
            <Tick />
            <div>
              <p className="text-sm font-semibold" style={{ color: THEME.text }}>{f.title}</p>
              <p className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CoursePricing() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [mode, setMode]       = useState("Online");
  const [course, setCourse]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  // ── Toast helper ──
  let toastTimer;
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch course ──
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true); setError("");
      try {
        const res  = await fetch(`${API}/course/getCourseById/${id}`);
        const data = await res.json();
        if (!res.ok) { setError(data.msg || "Failed to load course."); return; }
        setCourse(data.course || data);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  // ── Payment flow ──────────────────────────────────────────────────────────
  // Mirrors UserDashboard exactly:
  // Step 1 → enroll-free OR create-order
  // Step 2 → open Razorpay
  // Step 3 → verify → enrollment becomes active
  // Step 4 → dismissed → enrollment stays "pending" (user can Pay Now later)
  const handleBuy = async (selectedMode, price) => {
    const token = getToken();
    if (!token) {
      showToast("Please log in to enroll.", "error");
      navigate("/login");
      return;
    }

    setPayLoading(true);
    showToast("Creating your enrollment…", "info");

    try {
      // ── Step 1: Create Razorpay order ─────────────────────────────────────
      // This also creates a PENDING enrollment on the backend (same as UserDashboard)
      const orderRes = await fetch(`${API}/api/payments/create-order`, {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
          amount:   price,
          mode:     selectedMode,   // pass mode so backend can tag the enrollment
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        showToast(orderData.message || "Could not create order.", "error");
        setPayLoading(false);
        return;
      }

      const { order, key, enrollmentId } = orderData;
      // enrollmentId comes back from backend so we can update it after payment

      // ── Step 2: Open Razorpay ──────────────────────────────────────────────
      const options = {
        key,
        amount:      order.amount,
        currency:    order.currency,
        name:        "ZINT Institute",
        description: course?.courseName || "Course Enrollment",
        order_id:    order.id,
        image:       course?.courseImage || undefined,

        // ── Step 3: Payment SUCCESS ─────────────────────────────────────────
        handler: async (response) => {
          showToast("Verifying payment…", "info");
          try {
            const verifyRes = await fetch(`${API}/api/payments/verify`, {
              method: "POST",
              headers: {
                Authorization:  `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                enrollmentId,        // link payment to the pending enrollment
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              showToast("Payment successful! You are enrolled 🎉", "success");
              // Small delay so user sees the toast before redirect
              setTimeout(() => navigate("/OnlineAdmission"), 2000);
            } else {
              showToast(verifyData.message || "Payment verification failed.", "error");
            }
          } catch {
            showToast("Verification request failed. Contact support.", "error");
          } finally {
            setPayLoading(false);
          }
        },

        theme: { color: THEME.primary },

        // ── Step 4: Modal DISMISSED (user closed without paying) ────────────
        // Enrollment stays PENDING — user can complete it later via "Pay Now"
        modal: {
          ondismiss: () => {
            showToast("Payment cancelled. Your enrollment is saved as pending — you can complete it later.", "warning");
            setPayLoading(false);
            setTimeout(() => navigate("/OnlineAdmission"), 4000);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (r) => {
        showToast(
          "Payment failed: " + (r.error?.description || "Unknown error"),
          "error"
        );
        setPayLoading(false);
      });

      rzp.open();

    } catch {
      showToast("Could not initiate payment. Please try again.", "error");
      setPayLoading(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor: `${THEME.primary}30`, borderTopColor: THEME.primary }} />
        <p className="text-sm" style={{ color: THEME.textMuted }}>Loading course details…</p>
      </div>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border"
        style={{ borderColor: "#fecaca" }}>
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-medium mb-4" style={{ color: THEME.error }}>{error}</p>
        <button onClick={() => navigate(-1)}
          className="text-sm transition-colors"
          style={{ color: THEME.textFaint }}
          onMouseEnter={e => e.currentTarget.style.color = THEME.text}
          onMouseLeave={e => e.currentTarget.style.color = THEME.textFaint}>
          ← Go back
        </button>
      </div>
    </div>
  );

  const onlinePrice  = course?.online_fee ?? 0;
  const offlinePrice = course?.fee ?? 0;

  return (
    <div className="min-h-screen px-4 py-14" style={{ background: THEME.bg }}>
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          {course?.courseName && (
            <p className="text-sm font-semibold mb-2" style={{ color: THEME.primary }}>
              {course.courseName}
            </p>
          )}
          <h1 className="text-4xl font-bold mb-2" style={{ color: THEME.text }}>
            Choose Your Plan
          </h1>
          <p className="text-sm" style={{ color: THEME.textMuted }}>
            Select the learning mode that suits you best
          </p>
        </div>

        {/* ── Toggle ── */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-1 p-1.5 rounded-full"
            style={{ background: "#e5e7eb" }}>
            {["Online", "Offline"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-10 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: mode === m ? THEME.card : "transparent",
                  color:      mode === m ? THEME.primary : THEME.textMuted,
                  boxShadow:  mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div className="max-w-md mx-auto">
          {mode === "Online" && (
            <PlanCard
              title="Online"
              icon="🌐"
              price={onlinePrice}
              originalPrice={Math.round(onlinePrice * 1.67)}
              urgency="Registrations close soon"
              features={ONLINE_FEATURES}
              recommended={true}
              payLoading={payLoading}
              onBuy={() => handleBuy("Online", onlinePrice)}
            />
          )}
          {mode === "Offline" && (
            <PlanCard
              title="Offline"
              icon="🏫"
              price={offlinePrice}
              originalPrice={Math.round(offlinePrice * 1.5)}
              urgency={null}
              features={OFFLINE_FEATURES}
              recommended={false}
              payLoading={payLoading}
              onBuy={() => handleBuy("Offline", offlinePrice)}
            />
          )}
        </div>

        {/* ── Price comparison strip ── */}
        <div className="mt-10 bg-white rounded-2xl px-6 py-5 border"
          style={{ borderColor: THEME.border }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center"
            style={{ color: THEME.textFaint }}>
            Price comparison
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { label: "Online",  price: onlinePrice,  m: "Online",  icon: "🌐" },
              { label: "Offline", price: offlinePrice, m: "Offline", icon: "🏫" },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setMode(item.m)}
                className="flex-1 flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200"
                style={{
                  background: mode === item.m ? THEME.primaryLight : "#fafafa",
                  border:     `1.5px solid ${mode === item.m ? THEME.primary : THEME.border}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: THEME.text }}>{item.label}</span>
                </div>
                <span className="text-lg font-bold"
                  style={{ color: mode === item.m ? THEME.primary : THEME.text }}>
                  ₹ {item.price.toLocaleString("en-IN")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Course meta strip ── */}
        {course && (
          <div className="mt-4 bg-white rounded-2xl px-6 py-4 flex flex-wrap gap-6 items-center justify-center border"
            style={{ borderColor: THEME.border }}>
            {[
              { label: "Duration", value: course.duration ? `${course.duration} months` : "—" },
              { label: "Language", value: course.language  || "—" },
              { label: "Mode",     value: course.mode      || "—" },
              { label: "Category", value: course.category?.categoryName || "—" },
              { label: "Type",     value: course.type      || "—" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-xs mb-0.5" style={{ color: THEME.textFaint }}>{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: THEME.text }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Pending note ── */}
        <p className="text-center text-xs mt-6" style={{ color: THEME.textFaint }}>
          If you close the payment window, your enrollment will be saved as{" "}
          <span style={{ color: THEME.warning, fontWeight: 600 }}>pending</span>.
          You can complete it anytime from your dashboard.
        </p>

      </div>

      <Toast toast={toast} />
    </div>
  );
}


// // pages/CoursePricing.jsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // ── Theme — change these two values to restyle the entire page ──
// const THEME = {
//   primary:       "#B026B5",
//   primaryLight:  "#f9e8f9",
//   primaryHover:  "#8f1e92",
//   accent:        "#7c3aed",
//   bg:            "#f5f5f5",
//   card:          "#ffffff",
//   text:          "#1a1a2e",
//   textMuted:     "#6b7280",
//   textFaint:     "#9ca3af",
//   border:        "#e5e7eb",
//   strikethrough: "#c0bfbf",
//   success:       "#16a34a",
// };

// const ONLINE_FEATURES = [
//   { title: "Live Online Classes",        desc: "Attend classes from anywhere via Zoom / Google Meet" },
//   { title: "Recorded Sessions",          desc: "Lifetime access to all recorded lectures" },
//   { title: "Doubt Clearing Sessions",    desc: "Weekly live Q&A with mentors" },
//   { title: "Digital Study Material",     desc: "PDFs, notes & assignments shared digitally" },
//   { title: "Placement Support",          desc: "Resume building, mock interviews & job referrals" },
//   { title: "Certificate",                desc: "Industry-recognised course completion certificate" },
// ];

// const OFFLINE_FEATURES = [
//   { title: "Physical Classroom",         desc: "In-person sessions at our institute campus" },
//   { title: "Recorded Backup",            desc: "Access recordings if you miss a class" },
//   { title: "Printed Study Material",     desc: "Comprehensive printed notes & workbooks" },
//   { title: "Doubt Clearing Sessions",    desc: "Face-to-face doubt sessions with faculty" },
//   { title: "Placement Support",          desc: "Resume building, mock interviews & job referrals" },
//   { title: "Certificate",                desc: "Industry-recognised course completion certificate" },
// ];

// // ── Tick icon ──
// function Tick() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//       <circle cx="8" cy="8" r="8" fill={THEME.primary} opacity="0.12" />
//       <path d="M4.5 8l2.5 2.5 4.5-5" stroke={THEME.primary} strokeWidth="1.6"
//         strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// // ── Single pricing card ──
// function PlanCard({ title, icon, price, originalPrice, urgency, features, recommended, onBuy }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       className="rounded-2xl p-7 flex flex-col transition-all duration-200"
//       style={{
//         background:  THEME.card,
//         border:      recommended ? `2px solid ${THEME.primary}` : `1px solid ${THEME.border}`,
//         boxShadow:   recommended
//           ? `0 8px 32px ${THEME.primary}20`
//           : "0 2px 8px rgba(0,0,0,0.05)",
//       }}
//     >
//       {/* Icon */}
//       <div className="text-3xl mb-4">{icon}</div>

//       {/* Title + badge */}
//       <div className="flex items-center gap-2 flex-wrap mb-4">
//         <h2 className="text-lg font-bold" style={{ color: THEME.text }}>{title}</h2>
//         {recommended && (
//           <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
//             style={{ background: THEME.accent }}>
//             Recommended
//           </span>
//         )}
//       </div>

//       {/* Price */}
//       <div className="flex items-baseline gap-2 mb-1">
//         <span className="text-3xl font-bold" style={{ color: THEME.text }}>
//           ₹ {price.toLocaleString("en-IN")}
//         </span>
//         {originalPrice && (
//           <span className="text-lg line-through" style={{ color: THEME.strikethrough }}>
//             {originalPrice.toLocaleString("en-IN")}
//           </span>
//         )}
//       </div>

//       {/* Urgency */}
//       <p className="text-xs mb-6" style={{ color: urgency ? THEME.primary : THEME.textFaint }}>
//         {urgency || "Enroll now"}
//       </p>

//       {/* Buy button */}
//       <button
//         onClick={onBuy}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-8"
//         style={{
//           background: hovered || recommended ? THEME.primary : THEME.primaryLight,
//           color:      hovered || recommended ? "#fff" : THEME.primary,
//         }}
//       >
//         Buy now
//       </button>

//       {/* Features */}
//       <div className="flex flex-col gap-4 flex-1">
//         {features.map((f, i) => (
//           <div key={i} className="flex gap-3">
//             <div className="flex-shrink-0 mt-0.5"><Tick /></div>
//             <div>
//               <p className="text-sm font-semibold" style={{ color: THEME.text }}>{f.title}</p>
//               <p className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>{f.desc}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Main page ──
// export default function CoursePricing() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode]     = useState("Online");
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState("");

//   useEffect(() => {
//     const fetchCourse = async () => {
//       setLoading(true); setError("");
//       try {
//         const res  = await fetch(`${import.meta.env.VITE_API_URL}/course/getCourseById/${id}`);
//         const data = await res.json();
//         if (!res.ok) { setError(data.msg || "Failed to load course."); return; }
//         setCourse(data.course || data);
//       } catch {
//         setError("Network error. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchCourse();
//   }, [id]);

//   const handleBuy = (selectedMode, price) => {
//     navigate(`/checkout/${id}`, {
//       state: {
//         courseId:   id,
//         courseName: course?.courseName,
//         mode:       selectedMode,
//         price,
//       },
//     });
//   };

//   // ── Loading ──
//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
//       <div className="text-center">
//         <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
//           style={{ borderColor: `${THEME.primary}40`, borderTopColor: THEME.primary }} />
//         <p className="text-sm" style={{ color: THEME.textMuted }}>Loading course details…</p>
//       </div>
//     </div>
//   );

//   // ── Error ──
//   if (error) return (
//     <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
//       <div className="bg-white rounded-2xl p-8 text-center shadow-sm border"
//         style={{ borderColor: "#fecaca" }}>
//         <p className="font-medium" style={{ color: "#dc2626" }}>{error}</p>
//         <button onClick={() => navigate(-1)}
//           className="mt-4 text-sm transition-colors"
//           style={{ color: THEME.textFaint }}
//           onMouseEnter={e => e.currentTarget.style.color = THEME.text}
//           onMouseLeave={e => e.currentTarget.style.color = THEME.textFaint}>
//           ← Go back
//         </button>
//       </div>
//     </div>
//   );

//   const onlinePrice  = course?.online_fee ?? 0;
//   const offlinePrice = course?.fee ?? 0;

//   // Show one card or two based on toggle
//   const showOnline  = mode === "Online";
//   const showOffline = mode === "Offline";

//   return (
//     <div className="min-h-screen px-4 py-14" style={{ background: THEME.bg }}>
//       <div className="max-w-4xl mx-auto">

//         {/* ── Header ── */}
//         <div className="text-center mb-10">
//           {course?.courseName && (
//             <p className="text-sm font-semibold mb-2" style={{ color: THEME.primary }}>
//               {course.courseName}
//             </p>
//           )}
//           <h1 className="text-4xl font-bold mb-2" style={{ color: THEME.text }}>
//             Choose Your Plan
//           </h1>
//           <p className="text-sm" style={{ color: THEME.textMuted }}>
//             Select the learning mode that suits you best
//           </p>
//         </div>

//         {/* ── Toggle ── */}
//         <div className="flex justify-center mb-12">
//           <div className="flex items-center gap-1 p-1.5 rounded-full"
//             style={{ background: "#e5e7eb" }}>
//             {["Online", "Offline"].map(m => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m)}
//                 className="px-10 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
//                 style={{
//                   background: mode === m ? THEME.card : "transparent",
//                   color:      mode === m ? THEME.primary : THEME.textMuted,
//                   boxShadow:  mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
//                 }}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Card(s) ── */}
//         <div className={`grid gap-6 ${mode === "Online" || mode === "Offline" ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>

//           {showOnline && (
//             <PlanCard
//               title="Online"
//               icon="🌐"
//               price={onlinePrice}
//               originalPrice={Math.round(onlinePrice * 1.67)}
//               urgency="Registrations close soon"
//               features={ONLINE_FEATURES}
//               recommended={true}
//               onBuy={() => handleBuy("Online", onlinePrice)}
//             />
//           )}

//           {showOffline && (
//             <PlanCard
//               title="Offline"
//               icon="🏫"
//               price={offlinePrice}
//               originalPrice={Math.round(offlinePrice * 1.5)}
//               urgency={null}
//               features={OFFLINE_FEATURES}
//               recommended={false}
//               onBuy={() => handleBuy("Offline", offlinePrice)}
//             />
//           )}
//         </div>

//         {/* ── Both prices comparison strip (always visible) ── */}
//         <div className="mt-10 bg-white rounded-2xl px-6 py-5 border"
//           style={{ borderColor: THEME.border }}>
//           <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center"
//             style={{ color: THEME.textFaint }}>
//             Price comparison
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             {[
//               { label: "Online", price: onlinePrice,  m: "Online",  icon: "🌐" },
//               { label: "Offline", price: offlinePrice, m: "Offline", icon: "🏫" },
//             ].map(item => (
//               <button
//                 key={item.label}
//                 onClick={() => setMode(item.m)}
//                 className="flex-1 flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200"
//                 style={{
//                   background: mode === item.m ? THEME.primaryLight : "#fafafa",
//                   border:     `1.5px solid ${mode === item.m ? THEME.primary : THEME.border}`,
//                 }}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>{item.icon}</span>
//                   <span className="text-sm font-semibold" style={{ color: THEME.text }}>{item.label}</span>
//                 </div>
//                 <span className="text-lg font-bold" style={{ color: mode === item.m ? THEME.primary : THEME.text }}>
//                   ₹ {item.price.toLocaleString("en-IN")}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Course meta strip ── */}
//         {course && (
//           <div className="mt-4 bg-white rounded-2xl px-6 py-4 flex flex-wrap gap-6 items-center justify-center border"
//             style={{ borderColor: THEME.border }}>
//             {[
//               { label: "Duration", value: course.duration ? `${course.duration} months` : "—" },
//               { label: "Language", value: course.language  || "—" },
//               { label: "Mode",     value: course.mode      || "—" },
//               { label: "Category", value: course.category?.categoryName || "—" },
//               { label: "Type",     value: course.type      || "—" },
//             ].map(item => (
//               <div key={item.label} className="text-center">
//                 <p className="text-xs mb-0.5" style={{ color: THEME.textFaint }}>{item.label}</p>
//                 <p className="text-sm font-semibold" style={{ color: THEME.text }}>{item.value}</p>
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }