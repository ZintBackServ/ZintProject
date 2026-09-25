import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Newspaper, 
  ArrowRight, 
  ExternalLink, 
  Award, 
  GraduationCap,
  Download,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function LatestUpdatesSection() {
  const [updates, setUpdates] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
      const apiUrls = [...new Set([configuredApiUrl, window.location.origin].filter(Boolean))];

      for (const apiUrl of apiUrls) {
        try {
          const res = await fetch(`${apiUrl}/updates/getAllUpdates`);
          if (!res.ok) continue;

          const data = await res.json();
          if (!Array.isArray(data?.data) || data.data.length === 0) continue;

          const unique = data.data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.heading === item.heading)
          );
          setUpdates(unique);
          // Open the newest notice in the preview as soon as the section loads.
          setSelectedPdf(unique[0]?.pdf || null);
          setPdfPreviewVisible(false);
          setLoading(false);
          return;
        } catch (err) {
          console.warn(`Updates unavailable from ${apiUrl}`, err);
        }
      }

      console.error("Updates fetch error: no API source returned announcements");
      setUpdates([]);
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const defaultItems = [
    {
      _id: "update-1",
      heading: "Workshop 16/9/26: Full-Stack Web Architecture & AI",
      category: "events",
      categoryLabel: "Workshop",
      date: "16 Sep 2026",
      summary: "Hands-on masterclass covering modern web development, Git workflows and AI integration.",
      pdf: null,
    },
    {
      _id: "update-2",
      heading: "Zint Institute features in Dainik Bhaskar for Tech Education Excellence",
      category: "press",
      categoryLabel: "Press Release",
      date: "Active",
      summary: "Recognized as a leading technical education institute with dedicated placement support and ISO certification.",
      pdf: null,
    },
  ];

  const formattedItems = (updates.length > 0 ? updates : defaultItems).map((item, idx) => {
    const title = (item.heading || "").toLowerCase();
    let category = "academic";
    let categoryLabel = "Notice";

    if (title.includes("workshop") || title.includes("seminar") || title.includes("event")) {
      category = "events";
      categoryLabel = "Workshop";
    } else if (title.includes("bhaskar") || title.includes("news") || title.includes("press")) {
      category = "press";
      categoryLabel = "Press Release";
    } else if (title.includes("placement") || title.includes("job") || title.includes("hiring")) {
      category = "placements";
      categoryLabel = "Placements";
    } else if (title.includes("admission") || title.includes("batch")) {
      category = "academic";
      categoryLabel = "Admissions";
    }

    return {
      ...item,
      category,
      categoryLabel,
      date: item.date || (idx === 0 ? "Latest" : "Active"),
      summary: item.summary || "Verified official circular issued by Zint Academic Administration & Examination Cell.",
    };
  });

  // Filter items by active tab and strictly limit to maximum 4 updates
  const filteredList = (activeCategory === "all" 
    ? formattedItems 
    : formattedItems.filter(item => item.category === activeCategory)
  ).slice(0, 4);

  const categories = [
    { id: "all", label: "All Updates" },
    { id: "academic", label: "Admissions" },
    { id: "events", label: "Workshops" },
    { id: "press", label: "Press" },
    { id: "placements", label: "Placements" },
  ];

  const featured = filteredList[activeFeatured] || filteredList[0] || formattedItems[0];
  // Keep a PDF visible by default, including after changing a category.
  const previewPdf = selectedPdf || featured?.pdf || null;

  const getCategoryIcon = (category) => {
    switch (category) {
      case "events":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "press":
        return <Newspaper className="w-4 h-4 text-sky-600" />;
      case "placements":
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <GraduationCap className="w-4 h-4 text-fuchsia-600" />;
    }
  };

  return (
    <section 
      id="latest-updates" 
      className="relative overflow-hidden bg-[#FAF9FC] py-6 sm:py-8 px-4 sm:px-6 lg:px-10 select-none border-y border-slate-200/60"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* ==================== HEADER (CLEAN & COMPACT) ==================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Latest <span className="text-[#8B1C8D]">Announcements &amp; Updates</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-normal">
              Stay connected with verified notifications regarding admissions, upcoming seminars, and placement drives.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveFeatured(0);
                  setSelectedPdf(null);
                  setPdfPreviewVisible(false);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== 2 EQUAL-LEVEL BOXES ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          
          {/* ── Left Box: Updates List ── */}
          <div className="min-h-[400px] h-full bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No announcements in this category.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredList.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    onClick={() => {
                      setActiveFeatured(idx);
                      setSelectedPdf(item.pdf || null);
                      setPdfPreviewVisible(false);
                    }}
                    className={`group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                      activeFeatured === idx
                        ? "bg-purple-50/40 border-purple-300 shadow-2xs"
                        : "bg-white hover:bg-slate-50/80 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#8B1C8D] transition-colors leading-snug truncate">
                          {item.heading}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#8B1C8D] hover:bg-[#731475] px-2.5 py-1 rounded-lg shadow-2xs transition-colors">
                      PDF <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Footer Row */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Verified Academic Cell
              </span>

              <a
                href="#latest-updates"
                className="font-bold text-[#8B1C8D] hover:underline flex items-center gap-0.5"
              >
                View Full Archives <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ── Right Box: Selected update preview / inline PDF ── */}
          <div className="min-h-[400px] h-full bg-gradient-to-br from-slate-900 via-[#1b0324] to-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 text-white shadow-md flex flex-col justify-between">
            <div>
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-pink-950/70 border border-pink-500/30 px-2 py-0.5 rounded-md">
                  {featured.categoryLabel}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {featured.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-2">
                {featured.heading}
              </h3>

              {previewPdf ? (
                <div className="mt-3 h-[220px] sm:h-[245px] w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-inner">
                  {pdfPreviewVisible ? (
                  <iframe
                    src={`${previewPdf}#page=1&zoom=page-fit`}
                    title={`${featured.heading} PDF preview`}
                    loading="lazy"
                    className="h-full w-full border-none bg-white"
                  />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPdfPreviewVisible(true)}
                      className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm font-semibold text-white hover:bg-white/5"
                    >
                      <span className="text-2xl" aria-hidden="true">📄</span>
                      <span>Load PDF preview</span>
                      <span className="text-xs font-normal text-slate-300">Open or download the notice below</span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {featured.summary}
                </p>
              )}
            </div>

            {/* Bottom Action Area */}
            <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Source Authority</span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Zint Academic Board
                </span>
              </div>

              {previewPdf ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href={previewPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                  <a
                    href={previewPdf}
                    download
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8B1C8D] to-[#B11FA8] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-400">Select an update to preview its PDF here.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
