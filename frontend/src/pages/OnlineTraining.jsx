import { useState, useRef, useCallback } from "react";
import OnlineTrainingSection from "../components/OnlineTrainingSection";

export default function OnlineClassesTimetable() {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const colorMap = {
    success: "border-emerald-400 text-emerald-700 bg-emerald-50",
    error:   "border-red-400 text-red-700 bg-red-50",
    info:    "border-purple-400 text-purple-700 bg-purple-50",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <OnlineTrainingSection showTitle={true} onToast={showToast} />
      </div>

      {toast && (
        <div className={`fixed bottom-7 right-7 z-50 max-w-sm border rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-semibold shadow-2xl transition-all duration-300 ${colorMap[toast.type] || colorMap.info}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
