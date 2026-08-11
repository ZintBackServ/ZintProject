// Workshop.jsx — Coming Soon page
import { useNavigate } from "react-router-dom";

export default function Workshop() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-5">🛠️</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Workshops</h1>
        <p className="text-sm text-slate-500 mb-6">
          Hands-on workshops are coming soon. Join intensive, practical sessions on programming, AI tools, cloud computing, digital marketing, and more — led by industry professionals at Zint Institute.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#B026B5,#8E1387)" }}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
