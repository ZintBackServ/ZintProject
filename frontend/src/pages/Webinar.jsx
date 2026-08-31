import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Sparkles,
  Search,
  Users,
  PlayCircle,
  ChevronDown,
  X,
  Star,
  Zap,
  BookOpen,
  Briefcase,
} from "lucide-react";

const Webinar = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "Student",
    interest: "Full Stack Web Development",
  });

  // Currently no live webinars scheduled
  const webinars = [];

  const faqs = [
    {
      q: "Are these webinars completely free to attend?",
      a: "Yes! All Zint Live Webinars are 100% free of cost. We believe in providing accessible, high-quality technical education to everyone.",
    },
    {
      q: "Are session recordings and source code files provided?",
      a: "Yes! All participants get access to session recordings, source code repositories, slide decks, and project cheatsheets.",
    },
    {
      q: "How will I join the live session when a new webinar is announced?",
      a: "Once you register for an upcoming session, you will receive calendar invites and direct access links via Email and WhatsApp.",
    },
    {
      q: "Who can attend these webinars?",
      a: "Anyone! Whether you are a college student, fresh graduate, working professional looking for a career transition, or tech enthusiast, you are welcome to join.",
    },
  ];

  const handleOpenRegisterModal = (webinar) => {
    setSelectedWebinar(webinar);
    setFormSubmitted(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const filteredWebinars = webinars.filter((w) => {
    const matchesCategory =
      activeTab === "all" ||
      (activeTab === "upcoming" && w.status === "upcoming") ||
      (activeTab === "recorded" && w.status === "recorded") ||
      w.category === activeTab;

    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* ── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
        {/* Glow backdrop elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>LIVE & INTERACTIVE TECH WEBINARS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Transform Your Career With{" "}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
                Expert-Led Webinars
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed font-light">
              Join free live webinars, hands-on coding sessions, and career guidance sessions hosted by industry leaders from top tech firms.
            </p>

            {/* Quick Stats Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xl sm:text-2xl">
                  <Users className="w-5 h-5 text-purple-400" /> 1200+
                </div>
                <div className="text-xs text-slate-400 font-medium">Students Enrolled</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl sm:text-2xl">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 4.9 / 5.0
                </div>
                <div className="text-xs text-slate-400 font-medium">Average Student Rating</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl sm:text-2xl">
                  <BookOpen className="w-5 h-5 text-emerald-400" /> 100% Free
                </div>
                <div className="text-xs text-slate-400 font-medium">Live Webinars</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-xl sm:text-2xl">
                  <Zap className="w-5 h-5 text-fuchsia-400" /> Live Q&A
                </div>
                <div className="text-xs text-slate-400 font-medium">Direct Mentor Interaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NO WEBINARS CURRENTLY SCHEDULED BANNER ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border border-purple-500/30 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl shadow-purple-950/40 backdrop-blur-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
            <Video className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            No Live Webinars Currently Scheduled
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our team is preparing the next lineup of live technical webinars. Stay tuned for upcoming announcements!
          </p>
        </div>
      </section>

      {/* ── 3. SEARCH & CATEGORY FILTER TABS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Explore All Webinars</h3>
            <p className="text-slate-400 text-sm mt-1">Browse live upcoming webinars and recorded video archives</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search webinars or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800/80 mb-8">
          {[
            { id: "all", label: "All Sessions" },
            { id: "upcoming", label: "🔴 Upcoming Live" },
            { id: "recorded", label: "📹 Watch Recorded" },
            { id: "webdev", label: "Full Stack & AI" },
            { id: "datascience", label: "Data Science" },
            { id: "cyber", label: "Cyber Security" },
            { id: "career", label: "Career Guidance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 4. WEBINAR CARDS GRID / EMPTY STATE ────────────────────────── */}
        {filteredWebinars.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-slate-300">No Webinars Currently Available</h4>
            <p className="text-slate-500 text-xs mt-1">Check back soon for new live webinars.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar) => (
              <div
                key={webinar.id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-purple-950/30 hover:-translate-y-1"
              >
                {/* Card Banner Header */}
                <div className={`relative h-40 bg-gradient-to-r ${webinar.imageGradient} p-5 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow ${
                        webinar.status === "upcoming"
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-950/80 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {webinar.status === "upcoming" ? "🔴 UPCOMING LIVE" : "RECORDED SESSION"}
                    </span>
                    <span className="text-xs font-semibold bg-slate-950/80 text-white px-2.5 py-1 rounded-md backdrop-blur-md">
                      {webinar.price}
                    </span>
                  </div>

                  <div className="z-10 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {webinar.rating} ({webinar.attendees})
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {webinar.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {webinar.description}
                    </p>
                  </div>

                  {/* Speaker Details */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                      {webinar.speaker.charAt(0)}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-white">{webinar.speaker}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{webinar.role}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{webinar.time}</span>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div>
                    {webinar.status === "upcoming" ? (
                      <button
                        onClick={() => handleOpenRegisterModal(webinar)}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Register For Free</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRegisterModal(webinar)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <PlayCircle className="w-4 h-4 text-cyan-400" />
                        <span>Watch Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. WHY ATTEND ZINT WEBINARS ───────────────────────────────── */}
      <section className="bg-slate-900/50 py-16 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">Why Attend Zint Webinars?</h2>
            <p className="text-slate-400 text-sm mt-2">
              Designed to deliver maximum career impact in interactive learning sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Live & Interactive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interact with expert instructors live, get your doubts cleared on the spot, and participate in real-time coding polls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hands-on Live Projects</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build production-grade applications live with industry mentors and add them directly to your portfolio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Free Learning Resources</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get instant access to complete source code, lecture slides, cheatsheets, and project repositories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Placement Guidance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get insider advice on resume building, referral networks, campus placement strategies, and tech interview prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACCORDION ────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-2">Have questions about our webinars? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openFaqIndex === index && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. REGISTRATION MODAL DIALOG ────────────────────────────────────── */}
      {isModalOpen && selectedWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!formSubmitted ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    Webinar Registration
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 line-clamp-2">
                    {selectedWebinar.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedWebinar.date} • {selectedWebinar.time}
                  </p>
                </div>

                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      WhatsApp Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Current Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="Student">College Student</option>
                        <option value="Fresher">Recent Graduate</option>
                        <option value="Working">Working Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Primary Interest
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="Full Stack Web Development">Web Development</option>
                        <option value="Python & AI">Data Science & AI</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Placement Prep">Campus Placement</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all mt-2 cursor-pointer"
                  >
                    Confirm My Free Registration
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    🔒 We respect your privacy. No spam ever. Link will be sent via Email & WhatsApp.
                  </p>
                </form>
              </div>
            ) : (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Registration Successful! 🎉</h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xs mx-auto">
                  Thank you,{" "}
                  <span className="font-semibold text-purple-300">{formData.fullName}</span>! We've
                  sent the webinar entry pass and calendar invite to{" "}
                  <span className="font-semibold text-cyan-300">{formData.email}</span>.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                  <p className="font-semibold text-slate-300">Next Steps:</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Join our official WhatsApp updates group for live alerts
                  </div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <CheckCircle className="w-4 h-4" /> Add event to your Google Calendar
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Webinar;
