import { useState } from "react";

const NAV_TABS = [
  "Online Training",
  "Classroom Training",
  "Workshops",
  "Internships",
  "Weekend Training",
  "Other Classes",
];

const generateData = (tab) => {
  const datasets = {
    "Online Training": [
      { sno: 1, course: "Full Stack .Net Core 10 with AI", faculty: "Mr. Bangar Raju", date: "25 May 2026", time: "9:15 AM (IST)" },
      { sno: 2, course: "Playwright Automation", faculty: "Mr. Sumanth", date: "28 May 2026", time: "7:30 AM (IST)" },
      { sno: 3, course: "MS Azure + Azure DevOps", faculty: "Mr. Sandeep", date: "28 May 2026", time: "8:00 AM (IST)" },
      { sno: 4, course: "Unix / Linux", faculty: "Mr. Imran", date: "25 May 2026", time: "4:30 PM (IST)" },
      { sno: 5, course: "Power BI", faculty: "Miss. Mohana", date: "25 May 2026", time: "9:00 AM (IST)" },
      { sno: 6, course: "Full Stack Python", faculty: "Mr. Shareef", date: "25 May 2026", time: "6:00 PM (IST)" },
      { sno: 7, course: "Python Programming", faculty: "Mr. Shareef", date: "25 May 2026", time: "6:00 PM (IST)" },
      { sno: 8, course: "Full Stack Java", faculty: "Mr. Hari Krishna", date: "25 May 2026", time: "6:00 PM (IST)" },
      { sno: 9, course: "Core Java", faculty: "Mr. Hari Krishna", date: "25 May 2026", time: "6:00 PM (IST)" },
      { sno: 10, course: "C#.NET", faculty: "Mr. Bangar Raju", date: "25 May 2026", time: "9:15 AM (IST)" },
      { sno: 11, course: "Full Stack Data Science & AI", faculty: "Mr. Omkar", date: "25 May 2026", time: "11:00 AM (IST)" },
      { sno: 12, course: "Full Stack Python with Gen AI", faculty: "Mr. Satish Gupta", date: "25 May 2026", time: "11:00 AM (IST)" },
      { sno: 13, course: "Python with Gen AI", faculty: "Mr. Satish Gupta", date: "25 May 2026", time: "11:00 AM (IST)" },
    ],
    "Classroom Training": [
      { sno: 1, course: "Java Full Stack", faculty: "Mr. Ramesh", date: "26 May 2026", time: "10:00 AM (IST)" },
      { sno: 2, course: "React JS", faculty: "Mr. Kiran", date: "26 May 2026", time: "11:00 AM (IST)" },
      { sno: 3, course: "Node.js & Express", faculty: "Ms. Priya", date: "27 May 2026", time: "9:00 AM (IST)" },
      { sno: 4, course: "Data Structures & Algorithms", faculty: "Mr. Suresh", date: "27 May 2026", time: "2:00 PM (IST)" },
      { sno: 5, course: "Database Management (SQL)", faculty: "Ms. Ananya", date: "28 May 2026", time: "10:30 AM (IST)" },
    ],
    "Workshops": [
      { sno: 1, course: "Docker & Kubernetes Workshop", faculty: "Mr. Vikram", date: "29 May 2026", time: "9:00 AM (IST)" },
      { sno: 2, course: "Machine Learning Bootcamp", faculty: "Dr. Neha", date: "30 May 2026", time: "10:00 AM (IST)" },
      { sno: 3, course: "DevOps Essentials", faculty: "Mr. Arjun", date: "31 May 2026", time: "11:00 AM (IST)" },
      { sno: 4, course: "Flutter App Development", faculty: "Ms. Ritu", date: "01 Jun 2026", time: "9:30 AM (IST)" },
    ],
    "Internships": [
      { sno: 1, course: "Web Development Internship", faculty: "Mr. Rahul", date: "01 Jun 2026", time: "10:00 AM (IST)" },
      { sno: 2, course: "Data Science Internship", faculty: "Ms. Kavya", date: "01 Jun 2026", time: "11:00 AM (IST)" },
      { sno: 3, course: "Cloud Computing Internship", faculty: "Mr. Sanjay", date: "02 Jun 2026", time: "9:00 AM (IST)" },
    ],
    "Weekend Training": [
      { sno: 1, course: "Selenium with Java (Weekend)", faculty: "Mr. Manoj", date: "31 May 2026", time: "8:00 AM (IST)" },
      { sno: 2, course: "Angular JS (Weekend)", faculty: "Ms. Divya", date: "31 May 2026", time: "10:00 AM (IST)" },
      { sno: 3, course: "AWS Solutions Architect (Weekend)", faculty: "Mr. Ajay", date: "01 Jun 2026", time: "9:00 AM (IST)" },
      { sno: 4, course: "Cyber Security (Weekend)", faculty: "Mr. Deepak", date: "01 Jun 2026", time: "11:00 AM (IST)" },
    ],
    "Other Classes": [
      { sno: 1, course: "Soft Skills & Communication", faculty: "Ms. Preethi", date: "26 May 2026", time: "3:00 PM (IST)" },
      { sno: 2, course: "Interview Preparation", faculty: "Mr. Naveen", date: "27 May 2026", time: "4:00 PM (IST)" },
      { sno: 3, course: "Resume Building Workshop", faculty: "Ms. Lakshmi", date: "28 May 2026", time: "2:00 PM (IST)" },
    ],
  };
  return datasets[tab] || [];
};

const tabIcons = {
  "Online Training": "🖥️",
  "Classroom Training": "🏫",
  "Workshops": "🔧",
  "Internships": "💼",
  "Weekend Training": "📅",
  "Other Classes": "📚",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Online Training");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  const data = generateData(activeTab);
  const filtered = data.filter(
    (r) =>
      r.course.toLowerCase().includes(search.toLowerCase()) ||
      r.faculty.toLowerCase().includes(search.toLowerCase())
  );
  const shown = filtered.slice(0, entries);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="px-6 pt-8 pb-4"
        style={{
          background: "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)",
          borderBottom: "1px solid rgba(139,92,246,0.25)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
               Online Classes Timetable
              </h1>
              <p className="text-sm" style={{ color: "#a5b4fc" }}>
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
          background: "rgba(15,12,41,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-1 py-2" style={{ minWidth: "max-content" }}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); setEntries(10); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={
                  activeTab === tab
                    ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#ffffff",
                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                      }
                    : {
                        color: "#a5b4fc",
                        background: "transparent",
                      }
                }
              >
                <span>{tabIcons[tab]}</span>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "#a5b4fc" }}>
              Show entries:
            </span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg text-sm font-medium outline-none cursor-pointer"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(139,92,246,0.35)",
                color: "#e0e7ff",
              }}
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n} style={{ background: "#1e1b4b" }}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "#818cf8" }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search course or faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-64"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#e0e7ff",
              }}
            />
          </div>
        </div>

        {/* Table Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(90deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
                    borderBottom: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  {["S.No", "Course Name", "Faculty", "Date", "Time", "Meeting Link"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-semibold tracking-wide uppercase text-xs"
                        style={{ color: "#c4b5fd" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                      style={{ color: "#6366f1" }}
                    >
                      No results found
                    </td>
                  </tr>
                ) : (
                  shown.map((row, i) => (
                    <tr
                      key={row.sno}
                      className="transition-all duration-150 group"
                      style={{
                        background:
                          i % 2 === 0
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(99,102,241,0.04)",
                        borderBottom: "1px solid rgba(139,92,246,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(99,102,241,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          i % 2 === 0
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(99,102,241,0.04)";
                      }}
                    >
                      <td className="px-5 py-4">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: "rgba(99,102,241,0.25)",
                            color: "#a5b4fc",
                            display: "inline-flex",
                          }}
                        >
                          {row.sno}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium" style={{ color: "#e0e7ff" }}>
                        {row.course}
                      </td>
                      <td className="px-5 py-4" style={{ color: "#a5b4fc" }}>
                        {row.faculty}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "rgba(16,185,129,0.15)",
                            color: "#6ee7b7",
                            border: "1px solid rgba(16,185,129,0.25)",
                          }}
                        >
                          {row.date}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "rgba(245,158,11,0.15)",
                            color: "#fcd34d",
                            border: "1px solid rgba(245,158,11,0.25)",
                          }}
                        >
                          {row.time}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                          style={{
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "#fff",
                            boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 4px 18px rgba(99,102,241,0.55)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 2px 10px rgba(99,102,241,0.3)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <span>▶</span> Join Meeting
                        </button>
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
              borderTop: "1px solid rgba(139,92,246,0.15)",
              background: "rgba(99,102,241,0.05)",
            }}
          >
            <span className="text-xs" style={{ color: "#6366f1" }}>
              Showing {shown.length} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: "#6366f1" }}>
                {tabIcons[activeTab]} {activeTab}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
