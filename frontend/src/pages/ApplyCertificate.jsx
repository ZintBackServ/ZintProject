// ApplyCertificate.jsx — Coming Soon page
import { useNavigate } from "react-router-dom";

export default function ApplyCertificate() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-5">🎓</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Apply for Certificate</h1>
        <p className="text-sm text-slate-500 mb-6">
          This feature is coming soon. You will be able to apply for your course completion certificate here.
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
