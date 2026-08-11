import { useState, useMemo } from "react";

/* ── Metric Configuration ── */
const METRICS = [
  { id: "enrollments",   label: "Course Enrollments",     short: "Enrollments", icon: "🎓", color: "#4F46E5", bg: "bg-indigo-50",  border: "border-indigo-200", text: "text-indigo-700" },
  { id: "users",         label: "Student Signups",        short: "Signups",     icon: "👥", color: "#0284C7", bg: "bg-sky-50",     border: "border-sky-200",    text: "text-sky-700" },
  { id: "eventReg",      label: "Event Registrations",    short: "Event Reg",   icon: "📅", color: "#E11D48", bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-700" },
  { id: "internshipReg", label: "Internship Applications",short: "Internships", icon: "💼", color: "#B026B5", bg: "bg-purple-50",  border: "border-purple-200", text: "text-purple-700" },
  { id: "placementReg",  label: "Placement Applications", short: "Placements",  icon: "📝", color: "#D97706", bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700" },
  { id: "enquiries",      label: "Enquiries & Questions",  short: "Enquiries",   icon: "💬", color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700" },
];

const TIME_RANGES = [
  { id: "today", label: "Today" },
  { id: "week",  label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year",  label: "This Year" },
  { id: "all",   label: "All Time" },
];

/* ── Date range filter logic ── */
function filterByRange(items, range) {
  if (!Array.isArray(items)) return [];
  if (range === "all") return items;

  const now = new Date();
  const startTime = new Date();

  if (range === "today") {
    startTime.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    startTime.setDate(now.getDate() - 7);
  } else if (range === "month") {
    startTime.setDate(now.getDate() - 30);
  } else if (range === "year") {
    startTime.setFullYear(now.getFullYear() - 1);
  }

  return items.filter((item) => {
    const rawDate = item.createdAt || item.date || item.created_at;
    if (!rawDate) return true; // Keep if no date available
    const d = new Date(rawDate);
    return d >= startTime;
  });
}

/* ── Build timeline buckets ── */
function buildBuckets(dataMap, timeRange) {
  const now = new Date();
  let buckets = [];

  if (timeRange === "today") {
    // 6 4-hour slots
    for (let h = 0; h < 24; h += 4) {
      const label = `${String(h).padStart(2, "0")}:00`;
      const start = new Date(now); start.setHours(h, 0, 0, 0);
      const end   = new Date(now); end.setHours(h + 3, 59, 59, 999);
      buckets.push({ label, start, end });
    }
  } else if (timeRange === "week") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end   = new Date(d); end.setHours(23, 59, 59, 999);
      buckets.push({ label, start, end });
    }
  } else if (timeRange === "month") {
    // 4 Weeks
    for (let i = 3; i >= 0; i--) {
      const label = `Wk ${4 - i}`;
      const end = new Date(now); end.setDate(now.getDate() - i * 7);
      const start = new Date(end); start.setDate(end.getDate() - 7);
      buckets.push({ label, start, end });
    }
  } else if (timeRange === "year") {
    // 12 Months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      buckets.push({ label, start, end });
    }
  } else {
    // All Time (Last 6 Months)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      buckets.push({ label, start, end });
    }
  }

  return buckets.map((bucket) => {
    const counts = {};
    METRICS.forEach((m) => {
      const list = dataMap[m.id] || [];
      counts[m.id] = list.filter((item) => {
        const rawDate = item.createdAt || item.date || item.created_at;
        if (!rawDate) return false;
        const dt = new Date(rawDate);
        return dt >= bucket.start && dt <= bucket.end;
      }).length;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { label: bucket.label, counts, total };
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   BAR / TIMELINE CHART COMPONENT (Ultra-responsive & clear)
   ══════════════════════════════════════════════════════════════════════════ */
function TimelineChart({ buckets, selectedMetric }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = useMemo(() => {
    let max = 0;
    buckets.forEach((b) => {
      const val = selectedMetric === "all" ? b.total : b.counts[selectedMetric] || 0;
      if (val > max) max = val;
    });
    return max === 0 ? 5 : Math.ceil(max * 1.3);
  }, [buckets, selectedMetric]);

  const activeColor =
    selectedMetric === "all"
      ? "#4F46E5"
      : METRICS.find((m) => m.id === selectedMetric)?.color || "#4F46E5";

  return (
    <div className="w-full flex flex-col justify-between h-full pt-4">
      {/* Visual Bar Area */}
      <div className="w-full h-44 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b border-gray-200 relative pb-1">
        {/* Background Grid Lines */}
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-gray-400 border-dashed" />
          <div className="border-b border-gray-400 border-dashed" />
          <div className="border-b border-gray-400 border-dashed" />
        </div>

        {buckets.map((b, idx) => {
          const value = selectedMetric === "all" ? b.total : b.counts[selectedMetric] || 0;
          const heightPct = maxVal > 0 ? Math.min(100, Math.max(8, (value / maxVal) * 100)) : 8;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer z-10"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Exact Number Label Above Bar */}
              <span
                className={`text-[10px] sm:text-xs font-bold mb-1.5 transition-transform ${
                  value > 0 ? "text-gray-900" : "text-gray-300"
                } ${isHovered ? "scale-125 text-indigo-600 font-extrabold" : ""}`}
              >
                {value}
              </span>

              {/* Bar element */}
              <div className="w-full max-w-[36px] bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                  style={{
                    height: `${heightPct}%`,
                    background: activeColor,
                    boxShadow: isHovered ? `0 4px 12px ${activeColor}44` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-1 sm:px-2 pt-2 text-[10px] sm:text-xs font-bold text-gray-500">
        {buckets.map((b, idx) => (
          <span
            key={idx}
            className={`flex-1 text-center truncate ${hoveredIdx === idx ? "text-indigo-600 font-extrabold" : ""}`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CLEAR BREAKDOWN CARDS COMPONENT (Replaces confusing pie chart)
   ══════════════════════════════════════════════════════════════════════════ */
function ActivityBreakdownCards({ metricsData, total }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {metricsData.map((m) => {
        const percentage = total > 0 ? Math.round((m.value / total) * 100) : 0;

        return (
          <div
            key={m.id}
            className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 transition flex flex-col gap-2"
          >
            {/* Header row: Icon, Label, Count, Percentage */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-lg flex-shrink-0">{m.icon}</span>
                <span className="font-bold text-gray-800 truncate">{m.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-black text-sm sm:text-base text-gray-900">{m.value}</span>
                <span
                  className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full text-white"
                  style={{ background: m.color }}
                >
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${percentage}%`, background: m.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD ANALYTICS CONTAINER
   ══════════════════════════════════════════════════════════════════════════ */
export default function DashboardAnalytics({
  users = [],
  enrollments = [],
  eventReg = [],
  placementReg = [],
  internshipReg = [],
  enquiries = [],
  loading = false,
}) {
  const [timeRange, setTimeRange] = useState("month");
  const [activeMetric, setActiveMetric] = useState("all");

  /* Filter raw real data by time range */
  const filteredData = useMemo(() => {
    return {
      users:         filterByRange(users, timeRange),
      enrollments:   filterByRange(enrollments, timeRange),
      eventReg:      filterByRange(eventReg, timeRange),
      placementReg:  filterByRange(placementReg, timeRange),
      internshipReg: filterByRange(internshipReg, timeRange),
      enquiries:     filterByRange(enquiries, timeRange),
    };
  }, [users, enrollments, eventReg, placementReg, internshipReg, enquiries, timeRange]);

  /* Total aggregate count for each metric */
  const totalCounts = useMemo(() => {
    return {
      users:         filteredData.users.length,
      enrollments:   filteredData.enrollments.length,
      eventReg:      filteredData.eventReg.length,
      placementReg:  filteredData.placementReg.length,
      internshipReg: filteredData.internshipReg.length,
      enquiries:     filteredData.enquiries.length,
    };
  }, [filteredData]);

  const grandTotal = useMemo(() => {
    return Object.values(totalCounts).reduce((a, b) => a + b, 0);
  }, [totalCounts]);

  /* Build buckets for timeline chart */
  const timelineBuckets = useMemo(() => {
    return buildBuckets(filteredData, timeRange);
  }, [filteredData, timeRange]);

  /* Metrics breakdown dataset */
  const breakdownData = useMemo(() => {
    return METRICS.map((m) => ({
      ...m,
      value: totalCounts[m.id] || 0,
    }));
  }, [totalCounts]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8 space-y-6">

      {/* ──────── TOP CONTROLS & TIMEFRAME FILTER ──────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-1.5">
            📈 Real-Time Analytics
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Student & Institute Activity
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Total of <span className="font-extrabold text-indigo-600">{grandTotal}</span> real activities in this timeframe
          </p>
        </div>

        {/* Time Filter Buttons (Responsive scrollable container) */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
          {TIME_RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                timeRange === r.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──────── 6 CLICKABLE METRIC CARDS ──────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {METRICS.map((m) => {
          const count = totalCounts[m.id] || 0;
          const isSelected = activeMetric === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setActiveMetric(isSelected ? "all" : m.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/90 shadow-md ring-2 ring-indigo-500/20"
                  : "border-gray-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl sm:text-2xl">{m.icon}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-gray-900">
                  {loading ? (
                    <span className="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block" />
                  ) : (
                    count
                  )}
                </p>
                <p className="text-xs font-bold text-gray-600 truncate mt-0.5">
                  {m.short}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ──────── MAIN CHARTS & BREAKDOWN SECTION ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

        {/* Left (7 Cols): Clear Bar Timeline Chart */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-3xl border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Activity Timeline Trend
              </h3>
              <p className="text-xs text-gray-500">
                {activeMetric === "all"
                  ? "Showing all 6 activities combined"
                  : `Showing ${METRICS.find((m) => m.id === activeMetric)?.label}`}
              </p>
            </div>
            {activeMetric !== "all" && (
              <button
                onClick={() => setActiveMetric("all")}
                className="text-xs font-extrabold text-indigo-600 hover:underline bg-indigo-50 px-2.5 py-1 rounded-lg"
              >
                Reset Filter ✕
              </button>
            )}
          </div>

          <TimelineChart buckets={timelineBuckets} selectedMetric={activeMetric} />
        </div>

        {/* Right (5 Cols): Clear Breakdown Cards with Progress Bars */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-3xl border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-base font-extrabold text-gray-900">
              Activity Breakdown & Share
            </h3>
            <p className="text-xs text-gray-500">
              Clear count & percentage share of real registrations
            </p>
          </div>

          <ActivityBreakdownCards metricsData={breakdownData} total={grandTotal} />
        </div>

      </div>
    </div>
  );
}
