// import {useState, useEffect} from "react";


function About() {
  return (
   <>
     <h1>About</h1>
     <div className="bg-white p-4 rounded-xl shadow animate-pulse">
      <div className="h-40 bg-gray-200 rounded-lg"></div>

      <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-3 bg-gray-200 rounded w-full"></div>
      <div className="mt-2 h-3 bg-gray-200 rounded w-5/6"></div>

      <div className="mt-4 h-8 bg-gray-200 rounded"></div>
     </div>
    {/* <div className="bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="inline-flex items-center gap-2 hover:text-amber-300" href="tel:+919876543210"><Phone className="h-4 w-4" />+91 98765 43210</a><a className="inline-flex items-center gap-2 hover:text-amber-300" href="mailto:info@zinstitute.in"><Mail className="h-4 w-4" />info@zinstitute.in</a><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />Main Campus, New Delhi</span></div><div className="flex gap-3"><a className="rounded-full border border-white/10 p-2 hover:bg-green-500" href="https://wa.me/919876543210"><MessageCircle className="h-4 w-4" /></a><a className="rounded-full border border-white/10 p-2 hover:bg-sky-500" href="https://facebook.com"><FaFacebook className="h-4 w-4" /></a><a className="rounded-full border border-white/10 p-2 hover:bg-rose-500" href="https://instagram.com"><Instagram className="h-4 w-4" /></a></div></div></div> */}
   </>
  );
};

export default About;