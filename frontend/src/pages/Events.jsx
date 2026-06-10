import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import EventImgSlider from "../components/EventImgSlider";
import eventImg1 from "../assets/zintRojgarImg3.png";
import eventImg2 from "../assets/zintRojgarImg2.jpeg";
import eventImg3 from "../assets/zintRojgarMission2026.png";

const API_URL      = `${import.meta.env.VITE_API_URL}/event/allEvent`;
const REGISTER_URL = `${import.meta.env.VITE_API_URL}/registration/add`;

const MONTHS = [
  "All","January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isUpcoming(d) { return new Date(d) >= new Date(); }

function parseDateParts(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return { month: 0, year: 0 };
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

// ── Register Modal ────────────────────────────────────────────────────────────
function RegisterModal({ event, onClose }) {
  const [form, setForm]       = useState({ name:"", email:"", phone:"", rollNo:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId:   event._id,
          eventName: event.name,
          name:      form.name,
          email:     form.email,
          phone:     form.phone,
          rollNo:    form.rollNo,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.msg || "Registration failed");
      }
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 sm:p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-2xl leading-none transition-colors"
        >×</button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h3 className="text-amber-400 text-xl font-bold mb-2">Registered!</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              See you at <span className="text-white font-semibold">{event.name}</span>.<br />
              Confirmation sent to your email.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
            >Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-white text-lg font-bold mb-0.5">Register for Event</h3>
            <p className="text-amber-400 text-sm mb-5 font-medium">{event.name} · {event.date}</p>

            {[
              { key:"name",   label:"Full Name *",     type:"text",  ph:"Your full name" },
              { key:"rollNo", label:"Roll No / ID",    type:"text",  ph:"e.g. ITM2024001" },
              { key:"email",  label:"Email Address *", type:"email", ph:"you@example.com" },
              { key:"phone",  label:"Phone",           type:"tel",   ph:"+91 XXXXX XXXXX" },
            ].map(({ key, label, type, ph }) => (
              <div key={key} className="mb-3.5">
                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-400 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-zinc-600"
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition-colors mt-1"
            >{loading ? "Submitting..." : "Confirm Registration →"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Upcoming Card ─────────────────────────────────────────────────────────────
function UpcomingCard({ event, onRegister }) {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/5 flex flex-col">
      <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
        <img
          src={event.eventImage}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
        <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">UPCOMING</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base leading-snug mb-1.5">{event.name}</h3>
        <p className="text-zinc-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{event.about}</p>
        <div className="space-y-1 mb-4">
          <p className="text-zinc-400 text-xs flex gap-2 flex-wrap">
            <span>📅</span>{event.date}
            <span className="text-zinc-700">·</span>
            <span>⏰</span>{event.time}
          </p>
          <p className="text-zinc-400 text-xs flex gap-2"><span>📍</span>{event.place}</p>
        </div>
        <button
          onClick={() => onRegister(event)}
          className="w-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-semibold py-2 rounded-xl text-sm transition-all duration-200"
        >Register Now</button>
      </div>
    </div>
  );
}

// ── Past Slide Card ───────────────────────────────────────────────────────────
function PastSlideCard({ event }) {
  return (
    <div className="group relative flex-shrink-0 w-60 xs:w-64 sm:w-72 h-72 sm:h-80 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer">
      <img
        src={event.eventImage}
        alt={event.name}
        className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-xs text-zinc-400 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 mb-2 inline-block">Past</span>
        <h3 className="text-white font-semibold text-sm leading-snug mb-1">{event.name}</h3>
        <p className="text-zinc-400 text-xs line-clamp-2 mb-1.5">{event.about}</p>
        <p className="text-zinc-500 text-xs">📅 {event.date}</p>
        <p className="text-zinc-500 text-xs mt-0.5">📍 {event.place}</p>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <div className="text-center py-20 text-zinc-600">
      <p className="text-5xl mb-4">🔎</p>
      <p className="text-lg">{message}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EventPage() {
  const [events, setEvents]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [upSlide, setUpSlide]             = useState(0);

  const [search, setSearch]     = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const [yearFilter, setYearFilter]   = useState("");
  const [monthFilter, setMonthFilter] = useState("All");

  const pastSliderRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d.events) ? d.events : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const upList   = events.filter(e => isUpcoming(e.date));
  const pastList = events.filter(e => !isUpcoming(e.date));

  // ── filter past list ────────────────────────────────────────────────────────
  const filtered = pastList.filter(e => {
    const q      = search.toLowerCase().trim();
    const textOk = !q
      || (searchBy === "name"  && e.name.toLowerCase().includes(q))
      || (searchBy === "date"  && e.date.toLowerCase().includes(q))
      || (searchBy === "place" && e.place.toLowerCase().includes(q));

    const { year, month } = parseDateParts(e.date);
    const yearOk  = !yearFilter.trim() || year === parseInt(yearFilter);
    const monthOk = monthFilter === "All" || month === MONTHS.indexOf(monthFilter);

    return textOk && yearOk && monthOk;
  });

  const clearDateFilter = () => { setYearFilter(""); setMonthFilter("All"); };
  const hasDateFilter   = yearFilter.trim() || monthFilter !== "All";

  // upcoming slider
  const PER_PAGE   = 3;
  const totalPages = Math.ceil(upList.length / PER_PAGE);
  const visible    = upList.slice(upSlide * PER_PAGE, upSlide * PER_PAGE + PER_PAGE);

  const scrollPast = dir => pastSliderRef.current?.scrollBy({ left: dir * 310, behavior: "smooth" });

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {registerEvent && (
        <RegisterModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
      )}

      {/* ══ HERO ══ */}
      <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-hidden">
        <img src={eventImg1} alt="Hero" className="w-full h-[400px] sm:h-[500px] md:h-[560px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

        {/* nav */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Zint Institute</span>
          </div>
          <button
            onClick={() => document.getElementById("upcoming").scrollIntoView({ behavior:"smooth" })}
            className="hidden sm:block border border-white/20 hover:border-amber-400 hover:text-amber-400 text-white/70 text-xs px-4 py-2 rounded-full transition-colors"
          >View Events</button>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center md:justify-start  text-center px-4 sm:px-6">
          <p className="text-amber-400 text-xs tracking-[0.25em] sm:tracking-[0.35em] uppercase font-semibold mt-5 mb-3 sm:mb-5">
            Where moments become memories
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6 leading-tight ">
            ZINT ROJGAR MISSION - 10 JAN. 2026
          </h1>
          <div className="flex flex-col xs:flex-row flex-wrap gap-3 justify-center w-full max-w-xs xs:max-w-none">
            <button
              onClick={() => document.getElementById("upcoming").scrollIntoView({ behavior:"smooth" })}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm transition-colors shadow-lg shadow-amber-400/20 animate-pulse"
            >Upcoming Events ↓</button>
            <button
              onClick={() => document.getElementById("past").scrollIntoView({ behavior:"smooth" })}
              className="border border-white/25 hover:border-white/60 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm transition-colors"
            >Past Events</button>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="bg-zinc-900/80 border-y border-zinc-800 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-3 divide-x divide-zinc-800">
          {[
            { num:`${upList.length}+`,   label:"Upcoming Events" },
            { num:`${pastList.length}+`, label:"Events Done" },
            { num:"10k+",               label:"Attendees" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center px-2">
              <p className="text-lg sm:text-2xl md:text-3xl font-black text-amber-400">{num}</p>
              <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ UPCOMING EVENTS ══ */}
      <section id="upcoming" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase font-semibold mb-2">Don't miss out</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Upcoming Events</h2>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUpSlide(s => Math.max(0, s - 1))}
                disabled={upSlide === 0}
                className="w-10 h-10 rounded-full border border-zinc-700 hover:border-zinc-400 disabled:opacity-25 flex items-center justify-center transition-colors"
              >←</button>
              <span className="text-zinc-500 text-sm">{upSlide + 1} / {totalPages}</span>
              <button
                onClick={() => setUpSlide(s => Math.min(totalPages - 1, s + 1))}
                disabled={upSlide === totalPages - 1}
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 disabled:opacity-25 text-black flex items-center justify-center transition-colors"
              >→</button>
            </div>
          )}
        </div>

        {upList.length === 0 ? (
          <EmptyState message="No upcoming events at the moment. Check back soon!" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {visible.map(event => (
                <UpcomingCard key={event._id} event={event} onRegister={setRegisterEvent} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setUpSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === upSlide ? "w-7 bg-amber-400" : "w-2 bg-zinc-700 hover:bg-zinc-500"}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ══ MEMORIES BANNER ══ */}
      <div className="text-center py-10 sm:py-12 px-4">
        <p className="text-orange-500 uppercase tracking-[4px] text-xs sm:text-sm font-semibold">
          Zint Rojgar Mission 2026
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
          Our Old Memories
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base">
          Relive the unforgettable moments, achievements, and memories created during the journey of Zint Rojgar Mission 2026.
        </p>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl mb-10 sm:mb-16 flex flex-col md:flex-row gap-4 sm:gap-5 rounded-3xl overflow-hidden">
        <img src={eventImg2} alt="Zint Rojgar" className="w-full md:w-1/2 h-52 sm:h-72 md:h-80 object-cover rounded-2xl" />
        <img src={eventImg3} alt="Zint Rojgar Mission" className="w-full md:w-1/2 h-52 sm:h-72 md:h-80 object-cover rounded-2xl" />
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl mb-10 sm:mb-16 rounded-3xl overflow-hidden">
        <EventImgSlider />
      </div>

      {/* ══ PAST EVENTS ══ */}
      <section id="past" className="py-12 sm:py-16 md:py-20 bg-zinc-900/40 border-y border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-amber-400 text-xs tracking-[0.25em] uppercase font-semibold mb-2">Relive the memories</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Previous Events</h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => scrollPast(-1)}
                className="w-10 h-10 rounded-full border border-zinc-700 hover:border-zinc-400 flex items-center justify-center transition-colors"
              >←</button>
              <button
                onClick={() => scrollPast(1)}
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition-colors"
              >→</button>
            </div>
          </div>

          {/* search row */}
          <div className="flex flex-col gap-3 mb-3">

            {/* text search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-700 focus-within:border-amber-400 rounded-xl px-4 py-2.5 transition-colors">
                <FaSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search by ${searchBy}...`}
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-600 min-w-0"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-zinc-500 hover:text-white text-xl leading-none shrink-0">×</button>
                )}
              </div>
              <div className="flex gap-2 shrink-0 overflow-x-auto">
                {["name","date","place"].map(f => (
                  <button
                    key={f}
                    onClick={() => setSearchBy(f)}
                    className={`px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize whitespace-nowrap ${searchBy === f ? "bg-amber-400 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* date filter row */}
            <div className="flex flex-wrap items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <label className="text-zinc-400 text-sm font-medium whitespace-nowrap">By Year:</label>
                <input
                  type="number"
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                  placeholder="2026"
                  min="2000" max="2099"
                  className="w-20 sm:w-24 bg-zinc-800 border border-zinc-600 focus:border-amber-400 text-white rounded-lg px-3 py-1.5 text-sm outline-none transition-colors placeholder-zinc-600"
                />
              </div>
              <div className="w-px h-5 bg-zinc-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <label className="text-zinc-400 text-sm font-medium whitespace-nowrap">Month:</label>
                <select
                  value={monthFilter}
                  onChange={e => setMonthFilter(e.target.value)}
                  className="bg-zinc-800 border border-zinc-600 focus:border-amber-400 text-white rounded-lg px-2 sm:px-3 py-1.5 text-sm outline-none transition-colors"
                >
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <button
                onClick={clearDateFilter}
                disabled={!hasDateFilter}
                className="ml-auto bg-[#8B1A1A] hover:bg-red-800 disabled:opacity-30 text-white font-semibold px-4 sm:px-5 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap"
              >{hasDateFilter ? "Clear" : "Search"}</button>
              {hasDateFilter && (
                <span className="text-amber-400 text-xs w-full sm:w-auto">
                  Filtering: {yearFilter && `Year ${yearFilter}`}{yearFilter && monthFilter !== "All" && " · "}{monthFilter !== "All" && monthFilter}
                </span>
              )}
            </div>
          </div>

          {/* results count */}
          {(search || hasDateFilter) && (
            <p className="text-zinc-500 text-sm mb-5">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* slider */}
          {pastList.length === 0 ? (
            <EmptyState message="No past events yet." />
          ) : filtered.length === 0 ? (
            <EmptyState message="No events match your search." />
          ) : (
            <div
              ref={pastSliderRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth:"none", msOverflowStyle:"none" }}
            >
              {filtered.map(event => <PastSlideCard key={event._id} event={event} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-zinc-800 py-6 sm:py-8 text-center text-zinc-600 text-sm px-4">
        <p className="text-amber-400/60 font-semibold mb-1 tracking-widest text-xs uppercase">EventSphere</p>
        © 2025 EventSphere. All rights reserved.
      </footer>
    </div>
  );
}
