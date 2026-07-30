import { useState, useEffect } from "react";
import {
  FiMonitor, FiHome, FiTool, FiBriefcase, FiCalendar,
  FiBookOpen, FiSearch, FiPlay, FiLoader, FiInbox, FiLogIn, FiUserPlus,
} from "react-icons/fi";
import { MdSchool } from "react-icons/md";

const GRAY          = "#6E6E6E";
const WHITE          = "#FFFFFF";
const DarkPurple    = "#8E1387";
const PrimaryPurple = "#B11FA8";
const BLUE          = "#53BFEA";
const GREEN         = "#45B51D";

// GET /timeTable/allTimetable requires a logged-in user (see authMiddleware
// on the route), so every request must carry the bearer token.
const TIMETABLE_URL = `${import.meta.env.VITE_API_URL}/timeTable/allTimetable`;

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

async function safeFetch(url) {
  const res = await fetch(url, {
    credentials: "include",
  });
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

export default function OnlineClassesTimetable() {
  const [activeTab, setActiveTab] = useState("Online Training");
  const [search, setSearch]       = useState("");
  const [entries, setEntries]     = useState(10);
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Re-checked on every render so the UI updates right after sign in/out.

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${TIMETABLE_URL}?category=${encodeURIComponent(activeTab)}`;
        const result = await safeFetch(url);
        setData(result?.data || []);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to load timetable.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [activeTab]);

  const filtered = data.filter(
    (r) =>
      r.course.toLowerCase().includes(search.toLowerCase()) ||
      r.faculty.toLowerCase().includes(search.toLowerCase())
  );
  const shown = filtered.slice(0, entries);

  return (
    <div className="min-h-screen font-sans" style={{ background: WHITE }}>
      {/* Header */}
      <div
        className="px-6 pt-8 pb-4"
        style={{
          background: `linear-gradient(90deg, ${PrimaryPurple}14 0%, ${BLUE}0d 100%)`,
          borderBottom: `1px solid ${PrimaryPurple}30`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white"
              style={{ background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})` }}
            >
              <MdSchool />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
                Online Classes Timetable
              </h1>
              <p className="text-sm" style={{ color: GRAY }}>
                Explore new and trending courses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div
        className="px-6 py-0 sticky top-0 z-20"
        style={{
          background: WHITE,
          borderBottom: `1px solid ${PrimaryPurple}20`,
        }}
      >
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-1 py-2" style={{ minWidth: "max-content" }}>
            {NAV_TABS.map((tab) => {
              const Icon = tabIcons[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearch(""); setEntries(10); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`,
                          color: "#ffffff",
                          boxShadow: `0 4px 15px ${PrimaryPurple}40`,
                        }
                      : {
                          color: GRAY,
                          background: "transparent",
                        }
                  }
                >
                  <Icon size={15} />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: GRAY }}>
              Show entries:
            </span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg text-sm font-medium outline-none cursor-pointer"
              style={{
                background: WHITE,
                border: `1px solid ${PrimaryPurple}40`,
                color: "#1a1a1a",
              }}
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={14}
              style={{ color: BLUE }}
            />
            <input
              type="text"
              placeholder="Search course or faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-64"
              style={{
                background: WHITE,
                border: `1px solid ${PrimaryPurple}30`,
                color: "#1a1a1a",
              }}
            />
          </div>
        </div>

        {/* Table Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: WHITE,
            border: `1px solid ${PrimaryPurple}20`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr
                  style={{
                    background: DarkPurple,
                    borderBottom: `1px solid ${PrimaryPurple}40`,
                  }}
                >
                  {["S.No", "Course Name", "Faculty", "Date", "Time", "Meeting Link"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-semibold tracking-wide uppercase text-xs"
                        style={{ color: "#f3e0f5" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex items-center justify-center gap-2" style={{ color: BLUE }}>
                        <FiLoader className="animate-spin" /> Loading timetable…
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center" style={{ color: "#dc2626" }}>
                      {error}
                    </td>
                  </tr>
                ) : shown.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2" style={{ color: PrimaryPurple }}>
                        <FiInbox size={28} />
                        <span>No results found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  shown.map((row, i) => (
                    <tr
                      key={row._id}
                      className="transition-all duration-150"
                      style={{
                        background: i % 2 === 0 ? WHITE : `${PrimaryPurple}05`,
                        borderBottom: `1px solid ${PrimaryPurple}10`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${PrimaryPurple}0d`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          i % 2 === 0 ? WHITE : `${PrimaryPurple}05`;
                      }}
                    >
                      <td className="px-5 py-4">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${PrimaryPurple}14`,
                            color: PrimaryPurple,
                            display: "inline-flex",
                          }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium" style={{ color: "#1a1a1a" }}>
                        {row.course}
                      </td>
                      <td className="px-5 py-4" style={{ color: GRAY }}>
                        {row.faculty}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${GREEN}14`,
                            color: GREEN,
                            border: `1px solid ${GREEN}30`,
                          }}
                        >
                          {row.date}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${BLUE}14`,
                            color: BLUE,
                            border: `1px solid ${BLUE}30`,
                          }}
                        >
                          {row.time}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isLoggedIn ? (
                          <a
                            href={row.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5"
                            style={{
                              background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`,
                              color: "#fff",
                              boxShadow: `0 2px 10px ${PrimaryPurple}30`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = `0 4px 18px ${PrimaryPurple}55`;
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = `0 2px 10px ${PrimaryPurple}30`;
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            <FiPlay size={11} /> Join Meeting
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <a
                              href="/login"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5"
                              style={{
                                background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`,
                                color: "#fff",
                              }}
                            >
                              <FiLogIn size={11} /> Sign In
                            </a>
                            <a
                              href="/signup"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5"
                              style={{
                                background: WHITE,
                                border: `1px solid ${PrimaryPurple}40`,
                                color: PrimaryPurple,
                              }}
                            >
                              <FiUserPlus size={11} /> Sign Up
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              borderTop: `1px solid ${PrimaryPurple}15`,
              background: `${PrimaryPurple}05`,
            }}
          >
            <span className="text-xs" style={{ color: PrimaryPurple }}>
              Showing {shown.length} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: PrimaryPurple }}>
              {(() => {
                const Icon = tabIcons[activeTab];
                return <Icon size={12} />;
              })()}
              {activeTab}
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <p className="text-xs text-center mt-4" style={{ color: GRAY }}>
            Sign in to join a live class, or create a free account to get started.
          </p>
        )}
      </div>
    </div>
  );
}

