import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleCheck,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const values = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Quality, Practical & Career-Oriented Training",
    description: "Our vision is to provide quality, practical, and career-oriented training that prepares students to meet evolving industry requirements and emerging career opportunities. We are committed to continuously updating our training programs in line with emerging technologies, modern industry trends, and the changing demands of the digital world.",
    color: "text-cyan-300", glow: "bg-cyan-400/15", line: "bg-cyan-300",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Beyond Classroom Training",
    description: "At ZINT Institute, our focus goes beyond classroom training. Through practical learning, live projects, industry-relevant skills, career guidance, and placement support, we strive to help students move confidently towards their career goals.",
    color: "text-violet-300", glow: "bg-violet-400/15", line: "bg-violet-300",
  },
  {
    icon: BriefcaseBusiness,
    number: "03",
    title: "Every Student Has Potential",
    description: "We believe that every student has the potential to build a successful career. Our vision is to create a dynamic learning environment where students continuously learn, stay updated with the latest technologies, develop their skills and confidence, and prepare themselves for opportunities in employment, freelancing, and entrepreneurship.",
    color: "text-fuchsia-300", glow: "bg-fuchsia-400/15", line: "bg-fuchsia-300",
  },
];

const proofPoints = [
  ["Skilled", "Build practical, in-demand skills"],
  ["Confident", "Grow with guidance and support"],
  ["Future-ready", "Prepare for emerging opportunities"],
];

export default function OurValues() {
  return (
    <section className="overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="our-values-heading">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#10071e] shadow-2xl shadow-violet-950/20 sm:rounded-[2.75rem]">
        <div className="relative isolate overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_12%,rgba(34,211,238,.20),transparent_25%),radial-gradient(circle_at_88%_82%,rgba(217,70,239,.20),transparent_28%),linear-gradient(135deg,#12071f_0%,#1d0b35_52%,#10071e_100%)]" />
          <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-6 top-24 -z-10 h-44 w-44 rounded-full border border-white/10" />

          <div className="grid gap-14 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.32fr)] lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3.5 py-2 text-sm font-bold text-fuchsia-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Our vision
              </div>
              <h2 id="our-values-heading" className="mt-6 max-w-xl text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[3.45rem]">
                Building skilled, confident, <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">future-ready professionals.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-violet-100/75 sm:text-lg">
                ZINT Institute envisions becoming a leading centre of excellence in education and skill development, where students are empowered to become skilled, confident, industry-ready, and future-ready professionals.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {proofPoints.map(([value, label], index) => (
                  <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-5">
                    <div className={`absolute inset-x-0 top-0 h-0.5 ${index === 0 ? "bg-cyan-300" : index === 1 ? "bg-violet-300" : "bg-fuchsia-300"}`} />
                    <p className="text-lg font-black tracking-tight text-white sm:text-xl">{value}</p>
                    <p className="mt-1 text-[10px] font-medium leading-4 text-violet-100/60 sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-violet-100/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"><CircleCheck className="h-4 w-4 text-cyan-300" aria-hidden="true" /></span>
                Empowering Skills • Enabling Careers • Building a Brighter Future
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-5 left-[1.45rem] top-5 w-px bg-gradient-to-b from-cyan-300 via-violet-300 to-fuchsia-300 sm:left-7" />
              <div className="space-y-4 sm:space-y-5">
                {values.map(({ icon: Icon, number, title, description, color, glow, line }) => (
                  <article key={title} className="group relative rounded-3xl border border-white/10 bg-white/[0.055] p-5 pl-16 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.10] sm:p-7 sm:pl-20">
                    <div className={`absolute left-3 top-5 flex h-9 w-9 items-center justify-center rounded-xl ${glow} ring-1 ring-white/15 sm:left-5 sm:top-7 sm:h-10 sm:w-10`}>
                      <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`text-[11px] font-extrabold tracking-[0.2em] ${color}`}>VISION {number}</span>
                        <h3 className="mt-1.5 text-xl font-extrabold leading-snug text-white sm:text-2xl">{title}</h3>
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div className={`mt-4 h-px w-12 ${line} opacity-70`} />
                    <p className="mt-4 text-sm leading-6 text-violet-100/70 sm:text-[15px] sm:leading-7">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
