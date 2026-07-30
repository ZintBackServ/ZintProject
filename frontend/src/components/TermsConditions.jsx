import React from "react";

export default function TermsOfService() {
  const PRIMARY = "#8E1387";
  const SECONDARY = "#B11FA8";
  const BLUE = "#53BFEA";
  const GREEN = "#45B51D";

  const terms = [
    {
      title: "1. Admission",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Admission is confirmed only after successful document verification
            and receipt of the applicable fees.
          </li>
          <li>
            ZINT Institute reserves the right to accept or reject any admission
            application without assigning any reason.
          </li>
          <li>
            Any false, misleading, or incomplete information provided during
            admission may result in cancellation of admission.
          </li>
        </ul>
      ),
    },
    {
      title: "2. Fees & Payment",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            All course fees must be paid on or before the scheduled due dates.
          </li>
          <li>
            EMI facilities, if offered, must be paid according to the agreed
            payment schedule.
          </li>
          <li>
            Failure to make timely payments may result in late fees, suspension
            of classes, withholding of certificates, examinations, placement
            assistance, or cancellation of admission.
          </li>
          <li>
            All payments made to ZINT Institute are subject to the Institute's
            Refund Policy.
          </li>
        </ul>
      ),
    },
    {
      title: "3. Attendance & Academic Responsibilities",
      content: (
        <>
          <p className="mb-3 font-medium">
            Students are expected to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Attend classes regularly.</li>
            <li>Complete assignments, projects, and assessments on time.</li>
            <li>Follow the academic schedule issued by the Institute.</li>
            <li>Maintain discipline throughout the course.</li>
          </ul>
          <p>
            The Institute is not responsible for missed classes due to the
            student's absence or personal reasons.
          </p>
        </>
      ),
    },
    {
      title: "4. Student Code of Conduct",
      content: (
        <>
          <p className="mb-3 font-medium">Students shall:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Respect faculty members, staff, and fellow students.</li>
            <li>Maintain proper discipline and professional behavior.</li>
            <li>
              Refrain from harassment, abusive language, discrimination,
              violence, or misconduct.
            </li>
            <li>Avoid damaging Institute property or equipment.</li>
          </ul>
          <p>
            Violation of these rules may result in disciplinary action,
            suspension, or termination of admission without refund.
          </p>
        </>
      ),
    },
    {
      title: "5. Study Material & Intellectual Property",
      content: (
        <>
          <p className="mb-3">
            All study materials, notes, videos, software, projects,
            assignments, presentations, logos, branding, website content, and
            training resources provided by ZINT Institute are the exclusive
            intellectual property of the Institute.
          </p>

          <p className="mb-3 font-medium">Students shall not:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Copy or reproduce materials.</li>
            <li>Record lectures without permission.</li>
            <li>Sell, distribute, upload, or share course content.</li>
            <li>
              Use Institute content for commercial purposes without prior
              written permission.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "6. Certificates",
      content: (
        <>
          <p className="mb-3">
            Course completion certificates will be issued only after the
            student:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Successfully completes the course requirements.</li>
            <li>Clears all pending dues.</li>
            <li>Completes required projects and assessments.</li>
            <li>Meets attendance requirements, where applicable.</li>
          </ul>
        </>
      ),
    },
    {
      title: "7. Placement Assistance",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>ZINT Institute provides Placement Assistance only.</li>
          <li>
            The Institute does not guarantee employment, salary, or placement.
          </li>
          <li>
            Final selection depends on the student's skills, performance,
            interview results, and employer requirements.
          </li>
        </ul>
      ),
    },
    {
      title: "8. Online Learning",
      content: (
        <>
          <p className="mb-3">
            Students attending online classes are responsible for:
          </p>

          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Maintaining a stable internet connection.</li>
            <li>Arranging suitable devices for learning.</li>
            <li>Keeping login credentials secure.</li>
          </ul>

          <p>
            ZINT Institute shall not be liable for interruptions caused by
            internet failure, power outages, or technical issues beyond its
            control.
          </p>
        </>
      ),
    },
    {
      title: "9. Privacy",
      content:
        "Personal information collected by ZINT Institute will be processed in accordance with the Institute's Privacy Policy.",
    },
    {
      title: "10. Modification of Terms",
      content:
        "ZINT Institute reserves the right to modify, update, or revise these Terms of Service at any time. Updated Terms shall become effective immediately upon publication on the official website or through official communication channels.",
    },
    {
      title: "11. Limitation of Liability",
      content: (
        <>
          <p className="mb-3">
            ZINT Institute shall not be liable for any indirect, incidental,
            consequential, financial, or personal losses arising from:
          </p>

          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Student absenteeism.</li>
            <li>Personal circumstances.</li>
            <li>Technical failures beyond the Institute's control.</li>
            <li>Delays caused by third-party service providers.</li>
            <li>Employment decisions made by hiring companies.</li>
          </ul>

          <p>
            Refunds, if applicable, shall be governed by the Institute's Refund
            Policy.
          </p>
        </>
      ),
    },
    {
      title: "12. Governing Law & Jurisdiction",
      content:
        "These Terms shall be governed by the laws of India. Any dispute arising out of these Terms or the services provided by ZINT Institute shall be subject to the exclusive jurisdiction of the competent courts located in Gwalior, Madhya Pradesh, India.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white relative z-10">
          <div
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium mb-6"
            style={{ background: "rgba(255,255,255,.15)" }}
          >
            ZINT Institute
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Terms of Service
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-base md:text-lg leading-8 text-purple-100">
            These Terms govern your admission, access to our website, online
            and offline training programs, and all services offered by ZINT
            Institute. By enrolling in any course or using our services, you
            agree to comply with these Terms.
          </p>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
          style={{ background: BLUE }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: GREEN }}
        />
      </section>

      {/* Terms */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8">
            {terms.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(to right, ${PRIMARY}, ${SECONDARY}, ${BLUE})`,
                  }}
                />

                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: PRIMARY }}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h2
                        className="text-xl md:text-2xl font-bold mb-4"
                        style={{ color: PRIMARY }}
                      >
                        {item.title}
                      </h2>

                      <div className="text-gray-700 leading-8">
                        {typeof item.content === "string" ? (
                          <p>{item.content}</p>
                        ) : (
                          item.content
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Notice */}
          <div
            className="mt-12 rounded-2xl p-8 text-white"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
            }}
          >
            <h3 className="text-2xl font-bold mb-3">
              Acceptance of Terms
            </h3>

            <p className="leading-8 text-purple-100">
              By enrolling in any course, making a payment, or accessing any
              services provided by ZINT Institute, you acknowledge that you
              have read, understood, and agreed to these Terms of Service. We
              encourage you to review these Terms periodically, as they may be
              updated from time to time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}