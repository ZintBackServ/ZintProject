import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

const EMPTY_FORM = {
  title: "",
  message: "",
  type: "announcement",
  refId: "",
  isActive: true,
  expiresAt: "",
  image: null,
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [editingId, setEditingId]         = useState(null);
  const [preview, setPreview]             = useState(null); // image preview URL
  const [toast, setToast]                 = useState(null); // { msg, type }
  const fileRef = useRef();

  // ── Fetch all notifications (admin) ──────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/notification/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setNotifications(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Image picker ──────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // ── Submit (create or update) ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token    = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title",    form.title);
      formData.append("type",     form.type);
      formData.append("isActive", form.isActive);
      if (form.message)   formData.append("message",   form.message);
      if (form.refId)     formData.append("refId",     form.refId);
      if (form.expiresAt) formData.append("expiresAt", form.expiresAt);
      if (form.image)     formData.append("image",     form.image);

      const url    = editingId
        ? `${API}/notification/${editingId}`
        : `${API}/notification/`;
      const method = editingId ? "PUT" : "POST";

      const res  = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      showToast(editingId ? "Notification updated!" : "Notification created!");
      resetForm();
      fetchNotifications();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle active/hidden ──────────────────────────────────
  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/notification/${id}/toggle`, {
        method:  "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showToast(data.message);
      fetchNotifications();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/notification/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showToast("Notification deleted.");
      fetchNotifications();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ── Load into edit form ───────────────────────────────────
  const startEdit = (n) => {
    setEditingId(n._id);
    setForm({
      title:     n.title     || "",
      message:   n.message   || "",
      type:      n.type      || "announcement",
      refId:     n.refId     || "",
      isActive:  n.isActive,
      expiresAt: n.expiresAt ? n.expiresAt.slice(0, 16) : "",
      image:     null,
    });
    setPreview(n.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const typeBadge = {
    course:       "bg-blue-100 text-blue-700",
    event:        "bg-purple-100 text-purple-700",
    announcement: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
            ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage notifications shown to all users.
          </p>
        </div>

        {/* ── Form ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {editingId ? "Edit Notification" : "New Notification"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title + Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Batch Starting!"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, refId: "" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="announcement">Announcement</option>
                  <option value="course">Course</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Short description shown in the notification..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* RefId — only for course / event */}
            {(form.type === "course" || form.type === "event") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.type === "course" ? "Course ID" : "Event ID"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Paste the ${form.type} ObjectId here`}
                  value={form.refId}
                  onChange={(e) => setForm({ ...form, refId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Image + Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {preview && (
                  <div className="mt-2 relative w-24 h-24">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setForm((f) => ({ ...f, image: null })); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${form.isActive ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                    ${form.isActive ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span className="text-sm text-gray-700">
                {form.isActive ? "Visible to users" : "Hidden"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Create Notification"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── List ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              All Notifications
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({notifications.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-red-500 text-sm">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm gap-2">
              <span className="text-3xl">🔔</span>
              No notifications yet. Create one above.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li key={n._id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Image thumbnail */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {n.image ? (
                      <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {n.type === "course" ? "📚" : n.type === "event" ? "📅" : "📢"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {n.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[n.type]}`}>
                        {n.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${n.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {n.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                    {n.message && (
                      <p className="text-xs text-gray-500 truncate">{n.message}</p>
                    )}
                    {n.expiresAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Expires: {new Date(n.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(n._id)}
                      title={n.isActive ? "Hide" : "Show"}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      {n.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(n)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 text-indigo-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}