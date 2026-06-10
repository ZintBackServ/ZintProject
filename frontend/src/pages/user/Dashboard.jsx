import { useState } from "react";

const student = {
  name: "Arjun Sharma",
  avatar: "AS",
  email: "arjun.sharma@email.com",
  studentId: "STU-2024-0847",
  phone: "+91 98765 43210",
  enrolledCourse: "Full Stack Web Development",
  category: "Technology",
  enrollDate: "Jan 15, 2025",
  startDate: "Feb 1, 2025",
  endDate: "Aug 1, 2025",
  progress: 78,
  completedModules: 14,
  totalModules: 18,
  rank: 3,
  totalStudents: 240,
  points: 4820,
  streak: 12,
};

const notifications = [
  { id: 1, type: "info", text: "New study material uploaded: React Hooks Advanced", time: "2h ago", read: false },
  { id: 2, type: "success", text: "You passed Module 14: Node.js Basics with 92%", time: "1d ago", read: false },
  { id: 3, type: "warn", text: "Assignment due: REST API Project — 3 days left", time: "2d ago", read: true },
  { id: 4, type: "info", text: "Live class scheduled: System Design — Jun 7, 6PM", time: "3d ago", read: true },
];

const tests = [
  { id: 1, name: "HTML & CSS Fundamentals", score: 96, date: "Feb 12, 2025", status: "passed" },
  { id: 2, name: "JavaScript Core Concepts", score: 88, date: "Mar 3, 2025", status: "passed" },
  { id: 3, name: "React Essentials", score: 74, date: "Apr 10, 2025", status: "passed" },
  { id: 4, name: "Node.js & Express", score: 92, date: "May 20, 2025", status: "passed" },
  { id: 5, name: "MongoDB & Databases", score: null, date: "Jun 15, 2025", status: "upcoming" },
  { id: 6, name: "System Design", score: null, date: "Jul 5, 2025", status: "upcoming" },
];

const leaderboard = [
  { rank: 1, name: "Priya Nair", points: 5640, avatar: "PN", badge: "🥇" },
  { rank: 2, name: "Rahul Mehta", points: 5210, avatar: "RM", badge: "🥈" },
  { rank: 3, name: "Arjun Sharma", points: 4820, avatar: "AS", badge: "🥉", isMe: true },
  { rank: 4, name: "Sneha Joshi", points: 4590, avatar: "SJ", badge: "" },
  { rank: 5, name: "Karan Patel", points: 4310, avatar: "KP", badge: "" },
  { rank: 6, name: "Divya Reddy", points: 4120, avatar: "DR", badge: "" },
];

const materials = [
  { id: 1, title: "React Hooks — Complete Guide", type: "PDF", size: "3.2 MB", module: "Module 12", new: true },
  { id: 2, title: "Node.js Crash Course", type: "Video", size: "1.4 GB", module: "Module 13", new: false },
  { id: 3, title: "MongoDB Schema Design", type: "PDF", size: "1.1 MB", module: "Module 15", new: true },
  { id: 4, title: "System Design Interview Prep", type: "Slides", size: "8.7 MB", module: "Module 17", new: false },
  { id: 5, title: "REST API Best Practices", type: "PDF", size: "2.4 MB", module: "Module 14", new: false },
];

const tabs = ["Overview", "Tests", "Leaderboard", "Materials", "Notifications"];

const typeIcon = { PDF: "📄", Video: "🎬", Slides: "📊" };

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [notifs, setNotifs] = useState(notifications);
  const [certApplied, setCertApplied] = useState(false);
  const canApplyCert = student.progress === 100;
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, read: true })));

  const daysLeft = () => {
    const end = new Date("2025-08-01");
    const now = new Date("2025-06-03");
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .glow-amber { box-shadow: 0 0 24px rgba(251,191,36,0.18); }
        .glow-emerald { box-shadow: 0 0 24px rgba(52,211,153,0.18); }
        .tab-active { background: linear-gradient(135deg,#f59e0b22,#f59e0b11); border-color: #f59e0b; color: #fbbf24; }
        .progress-bar-fill { transition: width 1.2s cubic-bezier(.4,0,.2,1); }
        .card { background: linear-gradient(145deg, #1e293b, #172033); border: 1px solid #334155; }
        .badge-gold { background: linear-gradient(135deg,#f59e0b,#d97706); }
        .badge-silver { background: linear-gradient(135deg,#94a3b8,#64748b); }
        .badge-bronze { background: linear-gradient(135deg,#cd7c3e,#a8570c); }
        .shine:hover { background: linear-gradient(145deg, #1e293b, #1d2d42); }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-lg badge-gold flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm syne">E</span>
            </div> */}
            <span className="syne text-lg font-bold text-white">My Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-amber-500 transition-colors"
                onClick={() => setActiveTab("Notifications")}
              >
                <span className="text-base">🔔</span>
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
              )}
            </div>
            {/* <div className="w-9 h-9 rounded-full badge-gold flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">{student.avatar}</span>
            </div> */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Student Info Banner */}
        <div className="card rounded-2xl p-6 mb-6 glow-amber relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl badge-gold flex items-center justify-center flex-shrink-0">
              <span className="text-slate-900 syne font-bold text-xl">{student.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">{student.studentId}</p>
              <h1 className="syne text-2xl font-bold text-white">{student.name}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{student.email} · {student.phone}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-slate-800/80 rounded-xl px-4 py-2 text-center border border-slate-700">
                <p className="text-amber-400 syne font-bold text-lg">{student.streak}</p>
                <p className="text-slate-400 text-xs">Day Streak 🔥</p>
              </div>
              <div className="bg-slate-800/80 rounded-xl px-4 py-2 text-center border border-slate-700">
                <p className="text-emerald-400 syne font-bold text-lg">#{student.rank}</p>
                <p className="text-slate-400 text-xs">Rank</p>
              </div>
              <div className="bg-slate-800/80 rounded-xl px-4 py-2 text-center border border-slate-700">
                <p className="text-sky-400 syne font-bold text-lg">{student.points.toLocaleString()}</p>
                <p className="text-slate-400 text-xs">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "tab-active"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {tab}
              {tab === "Notifications" && unreadCount > 0 && (
                <span className="ml-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="space-y-5">
            {/* Course Card */}
            <div className="card rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-amber-500/20 mb-3">
                    {student.category}
                  </span>
                  <h2 className="syne text-xl font-bold text-white mb-1">{student.enrolledCourse}</h2>
                  <p className="text-slate-400 text-sm">
                    {student.completedModules} of {student.totalModules} modules completed
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-emerald-400 font-semibold text-sm">{daysLeft()} days left</span>
                  <span className="text-slate-500 text-xs">Ends {student.endDate}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Enrolled", date: student.enrollDate, icon: "📋", color: "text-sky-400" },
                  { label: "Started", date: student.startDate, icon: "🚀", color: "text-amber-400" },
                  { label: "Completes", date: student.endDate, icon: "🏁", color: "text-emerald-400" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <p className={`text-xs font-semibold ${item.color} mb-0.5`}>{item.label}</p>
                    <p className="text-slate-300 text-xs font-medium">{item.date}</p>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-300">Course Progress</span>
                  <span className="syne font-bold text-amber-400 text-lg">{student.progress}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="progress-bar-fill h-full rounded-full"
                    style={{
                      width: `${student.progress}%`,
                      background: "linear-gradient(90deg, #f59e0b, #10b981)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-slate-500 text-xs">{student.completedModules} modules done</span>
                  <span className="text-slate-500 text-xs">{student.totalModules - student.completedModules} remaining</span>
                </div>
              </div>

              {/* Certificate Button */}
              <div className={`rounded-xl p-4 border ${canApplyCert ? "border-emerald-500/40 bg-emerald-500/5" : "border-slate-700 bg-slate-800/30"}`}>
                {canApplyCert ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 font-semibold text-sm">🎓 Certificate Ready!</p>
                      <p className="text-slate-400 text-xs mt-0.5">You've completed 100% of the course</p>
                    </div>
                    <button
                      onClick={() => setCertApplied(true)}
                      disabled={certApplied}
                      className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-900 font-bold text-sm px-5 py-2 rounded-xl transition-colors"
                    >
                      {certApplied ? "Applied ✓" : "Apply Now"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 text-lg flex-shrink-0">🔒</div>
                    <div>
                      <p className="text-slate-300 font-medium text-sm">Certificate Locked</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Complete <span className="text-amber-400 font-semibold">{100 - student.progress}% more</span> to unlock your certificate
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-10 h-10 relative">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#334155" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15" fill="none"
                            stroke="#f59e0b" strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 15}`}
                            strokeDashoffset={`${2 * Math.PI * 15 * (1 - student.progress / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-amber-400 font-bold">{student.progress}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Tests Passed", value: "4", icon: "✅", color: "text-emerald-400" },
                { label: "Upcoming Tests", value: "2", icon: "📝", color: "text-sky-400" },
                { label: "Study Materials", value: `${materials.length}`, icon: "📚", color: "text-violet-400" },
                { label: "Global Rank", value: `#${student.rank}`, icon: "🏆", color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="card rounded-xl p-4 shine transition-all">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className={`syne font-bold text-xl ${s.color}`}>{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TESTS ── */}
        {activeTab === "Tests" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="syne text-lg font-bold text-white">Tests & Assessments</h2>
              <span className="text-slate-400 text-sm">{tests.filter((t) => t.status === "passed").length}/{tests.length} completed</span>
            </div>
            {tests.map((test) => (
              <div key={test.id} className={`card rounded-xl p-4 flex items-center gap-4 shine transition-all ${test.status === "upcoming" ? "opacity-70" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${test.status === "passed" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-700/50 border border-slate-600"}`}>
                  {test.status === "passed" ? "✅" : "📝"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{test.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{test.date}</p>
                </div>
                {test.status === "passed" ? (
                  <div className="text-right">
                    <p className={`syne font-bold text-lg ${test.score >= 90 ? "text-emerald-400" : test.score >= 75 ? "text-amber-400" : "text-rose-400"}`}>
                      {test.score}%
                    </p>
                    <p className="text-slate-500 text-xs">Score</p>
                  </div>
                ) : (
                  <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold px-3 py-1 rounded-full">Upcoming</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {activeTab === "Leaderboard" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="syne text-lg font-bold text-white">Leaderboard</h2>
              <span className="text-slate-400 text-sm">{student.totalStudents} students</span>
            </div>
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {leaderboard.slice(0, 3).map((s) => (
                <div key={s.rank} className={`card rounded-2xl p-4 text-center ${s.isMe ? "border-amber-500/40 glow-amber" : ""}`}>
                  <div className="text-2xl mb-2">{s.badge}</div>
                  <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-bold text-sm mb-2 ${
                    s.rank === 1 ? "badge-gold text-slate-900" : s.rank === 2 ? "badge-silver text-slate-900" : "badge-bronze text-white"
                  }`}>{s.avatar}</div>
                  <p className={`font-semibold text-xs truncate ${s.isMe ? "text-amber-400" : "text-white"}`}>{s.isMe ? "You" : s.name.split(" ")[0]}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.points.toLocaleString()} pts</p>
                </div>
              ))}
            </div>
            {leaderboard.slice(3).map((s) => (
              <div key={s.rank} className={`card rounded-xl p-4 flex items-center gap-4 ${s.isMe ? "border-amber-500/40 glow-amber" : ""} shine transition-all`}>
                <span className="text-slate-500 syne font-bold w-6 text-center text-sm">#{s.rank}</span>
                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">{s.avatar}</div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${s.isMe ? "text-amber-400" : "text-white"}`}>{s.isMe ? `${s.name} (You)` : s.name}</p>
                </div>
                <p className="text-slate-300 font-semibold text-sm">{s.points.toLocaleString()} <span className="text-slate-500 font-normal text-xs">pts</span></p>
              </div>
            ))}
          </div>
        )}

        {/* ── MATERIALS ── */}
        {activeTab === "Materials" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="syne text-lg font-bold text-white">Study Materials</h2>
              <span className="text-emerald-400 text-sm font-medium">{materials.filter((m) => m.new).length} new</span>
            </div>
            {materials.map((m) => (
              <div key={m.id} className="card rounded-xl p-4 flex items-center gap-4 shine transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:border-amber-500/40 transition-colors">
                  {typeIcon[m.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm truncate">{m.title}</p>
                    {m.new && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">NEW</span>}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{m.module} · {m.size}</p>
                </div>
                <span className="bg-slate-700/50 border border-slate-600 text-slate-400 text-xs px-3 py-1 rounded-lg group-hover:border-amber-500/40 group-hover:text-amber-400 transition-colors">
                  {m.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "Notifications" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="syne text-lg font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                  Mark all read
                </button>
              )}
            </div>
            {notifs.map((n) => {
              const icons = { info: "ℹ️", success: "✅", warn: "⚠️" };
              const colors = { info: "border-sky-500/20 bg-sky-500/5", success: "border-emerald-500/20 bg-emerald-500/5", warn: "border-amber-500/20 bg-amber-500/5" };
              return (
                <div key={n.id} className={`card rounded-xl p-4 flex items-start gap-4 border ${colors[n.type]} ${n.read ? "opacity-60" : ""} shine transition-all`}>
                  <span className="text-xl mt-0.5 flex-shrink-0">{icons[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug">{n.text}</p>
                    <p className="text-slate-500 text-xs mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
