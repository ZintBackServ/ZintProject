// pages/admin/OnlineAdmissions.jsx
// Admin portal view for managing Student Online & Offline Admission Applications

import { useState, useEffect, useCallback, useMemo } from "react";

const API = import.meta.env.VITE_API_URL;
const inr = (n) => "₹ " + Number(n || 0).toLocaleString("en-IN");

// Toast Notification
function Toast({ toast }) {
  if (!toast) return null;
  const colorMap = {
    success: "border-emerald-400 text-emerald-700 bg-emerald-50",
    error:   "border-red-400 text-red-700 bg-red-50",
    info:    "border-purple-400 text-purple-700 bg-purple-50",
  };
  return (
    <div className={`fixed bottom-7 right-7 z-[99999] max-w-xs border rounded-xl px-5 py-3.5 text-sm font-medium shadow-xl transition-all duration-300 ${colorMap[toast.type] || colorMap.info}`}>
      {toast.msg}
    </div>
  );
}

// Full Screen Image Lightbox Modal
function ImageLightboxModal({ imgUrl, title, onClose }) {
  if (!imgUrl) return null;
  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <a
          href={imgUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
        >
          <span>↗ Open Original</span>
        </a>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white font-extrabold text-lg flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="max-w-4xl max-h-[85vh] p-2 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {title && <p className="text-white text-sm font-bold mb-3 bg-black/50 px-4 py-1 rounded-full border border-white/20">{title}</p>}
        <img
          src={imgUrl}
          alt={title || "Full preview"}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl border-2 border-purple-400 shadow-2xl bg-slate-950"
        />
        <p className="text-slate-400 text-xs mt-3 font-medium">Click outside or press ✕ to close</p>
      </div>
    </div>
  );
}

// Detail View Modal for Admission Application with Big Image Previews
function AdmissionDetailModal({ admission, onClose, onStatusChange }) {
  const [zoomImg, setZoomImg] = useState(null);

  if (!admission) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative border border-slate-200 my-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#B026B5] flex items-center justify-center text-2xl font-bold">
              🎓
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{admission.studentName}</h3>
              <p className="text-xs text-slate-500">Submitted on: {new Date(admission.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto pr-2">
            {/* Grid for Personal & Course details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-[#B026B5] uppercase text-[10px] tracking-wider mb-2">👤 Personal Details</h4>
                <p><strong>Student Name:</strong> {admission.studentName}</p>
                <p><strong>Father's Name:</strong> {admission.fatherName || "—"}</p>
                <p><strong>Email:</strong> {admission.email}</p>
                <p><strong>Mobile:</strong> {admission.mobileNumber || "—"}</p>
                <p><strong>Father's Mobile:</strong> {admission.fatherMobile || "—"}</p>
                <p><strong>Category:</strong> {admission.category || "General"}</p>
                <p><strong>Gender:</strong> {admission.gender || "Male"}</p>
                <p><strong>DOB:</strong> {admission.dob || "—"}</p>
                <p><strong>Address:</strong> {admission.address || "—"}</p>
              </div>

              {/* Course Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-[#B026B5] uppercase text-[10px] tracking-wider mb-2">📚 Course & Batch Info</h4>
                <p>
                  <strong>Course Mode:</strong>{" "}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${admission.courseMode === "Offline" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"}`}>
                    {admission.courseMode || "Online"} Course
                  </span>
                </p>
                <p><strong>Course:</strong> {admission.courseId?.courseName || "—"}</p>
                <p><strong>Total Fee:</strong> <span className="font-extrabold text-[#B026B5]">{inr(admission.totalFee)}</span></p>
                <p><strong>Duration:</strong> {admission.courseDuration || "—"}</p>
                <p><strong>Batch Shift:</strong> {admission.batchTime || "—"}</p>
                <p><strong>Batch Start Date:</strong> {admission.batchStartTime || "—"}</p>
              </div>
            </div>

            {/* Payment Details Text */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-[#B026B5] uppercase tracking-wider block mb-1">💳 Transaction ID</span>
                <span className="font-mono text-sm font-extrabold text-purple-800 bg-purple-100/70 px-3 py-1 rounded-xl border border-purple-200">{admission.transactionId || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#B026B5] uppercase tracking-wider block mb-1">🏦 Bank UTR Number</span>
                <span className="font-mono text-sm font-extrabold text-sky-800 bg-sky-100/70 px-3 py-1 rounded-xl border border-sky-200">{admission.utrNumber || "N/A"}</span>
              </div>
            </div>

            {/* BIG IMAGES DISPLAY SECTION */}
            <div className="bg-slate-900 text-white p-5 rounded-3xl border border-purple-300 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-purple-300 uppercase text-xs tracking-wider flex items-center gap-2">
                  <span>🖼 High-Resolution Image Verification</span>
                </h4>
                <span className="text-[10px] text-slate-400">Click any image to view full screen zoom</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Large Student Photo */}
                {admission.photo ? (
                  <div className="flex flex-col items-center bg-slate-950 p-3 rounded-2xl border border-slate-800 group">
                    <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300 mb-2 px-1">
                      <span>📷 Student Photo</span>
                      <button
                        onClick={() => setZoomImg({ url: admission.photo, title: `${admission.studentName} — Student Photo` })}
                        className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                      >
                        🔍 Click to Zoom
                      </button>
                    </div>
                    <div
                      onClick={() => setZoomImg({ url: admission.photo, title: `${admission.studentName} — Student Photo` })}
                      className="w-full h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer relative bg-slate-900 border border-slate-700 flex items-center justify-center"
                    >
                      <img
                        src={admission.photo}
                        alt="Student Photo"
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">🔍 Click to Expand</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-500 text-xs h-64">
                    <span>📷 No Student Photo Uploaded</span>
                  </div>
                )}

                {/* Large Payment Proof */}
                {admission.paymentScreenshot ? (
                  <div className="flex flex-col items-center bg-slate-950 p-3 rounded-2xl border border-slate-800 group">
                    <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300 mb-2 px-1">
                      <span>💳 Payment Proof Screenshot</span>
                      <button
                        onClick={() => setZoomImg({ url: admission.paymentScreenshot, title: `${admission.studentName} — Fee Payment Proof` })}
                        className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                      >
                        🔍 Click to Zoom
                      </button>
                    </div>
                    <div
                      onClick={() => setZoomImg({ url: admission.paymentScreenshot, title: `${admission.studentName} — Fee Payment Proof` })}
                      className="w-full h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer relative bg-slate-900 border border-slate-700 flex items-center justify-center"
                    >
                      <img
                        src={admission.paymentScreenshot}
                        alt="Payment Proof Screenshot"
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">🔍 Click to Expand</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-500 text-xs h-64">
                    <span>💳 No Payment Proof Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Application Status:</span>
              <select
                value={admission.status || "pending"}
                onChange={(e) => onStatusChange(admission._id, e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✓ Completed (Approved)</option>
                <option value="on hold">⏸ On Hold</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for Full-screen Zoom */}
      {zoomImg && (
        <ImageLightboxModal
          imgUrl={zoomImg.url}
          title={zoomImg.title}
          onClose={() => setZoomImg(null)}
        />
      )}
    </>
  );
}

export default function OnlineAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admission?limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAdmissions(data.data || []);
      } else {
        showToast(data.msg || "Failed to load admissions", "error");
      }
    } catch {
      showToast("Network error fetching admissions", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  // Update Status Handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/admission/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to "${newStatus}"`, "success");
        setAdmissions((prev) =>
          prev.map((adm) => (adm._id === id ? { ...adm, status: newStatus } : adm))
        );
        if (selectedAdmission?._id === id) {
          setSelectedAdmission((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast(data.msg || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    }
  };

  // Delete Admission Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission application?")) return;
    try {
      const res = await fetch(`${API}/admission/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Admission deleted successfully", "success");
        setAdmissions((prev) => prev.filter((adm) => adm._id !== id));
        if (selectedAdmission?._id === id) setSelectedAdmission(null);
      } else {
        showToast(data.msg || "Failed to delete admission", "error");
      }
    } catch {
      showToast("Network error deleting admission", "error");
    }
  };

  // Filtered Admissions List
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const q = search.toLowerCase();
      const matchSearch =
        (adm.studentName || "").toLowerCase().includes(q) ||
        (adm.email || "").toLowerCase().includes(q) ||
        (adm.mobileNumber || "").toLowerCase().includes(q) ||
        (adm.courseId?.courseName || "").toLowerCase().includes(q) ||
        (adm.transactionId || "").toLowerCase().includes(q) ||
        (adm.utrNumber || "").toLowerCase().includes(q);

      const matchMode =
        modeFilter === "all"
          ? true
          : (adm.courseMode || "Online").toLowerCase() === modeFilter.toLowerCase();

      const matchStatus =
        statusFilter === "all" ? true : adm.status === statusFilter;

      return matchSearch && matchMode && matchStatus;
    });
  }, [admissions, search, modeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = admissions.length;
    const online = admissions.filter((a) => (a.courseMode || "Online").toLowerCase() === "online").length;
    const offline = admissions.filter((a) => (a.courseMode || "").toLowerCase() === "offline").length;
    const pending = admissions.filter((a) => a.status === "pending").length;
    return { total, online, offline, pending };
  }, [admissions]);

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            🎓 Online & Offline Admissions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View student applications, check Online/Offline course selections, verify UPI payment proofs, and approve enrollments.
          </p>
        </div>
        <button
          onClick={fetchAdmissions}
          className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#B026B5] border border-purple-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Applications</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-purple-600">🌐 Online Courses</div>
          <div className="text-2xl font-extrabold text-[#B026B5] mt-1">{stats.online}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-amber-600">🏫 Offline Courses</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats.offline}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-sky-600">⏳ Pending Approvals</div>
          <div className="text-2xl font-extrabold text-sky-700 mt-1">{stats.pending}</div>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-xs relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, transaction ID, UTR…"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          {/* Mode Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-500">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Modes</option>
              <option value="online">🌐 Online</option>
              <option value="offline">🏫 Offline</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✓ Completed</option>
              <option value="on hold">⏸ On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Student Details</th>
                <th className="p-3.5">Course &amp; Mode</th>
                <th className="p-3.5">Total Fee</th>
                <th className="p-3.5">Payment Details</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    <div className="w-8 h-8 border-4 border-[#B026B5] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading admission records…
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    No admission applications found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => (
                  <tr key={adm._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Details */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        {adm.photo ? (
                          <img src={adm.photo} alt="Photo" className="w-8 h-8 rounded-full object-cover border border-purple-200 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#B026B5] font-extrabold flex items-center justify-center shrink-0 text-xs">
                            {adm.studentName?.[0]?.toUpperCase() || "S"}
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-slate-900">{adm.studentName}</div>
                          <div className="text-[11px] text-slate-400">{adm.email} • {adm.mobileNumber || "No mobile"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course & Mode */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{adm.courseId?.courseName || "—"}</div>
                      <div className="mt-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${adm.courseMode === "Offline" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"}`}>
                          {adm.courseMode === "Offline" ? "🏫 Offline" : "🌐 Online"}
                        </span>
                      </div>
                    </td>

                    {/* Total Fee */}
                    <td className="p-3.5 font-extrabold text-[#B026B5]">
                      {inr(adm.totalFee)}
                    </td>

                    {/* Payment Details */}
                    <td className="p-3.5">
                      <div className="text-[11px] font-mono">
                        <div>Transaction ID : <span className="font-bold text-purple-700">{adm.transactionId || "—"}</span></div>
                        <div>UTR Number : <span className="font-bold text-sky-700">{adm.utrNumber || "—"}</span></div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={adm.status || "pending"}
                        onChange={(e) => handleStatusChange(adm._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${
                          adm.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : adm.status === "on hold"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-purple-50 text-purple-700 border-purple-300"
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✓ Completed</option>
                        <option value="on hold">⏸ On Hold</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAdmission(adm)}
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[#B026B5] font-bold rounded-lg transition-colors text-[11px] cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(adm._id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors text-[11px] cursor-pointer"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View */}
      {selectedAdmission && (
        <AdmissionDetailModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
