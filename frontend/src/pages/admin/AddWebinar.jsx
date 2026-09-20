import { useEffect, useState } from "react";
import { apiUrl } from "../../utils/api";

const DEFAULT_CATEGORIES = [
  "Full Stack & AI",
  "Data Science",
  "Cyber Security",
  "Career Guidance",
  "Web Development",
  "Cloud & DevOps",
  "Python & AI",
];

const initialForm = {
  title: "",
  description: "",
  mentor: "",
  mentorRole: "",
  date: "",
  time: "",
  meetingLink: "",
  isRegistrationOpen: true,
};

export default function AddWebinar() {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [categorySelect, setCategorySelect] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [registrationSummary, setRegistrationSummary] = useState({ total: 0, byWebinar: {} });
  const [registrationModal, setRegistrationModal] = useState(null);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const loadWebinars = async () => {
    try {
      const response = await fetch(apiUrl("/webinar"));
      const data = await response.json();
      if (data.success) setWebinars(data.webinars || []);
    } catch {
      setWebinars([]);
    }
  };

  const loadRegistrationSummary = async () => {
    try {
      const response = await fetch(apiUrl("/webinar/admin/registration-summary"), { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setRegistrationSummary({ total: data.totalRegistrations || 0, byWebinar: data.registrationsByWebinar || {} });
      }
    } catch {
      setRegistrationSummary({ total: 0, byWebinar: {} });
    }
  };

  useEffect(() => {
    fetch(apiUrl("/category/getAllCategories"))
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          const apiCatNames = data.categories.map((c) => c.categoryName?.trim()).filter(Boolean);
          const combined = Array.from(new Set([...apiCatNames, ...DEFAULT_CATEGORIES]));
          setCategories(combined);
          setCategorySelect(combined[0]);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_CATEGORIES
      });
  }, []);

  useEffect(() => {
    loadWebinars();
    loadRegistrationSummary();
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const choosePoster = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose an image file for the webinar poster." });
      event.target.value = "";
      return;
    }
    setPoster(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!poster && !editingId) {
      setMessage({ type: "error", text: "Please upload a webinar poster." });
      return;
    }

    const finalCategory =
      categorySelect === "custom"
        ? customCategory.trim() || "General"
        : categorySelect;

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, String(value)));
    body.append("category", finalCategory);
    body.append("poster", poster);

    try {
      setSaving(true);
      setMessage(null);
      const response = await fetch(apiUrl(editingId ? `/webinar/${editingId}` : "/webinar"), {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not add webinar.");
      setMessage({
        type: "success",
        text: editingId ? "Webinar updated successfully." : "Webinar published successfully. It is now visible on the Webinar page.",
      });
      setForm(initialForm);
      setCategorySelect(categories[0] || DEFAULT_CATEGORIES[0]);
      setCustomCategory("");
      setPoster(null);
      setPreview("");
      setEditingId(null);
      event.target.reset();
      loadWebinars();
      loadRegistrationSummary();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const editWebinar = (webinar) => {
    const category = webinar.category || DEFAULT_CATEGORIES[0];
    if (!categories.includes(category)) setCategories((current) => [...current, category]);
    setForm({
      title: webinar.title || "",
      description: webinar.description || "",
      mentor: webinar.mentor || "",
      mentorRole: webinar.mentorRole || "",
      date: webinar.date ? new Date(webinar.date).toISOString().slice(0, 10) : "",
      time: webinar.time || "",
      meetingLink: webinar.meetingLink || "",
      isRegistrationOpen: webinar.isRegistrationOpen !== false,
    });
    setCategorySelect(category);
    setCustomCategory("");
    setPoster(null);
    setPreview(webinar.poster || "");
    setEditingId(webinar._id);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(initialForm);
    setCategorySelect(categories[0] || DEFAULT_CATEGORIES[0]);
    setCustomCategory("");
    setPoster(null);
    setPreview("");
    setEditingId(null);
    setMessage(null);
  };

  const removeWebinar = async (webinar) => {
    if (!window.confirm(`Remove "${webinar.title}"? This also removes its registrations.`)) return;
    try {
      const response = await fetch(apiUrl(`/webinar/${webinar._id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not remove webinar.");
      if (editingId === webinar._id) cancelEdit();
      setMessage({ type: "success", text: "Webinar removed successfully." });
      loadWebinars();
      loadRegistrationSummary();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const viewRegistrations = async (webinar) => {
    try {
      setLoadingRegistrations(true);
      const response = await fetch(apiUrl(`/webinar/admin/${webinar._id}/registrations`), { credentials: "include" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not load registrations.");
      setRegistrationModal(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingRegistrations(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Events</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{editingId ? "Edit Webinar" : "Add Webinar"}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {editingId ? "Update this webinar, or cancel to create a new one." : "Publish a live webinar and let visitors register for it."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="sm:col-span-2 text-sm font-semibold text-gray-700">
            Webinar name
            <input
              required
              name="title"
              value={form.title}
              onChange={update}
              placeholder="e.g. AI & Data Science Career Roadmap 2026"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Date
            <input
              required
              type="date"
              name="date"
              value={form.date}
              onChange={update}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Time
            <input
              required
              type="time"
              name="time"
              value={form.time}
              onChange={update}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Mentor name
            <input
              required
              name="mentor"
              value={form.mentor}
              onChange={update}
              placeholder="e.g. Abhishek Sir"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            Mentor designation
            <input
              name="mentorRole"
              value={form.mentorRole}
              onChange={update}
              placeholder="e.g. Senior AI Architect @ Tech Firm"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          <label className="sm:col-span-2 text-sm font-semibold text-gray-700">
            Webinar description
            <textarea
              required
              rows="4"
              name="description"
              value={form.description}
              onChange={update}
              placeholder="Explain what students will learn in this webinar..."
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>

          {/* ── Category Selection with API & Custom Category ── */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Category
              <select
                value={categorySelect}
                onChange={(e) => setCategorySelect(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="custom">✨ + Add Custom Category</option>
              </select>
            </label>

            {categorySelect === "custom" && (
              <input
                required
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type new category name (e.g. Generative AI)"
                className="w-full rounded-lg border border-purple-400 bg-purple-50/50 px-3 py-2.5 text-sm font-normal outline-none focus:border-purple-600 focus:bg-white"
              />
            )}
          </div>

          <label className="text-sm font-semibold text-gray-700">
            Meeting link <span className="font-normal text-gray-400">(optional)</span>
            <input
              type="url"
              name="meetingLink"
              value={form.meetingLink}
              onChange={update}
              placeholder="https://meet.google.com/..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600"
            />
          </label>
        </div>

        <div className="rounded-xl border border-dashed border-gray-300 p-4">
          <label className="block text-sm font-semibold text-gray-700">Webinar poster</label>
          <input
            required={!editingId}
            type="file"
            accept="image/*"
            onChange={choosePoster}
            className="mt-2 text-sm"
          />
          {preview && (
            <div className="mt-4 p-2 bg-gray-50 rounded-xl border flex items-center justify-center max-w-sm">
              <img
                src={preview}
                alt="Poster preview"
                className="max-h-48 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="isRegistrationOpen"
            checked={form.isRegistrationOpen}
            onChange={update}
            className="accent-purple-700"
          />
          Keep registration open
        </label>

        {message && (
          <p
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          disabled={saving}
          className="rounded-lg bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60 transition shadow-sm"
        >
          {saving ? "Saving..." : editingId ? "Save Webinar Changes" : "Publish Webinar"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="ml-3 rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="mt-10 border-t border-gray-100 pt-7">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Webinars</h2>
            <p className="text-sm text-gray-500">Edit webinar details or remove a webinar and its registrations.</p>
          </div>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
            {webinars.length} webinars · {registrationSummary.total} registrations
          </span>
        </div>

        {webinars.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">No webinars have been added yet.</p>
        ) : (
          <div className="space-y-3">
            {webinars.map((webinar) => (
              <div key={webinar._id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-gray-200 p-3.5">
                <img src={webinar.poster} alt="" className="h-16 w-16 rounded-lg object-cover bg-gray-100" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 truncate">{webinar.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(webinar.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {webinar.time} · {webinar.mentor}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    {registrationSummary.byWebinar[webinar._id] || 0} student{registrationSummary.byWebinar[webinar._id] === 1 ? "" : "s"} registered
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => viewRegistrations(webinar)} disabled={loadingRegistrations} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 transition">Students</button>
                  <button type="button" onClick={() => editWebinar(webinar)} className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-200 transition">Edit</button>
                  <button type="button" onClick={() => removeWebinar(webinar)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {registrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Registered Students</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{registrationModal.webinar?.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{registrationModal.totalRegistrations} total registration{registrationModal.totalRegistrations === 1 ? "" : "s"}</p>
              </div>
              <button type="button" onClick={() => setRegistrationModal(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close student details">✕</button>
            </div>

            {registrationModal.registrations?.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">No students have registered for this webinar yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <tr><th className="px-3 py-2">Student</th><th className="px-3 py-2">WhatsApp</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Interest</th><th className="px-3 py-2">Registered</th></tr>
                  </thead>
                  <tbody>
                    {registrationModal.registrations.map((student) => (
                      <tr key={student._id} className="border-b border-gray-100 align-top">
                        <td className="px-3 py-3"><p className="font-semibold text-gray-900">{student.fullName}</p><p className="mt-0.5 text-xs text-gray-500">{student.email}</p></td>
                        <td className="px-3 py-3 text-gray-700">{student.phone}</td>
                        <td className="px-3 py-3 text-gray-700">{student.status || "—"}</td>
                        <td className="px-3 py-3 text-gray-700">{student.interest || "—"}</td>
                        <td className="px-3 py-3 text-gray-500">{new Date(student.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
