import { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar, Clock, MapPin, Plus, X, Pencil, Trash2, Users, Search,
  ImageIcon, Mail, Phone, GraduationCap, ClipboardList, LayoutGrid,
} from "lucide-react";

const EVENT_URL        = `${import.meta.env.VITE_API_URL}/event`;
const MENTOR_URL       = `${import.meta.env.VITE_API_URL}/mentor`;
const REGISTRATION_URL = `${import.meta.env.VITE_API_URL}/eventRegistration`;

// NOTE: adjust this if your admin token is stored differently (e.g. AuthContext, cookie auth).
function getToken() {
  return "";
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ── Safe fetch helper — avoids "Unexpected end of JSON input" crashes ─────────
async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data?.msg || `Request failed with status ${res.status}`);
  return data;
}

// ── Tiny debounce hook ───────────────────────────────────────────────────────
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Speaker tag input ──────────────────────────────────────────────────────
function SpeakerInput({ speakers, onChange, suggestions }) {
  const [draft, setDraft] = useState("");

  const addSpeaker = (raw) => {
    const name = raw.trim();
    if (!name) return;
    if (speakers.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...speakers, name]);
    setDraft("");
  };

  const removeSpeaker = (name) => onChange(speakers.filter((s) => s !== name));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSpeaker(draft);
    }
  };

  const availableSuggestions = suggestions.filter(
    (name) => !speakers.some((s) => s.toLowerCase() === name.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-2.5 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-colors">
        {speakers.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 rounded-full bg-indigo-50 pl-2.5 pr-1.5 py-1 text-xs font-medium text-indigo-700"
          >
            {name}
            <button
              type="button"
              onClick={() => removeSpeaker(name)}
              aria-label={`Remove ${name}`}
              className="rounded-full p-0.5 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && addSpeaker(draft)}
          placeholder={speakers.length ? "Add another…" : "Type a name, press Enter"}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-neutral-900 outline-none placeholder-neutral-400"
        />
      </div>
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.slice(0, 8).map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => addSpeaker(name)}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Event Form Modal (handles both Add + Edit) ─────────────────────────────
function EventFormModal({ mode, initialData, mentorNames, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: initialData?.name || "",
    about: initialData?.about || "",
    date: initialData?.date ? initialData.date.slice(0, 10) : "",
    time: initialData?.time || "",
    place: initialData?.place || "",
    isRegistrationOpen: initialData?.isRegistrationOpen ?? true,
    speakers: initialData?.speakers || [],
  });
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.eventImage || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setEventImage(null);
      e.target.value = "";
      return;
    }
    setEventImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Event name is required.");
    if (!form.about.trim()) return setError("About/description is required.");
    if (!form.date) return setError("Date is required.");
    if (!form.time.trim()) return setError("Time is required.");
    if (!form.place.trim()) return setError("Place is required.");
    if (!isEdit && !eventImage) return setError("Event image is required.");

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("about", form.about.trim());
    formData.append("date", form.date);
    formData.append("time", form.time.trim());
    formData.append("place", form.place.trim());
    formData.append("isRegistrationOpen", String(form.isRegistrationOpen));
    form.speakers.forEach((name) => formData.append("speakers", name));
    if (eventImage) formData.append("eventImage", eventImage);

    try {
      setSubmitting(true);
      const url = isEdit ? `${EVENT_URL}/updateEvent/${initialData._id}` : `${EVENT_URL}/addEvent`;
      const data = await safeFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      onSaved(data?.createdEvent || data?.updatedEvent || data?.event);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-neutral-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-neutral-200 bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
          <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
            {isEdit ? "Edit event" : "Add new event"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="event-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-6"
        >
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Event image
              {isEdit && <span className="ml-1 font-normal normal-case text-neutral-400">(leave blank to keep current)</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 sm:h-16 sm:w-16">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-neutral-300" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 sm:text-sm sm:file:px-4 sm:file:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Event name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Tech Summit India"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">About</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the event"
              className="resize-none rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Place</label>
            <input
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="e.g. Bhopal, MP"
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Speakers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Speakers</label>
            <SpeakerInput
              speakers={form.speakers}
              onChange={(speakers) => setForm((prev) => ({ ...prev, speakers }))}
              suggestions={mentorNames}
            />
          </div>

          <label className="flex cursor-pointer select-none items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
            <input
              type="checkbox"
              name="isRegistrationOpen"
              checked={form.isRegistrationOpen}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer accent-indigo-600"
            />
            <span className="text-sm font-medium text-neutral-700">Registrations open</span>
          </label>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        </form>

        <div className="shrink-0 border-t border-neutral-200 px-5 py-4 sm:px-6">
          <button
            type="submit"
            form="event-form"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 py-2.5 font-bold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 sm:py-3"
          >
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Event Card ──────────────────────────────────────────────────────────────
function EventCard({ event, onEdit, onDelete, deleting }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <img
        src={event.eventImage}
        alt={event.name}
        className="h-40 w-full shrink-0 object-cover sm:h-auto sm:w-40"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-neutral-900 sm:text-base">{event.name}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
              event.isRegistrationOpen ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {event.isRegistrationOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
        <p className="line-clamp-2 text-xs text-neutral-500">{event.about}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(event.date)}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {event.place}</span>
        </div>

        {event.speakers?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Users size={12} className="text-neutral-400" />
            {event.speakers.slice(0, 3).map((name) => (
              <span key={name} className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                {name}
              </span>
            ))}
            {event.speakers.length > 3 && (
              <span className="text-[10px] text-neutral-400">+{event.speakers.length - 3} more</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-2">
          <button
            onClick={() => onEdit(event)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
          >
            <Pencil size={12} /> Edit
          </button>
          <span className="text-neutral-200">•</span>
          <button
            onClick={() => onDelete(event._id)}
            disabled={deleting === event._id}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 transition-colors hover:text-rose-500 disabled:opacity-40"
          >
            <Trash2 size={12} /> {deleting === event._id ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Events tab ────────────────────────────────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const loadEvents = async () => {
    try {
      const data = await safeFetch(`${EVENT_URL}/allEvent`);
      setEvents(data?.events || []);
    } catch (err) {
      console.log(err);
      setEvents([]);
    }
  };

  const searchEvents = async (name) => {
    setSearching(true);
    try {
      const data = await safeFetch(`${EVENT_URL}/name/${encodeURIComponent(name)}`);
      setEvents(data?.events || []);
    } catch (err) {
      // 404 "no events found" is a normal empty-result case, not an error to surface
      setEvents([]);
    } finally {
      setSearching(false);
    }
  };

  const loadMentors = async () => {
    try {
      const data = await safeFetch(`${MENTOR_URL}/allMentor`);
      setMentors(data?.mentors || []);
    } catch (err) {
      console.log(err);
      setMentors([]);
    }
  };

  useEffect(() => {
    Promise.all([loadEvents(), loadMentors()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const trimmed = debouncedQuery.trim();
    if (trimmed) searchEvents(trimmed);
    else loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const mentorNames = useMemo(() => mentors.map((m) => m.name).filter(Boolean), [mentors]);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await safeFetch(`${EVENT_URL}/deleteEvent/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
      showToast("Event deleted successfully.");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleSaved = (savedEvent) => {
    if (!savedEvent) {
      loadEvents();
      showToast("Event saved.");
      return;
    }
    setEvents((prev) => {
      const exists = prev.some((e) => e._id === savedEvent._id);
      return exists ? prev.map((e) => (e._id === savedEvent._id ? savedEvent : e)) : [savedEvent, ...prev];
    });
    showToast(modal?.mode === "edit" ? "Event updated." : "Event created.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-neutral-500">Loading events…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 focus-within:border-indigo-400 sm:max-w-xs">
          <Search size={14} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by name…"
            className="w-full bg-transparent text-xs text-neutral-700 outline-none placeholder-neutral-400"
          />
          {searching && <div className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />}
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: null })}
          className="flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-500"
        >
          <Plus size={14} /> Add event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            deleting={deleting}
            onEdit={(ev) => setModal({ mode: "edit", data: ev })}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {events.length === 0 && (
        <div className="py-20 text-center text-neutral-400">
          <Calendar size={36} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm">{query.trim() ? "No events match your search." : "No events yet. Add your first one."}</p>
        </div>
      )}

      {modal && (
        <EventFormModal
          mode={modal.mode}
          initialData={modal.data}
          mentorNames={mentorNames}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 z-[1100] -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg ${
            toast.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ── Registration row (mobile card) ───────────────────────────────────────────
function RegistrationCard({ reg }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-bold text-sm text-neutral-900">{reg.name}</p>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
          {reg.event?.name || "—"}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5"><Mail size={12} /> {reg.email}</span>
        <span className="flex items-center gap-1.5"><Phone size={12} /> {reg.phone || "—"}</span>
        <span className="flex items-center gap-1.5"><GraduationCap size={12} /> {reg.highestQualification || "—"}</span>
        <span className="flex items-center gap-1.5 pt-1 text-[11px] text-neutral-400">
          <Clock size={11} /> {formatDateTime(reg.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ── Registrations tab ─────────────────────────────────────────────────────────
function RegistrationsTab() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch(`${REGISTRATION_URL}/all`, {
        credentials: "include",
      });
      const list = data?.registrations || [];
      // newest first, in case the backend sort order ever changes
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRegistrations(list);
    } catch (err) {
      if (err.message?.toLowerCase().includes("no registrations")) {
        setRegistrations([]);
      } else {
        setError(err.message || "Failed to load registrations.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.event?.name?.toLowerCase().includes(q)
    );
  }, [registrations, query]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-neutral-500">Loading registrations…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-rose-600">{error}</p>
        <button
          onClick={loadRegistrations}
          className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 focus-within:border-indigo-400 sm:max-w-xs">
          <Search size={14} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, event…"
            className="w-full bg-transparent text-xs text-neutral-700 outline-none placeholder-neutral-400"
          />
        </div>
        <p className="text-xs text-neutral-400">{filtered.length} registration{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-neutral-400">
          <ClipboardList size={36} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm">{query.trim() ? "No registrations match your search." : "No registrations yet."}</p>
        </div>
      ) : (
        <>
          {/* Table — sm and up */}
          <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Qualification</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr key={reg._id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-semibold text-neutral-900">{reg.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{reg.email}</td>
                    <td className="px-4 py-3 text-neutral-600">{reg.phone || "—"}</td>
                    <td className="px-4 py-3 text-neutral-600">{reg.highestQualification || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                        {reg.event?.name || "—"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-400">{formatDateTime(reg.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((reg) => (
              <RegistrationCard key={reg._id} reg={reg} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Event Manager ──────────────────────────────────────────────────────
export default function EventManager() {
  const [tab, setTab] = useState("events"); // "events" | "registrations"

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
              E
            </div>
            <p className="text-xs font-bold text-neutral-900 sm:text-sm">Events admin</p>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1">
            <button
              onClick={() => setTab("events")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:px-4 ${
                tab === "events" ? "bg-indigo-600 text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <LayoutGrid size={13} /> Events
            </button>
            <button
              onClick={() => setTab("registrations")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:px-4 ${
                tab === "registrations" ? "bg-indigo-600 text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <ClipboardList size={13} /> Registrations
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === "events" ? <EventsTab /> : <RegistrationsTab />}
      </div>
    </div>
  );
}