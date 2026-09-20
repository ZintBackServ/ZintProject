import { useState } from "react";
import { apiUrl } from "../../utils/api";

export default function AddJobUpdate() {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const choosePoster = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage({ type: "error", text: "Please select an image file." });
    setPoster(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!poster) return setMessage({ type: "error", text: "Please upload a job poster." });
    const body = new FormData();
    body.append("date", date);
    body.append("location", location);
    body.append("poster", poster);
    try {
      setSaving(true); setMessage(null);
      const response = await fetch(apiUrl("/job-updates"), { method: "POST", credentials: "include", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not publish job update.");
      setMessage({ type: "success", text: "Job update published successfully." });
      setDate(""); setLocation(""); setPoster(null); setPreview(""); event.target.reset();
    } catch (error) { setMessage({ type: "error", text: error.message }); } finally { setSaving(false); }
  };

  return <section className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-wider text-purple-700">Placements</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Add Latest Job Update</h1><p className="mt-1 text-sm text-gray-500">Publish a job poster for students to view and request the job link.</p></div><form onSubmit={submit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700">Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600" /></label><label className="text-sm font-semibold text-gray-700">Location<input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Gwalior, Madhya Pradesh" className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-purple-600" /></label></div><div className="rounded-xl border border-dashed border-gray-300 p-4"><label className="block text-sm font-semibold text-gray-700">Job poster</label><input required type="file" accept="image/*" onChange={choosePoster} className="mt-2 text-sm" />{preview && <img src={preview} alt="Job poster preview" className="mt-4 max-h-72 max-w-full rounded-lg border object-contain" />}</div>{message && <p className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}<button disabled={saving} className="rounded-lg bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60">{saving ? "Publishing..." : "Publish job update"}</button></form></section>;
}
