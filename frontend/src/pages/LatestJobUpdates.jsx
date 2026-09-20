import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, MapPin, Phone, Search, X } from "lucide-react";
import { apiUrl, toHttps } from "../utils/api";
import latestJobImg from "../assets/latestJob.jpeg";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const displayDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function LatestJobUpdates() {
  const [jobUpdates, setJobUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/job-updates"))
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.message);
        setJobUpdates(data.jobUpdates || []);
      })
      .catch(() => setJobUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => [...new Set(jobUpdates.map(({ date }) => new Date(date).getFullYear()))].sort((a, b) => b - a), [jobUpdates]);
  const visibleJobs = useMemo(() => jobUpdates.filter((job) => {
    const jobDate = new Date(job.date);
    return (year === "all" || jobDate.getFullYear() === Number(year)) && (month === "all" || jobDate.getMonth() === Number(month)) && job.location.toLowerCase().includes(locationSearch.trim().toLowerCase());
  }), [jobUpdates, year, month, locationSearch]);

  const openConnect = (job) => {
    setSelectedJob(job);
    setForm({ name: "", phone: "" });
    setResult(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setResult(null);
      const response = await fetch(apiUrl(`/job-updates/${selectedJob._id}/connect`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not submit your request.");
      setResult({ type: "success", text: data.message });
    } catch (error) {
      setResult({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8fc] pb-20">
      {/* Top Banner Image */}
      <div className="w-full sm:px-6 lg:px-8 sm:pt-6 sm:pb-2 sm:max-w-7xl sm:mx-auto">
        <div className="relative w-full overflow-hidden sm:rounded-2xl lg:rounded-3xl shadow-xl shadow-fuchsia-100/60">
          <img
            src={latestJobImg}
            alt="Latest Job Updates Banner"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto] sm:items-end">
            <label className="text-sm font-bold text-slate-700">Year<select value={year} onChange={(event) => setYear(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-purple-600"><option value="all">All years</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label className="text-sm font-bold text-slate-700">Month<select value={month} onChange={(event) => setMonth(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-purple-600"><option value="all">All months</option>{months.map((value, index) => <option key={value} value={index}>{value}</option>)}</select></label>
            <label className="text-sm font-bold text-slate-700">Location<input value={locationSearch} onChange={(event) => setLocationSearch(event.target.value)} placeholder="Search city or location" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-purple-600" /></label>
            <div className="flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-bold text-white"><Search className="h-4 w-4" /><span>Total: {jobUpdates.length}</span><span className="text-purple-200">·</span><span>Showing: {visibleJobs.length}</span></div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3"><BriefcaseBusiness className="h-6 w-6 text-purple-700" /><h2 className="text-2xl font-extrabold text-slate-800">Available Job Updates</h2></div>
        {loading ? <p className="py-16 text-center text-slate-500">Loading job updates...</p> : visibleJobs.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-white py-16 text-center"><BriefcaseBusiness className="mx-auto h-11 w-11 text-purple-300" /><h3 className="mt-4 font-bold text-slate-700">No job updates found</h3><p className="mt-1 text-sm text-slate-500">Please check again soon for new opportunities.</p></div> : <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleJobs.map((job) => <article key={job._id} className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-[0_12px_30px_rgba(78,18,91,.10)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(78,18,91,.18)]"><img src={toHttps(job.poster)} alt={`Job update for ${job.location}`} className="aspect-[4/3] w-full object-cover" /><div className="p-5"><div className="space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-purple-700" /><span><strong className="text-slate-800">Date:</strong> {displayDate(job.date)}</span></p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-700" /><span><strong className="text-slate-800">Location:</strong> {job.location}</span></p></div><button onClick={() => openConnect(job)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-purple-800 hover:to-fuchsia-700"><Phone className="h-4 w-4" /> Get job link</button></div></article>)}</div>}
      </section>

      {selectedJob && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"><div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><button aria-label="Close" onClick={() => setSelectedJob(null)} className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button><BriefcaseBusiness className="h-8 w-8 text-purple-700" /><h2 className="mt-3 text-2xl font-extrabold text-slate-800">Get the job link</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">Enter your WhatsApp number. The Zint team will receive your request and connect with you about this {selectedJob.location} opportunity.</p>{result?.type === "success" ? <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{result.text}</p> : <form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-sm font-semibold text-slate-700">Name <span className="font-normal text-slate-400">(optional)</span><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-purple-600" placeholder="Your name" /></label><label className="block text-sm font-semibold text-slate-700">WhatsApp number<input required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-purple-600" placeholder="+91 98765 43210" /></label>{result && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{result.text}</p>}<button disabled={submitting} className="w-full rounded-xl bg-purple-700 py-3 text-sm font-bold text-white disabled:opacity-60">{submitting ? "Registering..." : "Register to get job link"}</button></form>}</div></div>}
    </main>
  );
}
