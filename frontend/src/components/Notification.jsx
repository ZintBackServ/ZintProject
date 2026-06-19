import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const POPUP_DELAY_MS  = 3000;  // show after 3 seconds
const STORAGE_KEY     = "lastNotifSeen"; // so we don't spam the user

export default function NotificationPopup() {
  const [queue, setQueue]     = useState([]); // all active notifications
  const [index, setIndex]     = useState(0);  // which one is showing
  const [visible, setVisible] = useState(false);
  const navigate              = useNavigate();

  useEffect(() => {
    const fetchAndShow = async () => {
      try {
        const res  = await fetch(`${API}/notification/`);
        const data = await res.json();
        if (!data.success || data.data.length === 0) return;

        // Only show if user hasn't seen the latest batch today
        const lastSeen = localStorage.getItem(STORAGE_KEY);
        const today    = new Date().toDateString();
        if (lastSeen === today) return;

        setQueue(data.data);
        setIndex(0);

        // Show after delay
        setTimeout(() => setVisible(true), POPUP_DELAY_MS);
      } catch (err) {
        console.error("Notification fetch failed:", err);
      }
    };

    fetchAndShow();
  }, []);

  const current = queue[index];

  const handleClose = () => {
    // Mark as seen for today so it won't re-show on refresh
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setVisible(false);
  };

  const handleNext = () => {
    if (index < queue.length - 1) {
      setIndex((i) => i + 1);
    } else {
      handleClose();
    }
  };

  const handleClick = () => {
    if (!current) return;
    if (current.type === "course" && current.refId) {
      handleClose();
      navigate(`/courses/${current.refId}`);
    } else if (current.type === "event" && current.refId) {
      handleClose();
      navigate(`/events/${current.refId}`);
    }
    // announcement — no navigation, just stays open
  };

  if (!visible || !current) return null;

  const isClickable = (current.type === "course" || current.type === "event") && current.refId;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Popup card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-fade-in">

          {/* Image */}
          {current.image && (
            <div className="w-full h-100 overflow-hidden bg-gray-100">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-full"
              />
            </div>
          )}

          {/* Body */}
          <div className="p-5">
            {/* Type badge */}
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3
                ${current.type === "course"       ? "bg-blue-100 text-blue-700"
                : current.type === "event"        ? "bg-purple-100 text-purple-700"
                :                                   "bg-yellow-100 text-yellow-700"}`}
            >
              {current.type === "course"
                ? "📚 New Course"
                : current.type === "event"
                ? "📅 Upcoming Event"
                : "📢 Announcement"}
            </span>

            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {current.title}
            </h2>

            {current.message && (
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                {current.message}
              </p>
            )}

            {/* Dots — if multiple notifications */}
            {queue.length > 1 && (
              <div className="flex gap-1.5 mt-4">
                {queue.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all
                      ${i === index ? "w-5 bg-indigo-600" : "w-1.5 bg-gray-300"}`}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              {isClickable && (
                <button
                  onClick={handleClick}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {current.type === "course" ? "View Course →" : "See Event →"}
                </button>
              )}
              <button
                onClick={handleNext}
                className={`text-sm font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors
                  ${isClickable ? "px-4" : "flex-1"}`}
              >
                {index < queue.length - 1 ? "Next" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}