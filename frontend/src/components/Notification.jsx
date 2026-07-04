import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Base URL of the backend API.
 * Comes from the Vite environment variable VITE_API_URL
 * (set in your .env file, e.g. VITE_API_URL=https://api.example.com).
 */
const API = import.meta.env.VITE_API_URL;

/**
 * Delay (in milliseconds) used in two places:
 *  1. How long to wait after the site loads before showing the FIRST popup.
 *  2. How long to wait AFTER the user closes a popup before showing the NEXT one.
 *
 * Change this single value to speed up / slow down the whole flow.
 * Example: 5000 = 5 seconds, 1000 = 1 second.
 */
const POPUP_DELAY_MS = 5000;

/**
 * NotificationPopup
 * -----------------------------------------------------------------------
 * Fetches a list of notifications from the backend and shows them to the
 * user ONE AT A TIME, as popup cards.
 *
 * Flow:
 *   1. Component mounts -> fetch notifications from the API.
 *   2. Sort them so the OLDEST created notification is shown first.
 *   3. Wait POPUP_DELAY_MS, then show notification #1.
 *   4. Popup stays open until the user clicks "Close" (NO auto-close timer).
 *   5. After the user closes it, wait POPUP_DELAY_MS again, then show the
 *      next notification in the queue.
 *   6. Repeat until every notification has been shown once.
 * -----------------------------------------------------------------------
 */
export default function NotificationPopup() {
  // The full list of notifications returned by the API, sorted oldest-first.
  const [queue, setQueue] = useState([]);

  // Index (position) inside `queue` of the notification we are currently
  // showing (or about to show next).
  const [index, setIndex] = useState(0);

  // Whether the popup card is currently visible on screen.
  const [visible, setVisible] = useState(false);

  // React Router hook used to navigate to a course/event page when the
  // user clicks a notification.
  const navigate = useNavigate();

  /**
   * EFFECT 1 — Fetch notifications on mount.
   * Runs exactly once when the component is first rendered ([] dependency
   * array = "only run on mount").
   */
  useEffect(() => {
    // Flag used to avoid updating state after the component has unmounted
    // (e.g. if the user navigates away while the fetch is still in flight).
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        // Call the backend endpoint that returns active notifications.
        const res = await fetch(`${API}/notification/`);
        const data = await res.json();

        // If the component unmounted while we were waiting for the
        // response, do nothing further.
        if (cancelled) return;

        // Stop here if the request failed or there is nothing to show.
        if (!data.success || !data.data || data.data.length === 0) return;

        // Sort notifications so the OLDEST created one is first in line.
        // Adjust the field name(s) below if your API uses a different
        // property name for the creation timestamp.
        const sorted = [...data.data].sort((a, b) => {
          const aTime = new Date(a.createdAt || a.created_at || a.createdOn || 0).getTime();
          const bTime = new Date(b.createdAt || b.created_at || b.createdOn || 0).getTime();
          return aTime - bTime; // ascending = oldest first
        });

        // Store the sorted list and reset to the first notification.
        setQueue(sorted);
        setIndex(0);

        // Make sure we start hidden — EFFECT 2 below is responsible for
        // actually showing the popup after the delay.
        setVisible(false);
      } catch (err) {
        // Network error, invalid JSON, etc. — log it but don't crash the UI.
        console.error("Notification fetch failed:", err);
      }
    };

    fetchNotifications();

    // Cleanup function: runs if the component unmounts before the fetch
    // finishes, so we don't call setState on an unmounted component.
    return () => {
      cancelled = true;
    };
  }, []); // empty array => run once, on mount only

  /**
   * EFFECT 2 — Show the next popup after a delay.
   *
   * This effect ONLY handles SHOWING a popup. It does NOT auto-close
   * anything — closing only happens when the user clicks the Close
   * button (see `closeNow` below).
   *
   * It re-runs whenever `index` or `queue` changes, which happens:
   *   - once after the notifications are fetched (index = 0)
   *   - again each time the user closes a popup (index moves forward)
   */
  useEffect(() => {
    // Nothing to show (no notifications, or we've already shown all of them).
    if (queue.length === 0 || index >= queue.length) return;

    // Wait POPUP_DELAY_MS, then reveal the current notification.
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);

    // If `index` or `queue` changes again before the timer fires
    // (e.g. fast re-fetch), cancel the pending timer to avoid bugs.
    return () => clearTimeout(showTimer);
  }, [index, queue]);

  // The notification object currently being displayed (or undefined).
  const current = queue[index];

  /**
   * closeNow
   * Called when the user clicks the "Close" button (or clicks the
   * backdrop, or clicks a course/event card to navigate away).
   *
   * It hides the current popup and advances `index` by 1. Advancing the
   * index triggers EFFECT 2 above, which will wait POPUP_DELAY_MS and
   * then show the next notification (if any are left).
   */
  const closeNow = () => {
    setVisible(false);
    setIndex((i) => i + 1);
  };

  /**
   * handleClick
   * Called when the user clicks the main call-to-action button on a
   * "course" or "event" notification. Closes the popup and navigates
   * to the relevant page. "announcement" notifications have no link,
   * so nothing happens here for them — the user must press Close.
   */
  const handleClick = () => {
    if (!current) return;

    if (current.type === "course" && current.refId) {
      closeNow();
      navigate(`/courses/${current.refId}`);
    } else if (current.type === "event" && current.refId) {
      closeNow();
      navigate(`/events/${current.refId}`);
    }
  };

  // Don't render anything if we're not supposed to be visible, or if
  // there's no current notification to show (e.g. queue is empty or
  // we've already shown everything).
  if (!visible || !current) return null;

  // Only "course" and "event" notifications are clickable / navigable.
  const isClickable = (current.type === "course" || current.type === "event") && current.refId;

  return (
    <>
      {/* Semi-transparent backdrop behind the popup. Clicking it closes
          the popup, same as the Close button. */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeNow}
      />

      {/* Centered popup card container */}
      <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-fade-in">

          {/* Optional notification image */}
          {current.image && (
            <div className="w-full h-100 overflow-hidden bg-gray-100">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-full"
              />
            </div>
          )}

          {/* Text content */}
          <div className="p-5">
            {/* Small colored badge showing the notification type */}
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

            {/* Notification title */}
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {current.title}
            </h2>

            {/* Optional notification message/body text */}
            {current.message && (
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                {current.message}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              {/* Only shown for course/event notifications that have a link */}
              {isClickable && (
                <button
                  onClick={handleClick}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {current.type === "course" ? "View Course →" : "See Event →"}
                </button>
              )}

              {/* The ONLY way a popup closes — user must click this */}
              <button
                onClick={closeNow}
                className={`text-sm font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors
                  ${isClickable ? "px-4" : "flex-1"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const API = import.meta.env.VITE_API_URL;

// const POPUP_DELAY_MS  = 3000;  // show after 3 seconds
// const STORAGE_KEY     = "lastNotifSeen"; // so we don't spam the user

// export default function NotificationPopup() {
//   const [queue, setQueue]     = useState([]); // all active notifications
//   const [index, setIndex]     = useState(0);  // which one is showing
//   const [visible, setVisible] = useState(false);
//   const navigate              = useNavigate();

//   useEffect(() => {
//     const fetchAndShow = async () => {
//       try {
//         const res  = await fetch(`${API}/notification/`);
//         const data = await res.json();
//         if (!data.success || data.data.length === 0) return;

//         // Only show if user hasn't seen the latest batch today
//         const lastSeen = localStorage.getItem(STORAGE_KEY);
//         const today    = new Date().toDateString();
//         if (lastSeen === today) return;

//         setQueue(data.data);
//         setIndex(0);

//         // Show after delay
//         setTimeout(() => setVisible(true), POPUP_DELAY_MS);
//       } catch (err) {
//         console.error("Notification fetch failed:", err);
//       }
//     };

//     fetchAndShow();
//   }, []);

//   const current = queue[index];

//   const handleClose = () => {
//     // Mark as seen for today so it won't re-show on refresh
//     localStorage.setItem(STORAGE_KEY, new Date().toDateString());
//     setVisible(false);
//   };

//   const handleNext = () => {
//     if (index < queue.length - 1) {
//       setIndex((i) => i + 1);
//     } else {
//       handleClose();
//     }
//   };

//   const handleClick = () => {
//     if (!current) return;
//     if (current.type === "course" && current.refId) {
//       handleClose();
//       navigate(`/courses/${current.refId}`);
//     } else if (current.type === "event" && current.refId) {
//       handleClose();
//       navigate(`/events/${current.refId}`);
//     }
//     // announcement — no navigation, just stays open
//   };

//   if (!visible || !current) return null;

//   const isClickable = (current.type === "course" || current.type === "event") && current.refId;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
//         onClick={handleClose}
//       />

//       {/* Popup card */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-fade-in">

//           {/* Image */}
//           {current.image && (
//             <div className="w-full h-100 overflow-hidden bg-gray-100">
//               <img
//                 src={current.image}
//                 alt={current.title}
//                 className="w-full h-full object-full"
//               />
//             </div>
//           )}

//           {/* Body */}
//           <div className="p-5">
//             {/* Type badge */}
//             <span
//               className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3
//                 ${current.type === "course"       ? "bg-blue-100 text-blue-700"
//                 : current.type === "event"        ? "bg-purple-100 text-purple-700"
//                 :                                   "bg-yellow-100 text-yellow-700"}`}
//             >
//               {current.type === "course"
//                 ? "📚 New Course"
//                 : current.type === "event"
//                 ? "📅 Upcoming Event"
//                 : "📢 Announcement"}
//             </span>

//             <h2 className="text-lg font-bold text-gray-900 leading-snug">
//               {current.title}
//             </h2>

//             {current.message && (
//               <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
//                 {current.message}
//               </p>
//             )}

//             {/* Dots — if multiple notifications */}
//             {queue.length > 1 && (
//               <div className="flex gap-1.5 mt-4">
//                 {queue.map((_, i) => (
//                   <div
//                     key={i}
//                     className={`h-1.5 rounded-full transition-all
//                       ${i === index ? "w-5 bg-indigo-600" : "w-1.5 bg-gray-300"}`}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex gap-3 mt-5">
//               {isClickable && (
//                 <button
//                   onClick={handleClick}
//                   className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
//                 >
//                   {current.type === "course" ? "View Course →" : "See Event →"}
//                 </button>
//               )}
//               <button
//                 onClick={handleNext}
//                 className={`text-sm font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors
//                   ${isClickable ? "px-4" : "flex-1"}`}
//               >
//                 {index < queue.length - 1 ? "Next" : "Dismiss"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }