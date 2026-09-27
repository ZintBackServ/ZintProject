function Career() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6h16M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          No Openings Right Now
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          We don't have any open positions at the moment, but we're always on
          the lookout for great people. Check back soon or reach out to us
          directly.
        </p>

        <a
          href="mailto:zintinstitute@gmail.com"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-6 py-3 rounded-xl transition"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}

export default Career;