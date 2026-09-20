import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  FiMonitor, FiHome, FiTool, FiBriefcase, FiCalendar,
  FiBookOpen, FiSearch, FiPlay, FiLoader, FiInbox, FiCheckCircle, FiPhone, FiX
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

const API = import.meta.env.VITE_API_URL;

const NAV_TABS = [
  "Online Training",
  "Classroom Training",
  "Workshops",
  "Internships",
  "Weekend Training",
  "Other Classes",
];

const tabIcons = {
  "Online Training": FiMonitor,
  "Classroom Training": FiHome,
  "Workshops": FiTool,
  "Internships": FiBriefcase,
  "Weekend Training": FiCalendar,
  "Other Classes": FiBookOpen,
};

export default function OnlineTrainingSection({ showTitle = true, initialTab = "Online Training", onToast }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registered class IDs Map: { [timetableId]: true }
  const [registeredMap, setRegisteredMap] = useState({});
  const [registeringId, setRegisteringId] = useState(null);

  // Phone number modal state
  const [phoneModal, setPhoneModal] = useState(null); // { timetableRow }
  const [inputPhone, setInputPhone] = useState(user?.contactNo || "");
  const [phoneError, setPhoneError] = useState("");

  const notify = useCallback((msg, type = "info") => {
    if (onToast) onToast(msg, type);
  }, [onToast]);

  // Load user registrations
  const loadRegistrations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/trainingRegistration/myRegistrations`, { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const map = {};
        data.data.forEach((r) => {
          if (r.timetableId) {
            const id = typeof r.timetableId === "object" ? r.timetableId._id : r.timetableId;
            map[id] = true;
          }
        });
        setRegisteredMap(map);
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Load timetable
  const loadTimetable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/timeTable/allTimetable?category=${encodeURIComponent(activeTab)}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTimetable(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load timetable.");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadTimetable();
    loadRegistrations();
  }, [loadTimetable, loadRegistrations]);

  const handleRegisterClick = (row) => {
    if (!user) {
      notify("Please sign in to register for online training.", "error");
      return;
    }

    const currentPhone = user.contactNo || inputPhone;
    if (!currentPhone || currentPhone.trim().length < 10) {
      setPhoneModal({ row });
      setInputPhone(user.contactNo || "");
      setPhoneError("");
      return;
    }

    performRegistration(row, currentPhone);
  };

  const performRegistration = async (row, phone) => {
    setRegisteringId(row._id);
    try {
      const res = await fetch(`${API}/trainingRegistration/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          timetableId: row._id,
          phoneNumber: phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRegisteredMap((prev) => ({ ...prev, [row._id]: true }));
        setPhoneModal(null);
        notify(
          data.msg || "Registered! Confirmation sent on WhatsApp.",
          data.whatsAppSent === false ? "error" : "success"
        );
      } else {
        notify(data.msg || "Failed to register for session.", "error");
      }
    } catch {
      notify("Error connecting to server. Please try again.", "error");
    } finally {
      setRegisteringId(null);
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const clean = inputPhone.replace(/\D/g, "");
    if (clean.length < 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (phoneModal?.row) {
      performRegistration(phoneModal.row, inputPhone);
    }
  };

  const filtered = timetable.filter(
    (r) =>
      r.course?.toLowerCase().includes(search.toLowerCase()) ||
      r.faculty?.toLowerCase().includes(search.toLowerCase())
  );
  const shown = filtered.slice(0, entries);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      {showTitle && (
        <div className="bg-gradient-to-r from-purple-900 via-[#8E1387] to-indigo-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
                <MdSchool />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Online Classes &amp; Training Timetable
                </h2>
                <p className="text-xs sm:text-sm text-purple-200">
                  Register for upcoming live sessions &amp; get automated WhatsApp reminders
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-sm self-start sm:self-auto">
              <FaWhatsapp className="text-emerald-400 text-sm" />
              <span>WhatsApp Alerts (Instant + 30m Prior)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {NAV_TABS.map((tab) => {
          const Icon = tabIcons[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSearch("");
                setEntries(10);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#8E1387] to-[#B11FA8] text-white shadow-md shadow-purple-500/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700"
              }`}
            >
              <Icon className="text-sm" />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Controls & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Show entries:</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 outline-none cursor-pointer hover:border-purple-300"
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:flex-initial sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={15} />
            <input
              type="text"
              placeholder="Search course or faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#8E1387] to-[#B11FA8] text-white">
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] rounded-tl-2xl">S.No</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px]">Course Name</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px]">Faculty</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px]">Date</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px]">Time</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-right rounded-tr-2xl">Action / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold">
                      <FiLoader className="animate-spin text-base" /> Loading scheduled classes…
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FiInbox size={28} className="text-slate-300" />
                      <span className="font-semibold text-slate-600">No classes found in this category</span>
                    </div>
                  </td>
                </tr>
              ) : (
                shown.map((row, i) => {
                  const isRegistered = !!registeredMap[row._id];
                  const isRegistering = registeringId === row._id;

                  return (
                    <tr key={row._id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[11px]">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">{row.course}</td>
                      <td className="px-4 py-3.5 text-slate-600">{row.faculty}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.date}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          {row.time}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isRegistered ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <FiCheckCircle className="text-emerald-600" /> Registered
                            </span>
                            {row.meetingLink && (
                              <a
                                href={row.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all cursor-pointer"
                              >
                                <FiPlay size={11} /> Join Meeting
                              </a>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isRegistering}
                            onClick={() => handleRegisterClick(row)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8E1387] to-[#B11FA8] hover:from-[#720e6c] hover:to-[#961a8f] shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 cursor-pointer"
                          >
                            {isRegistering ? (
                              <>
                                <FiLoader className="animate-spin" size={12} /> Registering…
                              </>
                            ) : (
                              <>
                                <FaWhatsapp className="text-emerald-300" /> Register Now
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <span>Showing {shown.length} of {filtered.length} entries</span>
          <div className="flex items-center gap-1.5 text-purple-700 font-semibold">
            <FaWhatsapp className="text-emerald-600" /> WhatsApp schedule details + 30-min live reminder sent automatically upon registration
          </div>
        </div>
      </div>

      {/* Phone Number Modal (if profile lacks contact number) */}
      {phoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setPhoneModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                <FaWhatsapp />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">WhatsApp Notification Number</h3>
                <p className="text-xs text-slate-500">Where should we send your meeting schedule &amp; reminders?</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 mb-4 text-xs text-purple-800">
              <span className="font-bold">Course:</span> {phoneModal.row?.course} ({phoneModal.row?.date} at {phoneModal.row?.time})
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Mobile Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={inputPhone}
                    onChange={(e) => {
                      setInputPhone(e.target.value);
                      setPhoneError("");
                    }}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-slate-50 font-medium"
                  />
                </div>
                {phoneError && <p className="text-xs text-red-500 mt-1 font-semibold">{phoneError}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPhoneModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registeringId === phoneModal.row?._id}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {registeringId === phoneModal.row?._id ? (
                    <><FiLoader className="animate-spin" /> Registering…</>
                  ) : (
                    <><FaWhatsapp /> Confirm &amp; Register</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
