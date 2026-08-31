import React, { useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles } from "lucide-react";

const homeFaqs = [
  {
    q: "1. What courses does ZINT Institute offer?",
    a: "ZINT Institute offers a wide range of career-oriented courses, including Tally Prime & GST, Advanced Excel, Data Analytics, Data Science, Full Stack Development, AI/ML, Digital Marketing, Graphic Designing, Web Designing, PGDCA, DCA, CPCT, and other computer skill programs."
  },
  {
    q: "2. Are ZINT Institute courses suitable for beginners?",
    a: "Yes. Our courses are designed for both beginners and learners with prior knowledge. Training is provided step-by-step, from fundamentals to advanced concepts."
  },
  {
    q: "3. What is the duration of the courses?",
    a: "Course duration varies depending on the selected program. Students are provided with complete information about the course duration, syllabus, and training structure before admission."
  },
  {
    q: "4. Does ZINT Institute provide practical training?",
    a: "Yes. ZINT Institute focuses on practical, project-based, and skill-oriented learning along with theoretical concepts."
  },
  {
    q: "5. Will I receive a certificate after completing the course?",
    a: "Yes. Students who fulfill the applicable academic requirements, attendance criteria, and institute certificate policy are eligible to receive a course completion certificate."
  },
  {
    q: "6. Does ZINT Institute provide placement assistance?",
    a: "Yes. ZINT Institute provides placement assistance and career support to eligible students through job opportunities, interviews, and placement drives. However, selection by any particular company is not guaranteed."
  },
  {
    q: "7. Does ZINT Institute guarantee a job or internship?",
    a: "No. The institute provides career guidance, skill development, and placement assistance but does not guarantee an internship, offer letter, joining letter, salary, or selection by any specific company."
  },
  {
    q: "8. Who can join ZINT Institute?",
    a: "Eligibility depends on the selected course. Students, graduates, job seekers, and working professionals can enroll in various programs according to the eligibility requirements of the respective course."
  },
  {
    q: "9. Is a demo class available?",
    a: "Yes. Demo classes or counselling sessions may be available for selected courses. Students can contact the institute for the latest demo class schedule."
  },
  {
    q: "10. What are the course fees?",
    a: "Course fees vary depending on the program, duration, and curriculum. Please contact the ZINT Institute admission team for the latest fee structure."
  },
  {
    q: "11. Is the fee payable in installments?",
    a: "Installment facilities may be available for selected courses as per the institute's applicable fee policy. The terms will be communicated at the time of admission."
  },
  {
    q: "12. What is the attendance requirement?",
    a: "Students are required to maintain a minimum of 85% attendance during the course period. Failure to meet the attendance requirement may affect course completion or certificate eligibility as per institute policy."
  },
  {
    q: "13. Does ZINT Institute provide career guidance?",
    a: "Yes. Students receive guidance related to course selection, skill development, interview preparation, career opportunities, and professional growth."
  },
  {
    q: "14. How can I take admission at ZINT Institute?",
    a: "You can contact the ZINT Institute admission team for counselling, course details, fees, and batch schedules, or visit the institute campus for further assistance."
  },
  {
    q: "15. Why should I choose ZINT Institute?",
    a: "ZINT Institute focuses on practical learning, industry-relevant skills, experienced trainers, project-based training, and career support to help students develop the skills required for their professional success."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = homeFaqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative w-full py-20 sm:py-24 bg-gradient-to-b from-[#090212] via-[#0d0317] to-[#090212] text-white overflow-hidden border-t border-purple-900/30">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[700px] rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-[#53BFEA]/10 blur-[130px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-purple-950/40">
            <Sparkles className="w-3.5 h-3.5 text-[#53BFEA]" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything You Need To Know
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Find official answers to questions regarding courses, practical training, certificates, fees, attendance, and admissions at ZINT Institute.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/[0.05] border border-white/15 focus:border-[#B11FA8] focus:bg-white/[0.08] focus:outline-none text-white placeholder-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-white/[0.02] border border-white/10 rounded-2xl">
              <p className="text-slate-400 text-sm">No matching questions found for "{searchQuery}".</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-gradient-to-r from-purple-950/40 via-[#130626] to-purple-950/40 border-purple-500/50 shadow-xl shadow-purple-950/40"
                      : "bg-[#120521]/70 border-white/10 hover:border-purple-500/30 hover:bg-[#150727]"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 text-base sm:text-lg font-bold text-white hover:text-purple-200 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <div
                      className={`p-2 rounded-full border transition-all duration-300 shrink-0 ${
                        isOpen
                          ? "bg-[#B11FA8] border-[#B11FA8] text-white rotate-180 shadow-md shadow-purple-500/30"
                          : "bg-purple-950/60 border-purple-500/30 text-purple-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-purple-900/30 pt-4 bg-purple-950/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
