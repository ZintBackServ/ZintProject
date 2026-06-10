// pages/admin/UserAdminDashboard.jsx
// API routes from userRoute.js:
//   GET  /allUsers          (admin only)
//   GET  /getUserById/:id   (admin only)
//   PUT  /UpdateUser/:id    (authenticated)
//   DELETE /deleteUser/:id  (admin only)

import { useState, useEffect, useCallback } from "react";

const BASE       = `${import.meta.env.VITE_API_URL}/user`;
const getToken   = () => localStorage.getItem("token");
const authHeader = () => ({
  Authorization:  `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-indigo-500" };
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${colors[type] || colors.info}`}>
      <span>{type === "success" ? "✓" : "✕"}</span> {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block shrink-0" />;
}

// ── Update User Modal ─────────────────────────────────────────────────────────
function UpdateModal({ user, onClose, onUpdated, showToast }) {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName:  user.lastName  || "",
    email:     user.email     || "",
    contactNo: user.contactNo || "",
    address:   user.address   || "",
    city:      user.city      || "",
    state:     user.state     || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // PUT /UpdateUser/:id
      const res  = await fetch(`${BASE}/UpdateUser/${user._id}`, {
        method: "PUT", headers: authHeader(), body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(Array.isArray(json.msg) ? json.msg.join(", ") : json.msg);
      showToast("User updated successfully", "success");
      onUpdated();
      onClose();
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
            <InputField label="Last Name"  name="lastName"  value={form.lastName}  onChange={handleChange} />
          </div>
          <InputField label="Email"      name="email"     value={form.email}     onChange={handleChange} type="email" />
          <InputField label="Contact No" name="contactNo" value={form.contactNo} onChange={handleChange} />
          <InputField label="Address"    name="address"   value={form.address}   onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="City"  name="city"  value={form.city}  onChange={handleChange} />
            <InputField label="State" name="state" value={form.state} onChange={handleChange} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center justify-center gap-2">
              {loading && <Spinner />} {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── User Detail Modal ─────────────────────────────────────────────────────────
function UserDetailModal({ user, onClose, onEdit, onDelete }) {
  const row = (label, val) =>
    val ? (
      <div key={label} className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold w-24 shrink-0">{label}</span>
        <span className="text-sm text-gray-700 text-right break-all">{val}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition">✕</button>
        </div>
        <div className="px-6 py-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl">
              {user.firstName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-gray-900 font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                {user.role || "user"}
              </span>
            </div>
          </div>

          {row("Contact", user.contactNo)}
          {row("Address", user.address)}
          {row("City",    user.city)}
          {row("State",   user.state)}
          {row("Joined",  user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null)}

          <div className="flex gap-3 mt-5">
            <button onClick={() => { onClose(); onEdit(user); }}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
              ✏️ Edit
            </button>
            <button onClick={() => { onClose(); onDelete(user); }}
              className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition border border-red-100">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function UserAdminDashboard() {
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [toast,         setToast]         = useState(null);
  const [editUser,      setEditUser]      = useState(null);
  const [detailUser,    setDetailUser]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Single ID search
  const [findId,      setFindId]      = useState("");
  const [foundUser,   setFoundUser]   = useState(null);
  const [findLoading, setFindLoading] = useState(false);
  const [findError,   setFindError]   = useState("");

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  // ── GET /allUsers ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/allUsers`, { headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      setUsers(json.data || []);
    } catch (err) { showToast(err.message || "Failed to load users", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── DELETE /deleteUser/:id ──
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res  = await fetch(`${BASE}/deleteUser/${deleteTarget._id}`, { method: "DELETE", headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      showToast("User deleted successfully");
      fetchUsers();
    } catch (err) { showToast(err.message, "error"); }
    finally { setDeleteLoading(false); setDeleteTarget(null); }
  };

  // ── GET /getUserById/:id ──
  const handleFindById = async (e) => {
    e.preventDefault();
    if (!findId.trim()) return;
    setFindError(""); setFoundUser(null); setFindLoading(true);
    try {
      const res  = await fetch(`${BASE}/getUserById/${findId.trim()}`, { headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg || "User not found");
      setFoundUser(json.data);
    } catch (err) { setFindError(err.message); }
    finally { setFindLoading(false); }
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.contactNo} ${u.city}`.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ── Stats ──
  const adminCount = users.filter(u => u.role === "admin").length;
  const todayCount = users.filter(u => {
    if (!u.createdAt) return false;
    const d = new Date(u.createdAt), n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;
  const weekCount = users.filter(u =>
    u.createdAt && Date.now() - new Date(u.createdAt) < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <>
      {toast      && <Toast {...toast} onClose={() => setToast(null)} />}
      {editUser   && <UpdateModal user={editUser} onClose={() => setEditUser(null)} onUpdated={fetchUsers} showToast={showToast} />}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onEdit={(u)   => setEditUser(u)}
          onDelete={(u) => setDeleteTarget(u)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Permanently delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition flex items-center justify-center gap-2">
                  {deleteLoading && <Spinner />} Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">{users.length} registered users</p>
          </div>
          <button onClick={fetchUsers}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
            ↻ Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users",    value: users.length },
            { label: "Joined Today",   value: todayCount   },
            { label: "This Week",      value: weekCount     },
            { label: "Admin Accounts", value: adminCount    },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Find by ID */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">🔎 Find User by ID</h2>
          <form onSubmit={handleFindById} className="flex gap-3 flex-wrap">
            <input
              value={findId}
              onChange={e => { setFindId(e.target.value); setFoundUser(null); setFindError(""); }}
              placeholder="Paste user ObjectId..."
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-700 transition"
            />
            <button type="submit" disabled={findLoading || !findId.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2">
              {findLoading ? <Spinner /> : "Search"}
            </button>
            {findId && (
              <button type="button" onClick={() => { setFindId(""); setFoundUser(null); setFindError(""); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition">
                Clear
              </button>
            )}
          </form>

          {findError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{findError}</div>
          )}

          {foundUser && (
            <div className="mt-4 flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                {foundUser.firstName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{foundUser.firstName} {foundUser.lastName}</p>
                <p className="text-xs text-gray-500">{foundUser.email}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditUser(foundUser)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">Edit</button>
                <button onClick={() => setDeleteTarget(foundUser)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition border border-red-100">Delete</button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-gray-900">All Users</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, city..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-700 w-64 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs transition">✕</button>
              )}
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Name", "Email", "Contact", "City", "Role", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-40" /></td>
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-12" /></td>
                      <td className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">No users found</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setDetailUser(user)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{user.email}</td>
                      <td className="px-5 py-4 text-gray-500">{user.contactNo || "—"}</td>
                      <td className="px-5 py-4 text-gray-500">{user.city || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={() => setEditUser(user)}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition font-medium">
                            Edit
                          </button>
                          <button onClick={() => setDeleteTarget(user)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition font-medium">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((user) => (
              <div key={user._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3" onClick={() => setDetailUser(user)}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                  {user.firstName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setEditUser(user)}   className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm flex items-center justify-center hover:bg-indigo-100 transition">✏️</button>
                  <button onClick={() => setDeleteTarget(user)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 transition">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Reusable input ────────────────────────────────────────────────────────────
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        name={name} value={value} onChange={onChange} type={type}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800 transition"
      />
    </div>
  );
}
