// pages/admin/AddCategory.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiAlertCircle, FiCheck, FiLoader, FiX } from "react-icons/fi";

/* ── tiny reusable input ── */
function TextInput({ value, onChange, placeholder, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200"
      style={{
        borderColor: focused ? "#B026B5" : "#e5e7eb",
        boxShadow: focused ? "0 0 0 3px rgba(176,38,181,0.09)" : "none",
        background: "#fff", color: "#111827",
      }}
    />
  );
}

export default function AddCategory() {
  const navigate = useNavigate();

  // ── existing categories from DB ──
  const [existing, setExisting]         = useState([]);
  const [exLoading, setExLoading]       = useState(true);
  const [deletingId, setDeletingId]     = useState(null);

  // ── bulk-add queue (local, not yet saved) ──
  const [queue, setQueue]               = useState([]); // [{ id, categoryName, description }]
  const [nameInput, setNameInput]       = useState("");
  const [descInput, setDescInput]       = useState("");
  const [inputError, setInputError]     = useState("");

  // ── submission ──
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState("");
  const [saveSuccess, setSaveSuccess]   = useState("");

  const token = localStorage.getItem("token");

  /* fetch existing */
  const fetchExisting = async () => {
    setExLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExisting(data.categories || []);
    } catch { /* silent */ }
    finally { setExLoading(false); }
  };

  useEffect(() => { fetchExisting(); }, []);

  /* add to local queue */
  const addToQueue = () => {
    const name = nameInput.trim();
    if (!name) { setInputError("Category name is required."); return; }
    const duplicate =
      existing.some(c => c.categoryName.toLowerCase() === name.toLowerCase()) ||
      queue.some(c => c.categoryName.toLowerCase() === name.toLowerCase());
    if (duplicate) { setInputError("This category already exists."); return; }
    setQueue(prev => [...prev, { id: Date.now(), categoryName: name, description: descInput.trim() }]);
    setNameInput(""); setDescInput(""); setInputError("");
  };

  const removeFromQueue = (id) => setQueue(prev => prev.filter(c => c.id !== id));

  /* save entire queue to DB */
  const saveAll = async () => {
    if (queue.length === 0) return;
    setSaving(true); setSaveError(""); setSaveSuccess("");
    const results = await Promise.allSettled(
      queue.map(cat =>
        fetch(`${import.meta.env.VITE_API_URL}/category/addCategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ categoryName: cat.categoryName, description: cat.description }),
        }).then(r => r.json().then(d => ({ ok: r.ok, data: d, cat })))
      )
    );

    const failed  = results.filter(r => r.status === "rejected" || !r.value?.ok);
    const passed  = results.filter(r => r.status === "fulfilled" && r.value?.ok);

    if (failed.length > 0) {
      const names = failed.map(f => f.value?.cat?.categoryName || "unknown").join(", ");
      setSaveError(`Failed to save: ${names}. Others may have been saved.`);
    }
    if (passed.length > 0) {
      setSaveSuccess(`${passed.length} categor${passed.length > 1 ? "ies" : "y"} added successfully!`);
      const savedIds = new Set(passed.map(r => r.value.cat.id));
      setQueue(prev => prev.filter(c => !savedIds.has(c.id)));
      fetchExisting(); // refresh list
    }
    setSaving(false);
  };

  /* soft-delete existing */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?\nCourses linked to it will lose their category reference.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/category/deleteCategory/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setExisting(prev => prev.filter(c => c._id !== id));
      else { const d = await res.json(); alert(d.msg || "Delete failed."); }
    } catch { alert("Network error."); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8FAFC" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)}
            className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-4 transition">
            ← Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 border"
            style={{ background: "rgba(176,38,181,0.07)", color: "#B026B5", borderColor: "rgba(176,38,181,0.2)" }}>
            ⚡ Admin Panel
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#111827" }}>Manage Categories</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Add categories in bulk — queue them up, then save all at once.
          </p>
        </div>

        {/* ── INPUT CARD ── */}
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4" style={{ borderColor: "#f0f0f0" }}>
          <p className="text-sm font-bold" style={{ color: "#374151" }}>Add to queue</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <TextInput
                value={nameInput}
                onChange={e => { setNameInput(e.target.value); setInputError(""); }}
                placeholder="Category name (e.g. Web Development)"
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addToQueue())}
              />
            </div>
            <div className="flex-1">
              <TextInput
                value={descInput}
                onChange={e => setDescInput(e.target.value)}
                placeholder="Description (optional)"
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addToQueue())}
              />
            </div>
            <button onClick={addToQueue}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex-shrink-0"
              style={{ background: "#B026B5" }}
              onMouseEnter={e => e.currentTarget.style.background = "#8f1e92"}
              onMouseLeave={e => e.currentTarget.style.background = "#B026B5"}>
              <FiPlus size={15} /> Add
            </button>
          </div>

          {inputError && (
            <p className="flex items-center gap-1 text-xs" style={{ color: "#ef4444" }}>
              <FiAlertCircle size={12} /> {inputError}
            </p>
          )}

          <p className="text-xs" style={{ color: "#9ca3af" }}>
            Press <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: "#e5e7eb" }}>Enter</kbd> or click Add to queue more. Hit <strong>Save All</strong> when ready.
          </p>
        </div>

        {/* ── QUEUE ── */}
        {queue.length > 0 && (
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: "#f0f0f0" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: "#374151" }}>
                Pending ({queue.length})
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(176,38,181,0.08)", color: "#B026B5" }}>
                Not saved yet
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {queue.map(cat => (
                <div key={cat.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border"
                  style={{ borderColor: "rgba(176,38,181,0.15)", background: "rgba(176,38,181,0.03)" }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{cat.categoryName}</p>
                    {cat.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{cat.description}</p>
                    )}
                  </div>
                  <button onClick={() => removeFromQueue(cat.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg transition"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}>
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Alerts */}
            {saveError && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl border text-sm"
                style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}>
                <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5" /> {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl border text-sm"
                style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>
                <FiCheck size={15} className="flex-shrink-0 mt-0.5" /> {saveSuccess}
              </div>
            )}

            {/* Save all button */}
            <button onClick={saveAll} disabled={saving}
              className="w-full font-bold py-3.5 rounded-xl text-sm text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: saving ? "#d1a3d3" : "#B026B5",
                boxShadow: saving ? "none" : "0 8px 24px rgba(176,38,181,0.25)",
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#8f1e92"; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#B026B5"; }}>
              {saving
                ? <><FiLoader size={14} className="animate-spin" /> Saving…</>
                : `Save ${queue.length} Categor${queue.length > 1 ? "ies" : "y"}`}
            </button>
          </div>
        )}

        {/* ── EXISTING CATEGORIES ── */}
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4" style={{ borderColor: "#f0f0f0" }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: "#374151" }}>
              Existing Categories
            </p>
            {!exLoading && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "#f3f4f6", color: "#6b7280" }}>
                {existing.length} total
              </span>
            )}
          </div>

          {exLoading ? (
            <div className="flex items-center gap-2 text-sm py-4" style={{ color: "#9ca3af" }}>
              <FiLoader size={14} className="animate-spin" /> Loading…
            </div>
          ) : existing.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "#9ca3af" }}>No categories yet. Add some above!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {existing.map(cat => (
                <div key={cat._id}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border"
                  style={{ borderColor: "#f0f0f0", background: "#fafafa" }}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "#111827" }}>{cat.categoryName}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "#f0fdf4", color: "#16a34a" }}>
                        {cat.courses?.length || 0} course{cat.courses?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{cat.description}</p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(cat._id, cat.categoryName)}
                    disabled={deletingId === cat._id}
                    className="flex-shrink-0 p-1.5 rounded-lg transition disabled:opacity-40"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}>
                    {deletingId === cat._id
                      ? <FiLoader size={14} className="animate-spin" />
                      : <FiTrash2 size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}