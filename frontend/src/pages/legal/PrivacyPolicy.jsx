export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            ZINT Institute
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Privacy Policy
          </h1>

          <p className="mt-5 text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            At ZINT Institute, we are committed to protecting your privacy and
            ensuring that your personal information remains secure. Please read
            our Privacy Policy carefully to understand how we collect, use, and
            protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-5">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">

          {/* Introduction */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Privacy Matters
            </h2>

            <p className="text-gray-600 leading-8">
              By enrolling in our courses or using our services, you agree to
              the terms outlined in this Privacy Policy. We value your trust and
              are committed to handling your information responsibly and
              transparently.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">

            {/* 1 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h3>

              <p className="text-gray-600 leading-8">
                We may collect your name, contact details, address,
                educational information, ID proof (if required), course
                details, and payment information for admission and academic
                purposes.
              </p>
            </div>

            {/* 2 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Use of Information
              </h3>

              <p className="text-gray-600 mb-4">
                Your information may be used to:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-7">
                <li>Process admissions and maintain student records.</li>
                <li>
                  Conduct classes, examinations, and placement activities.
                </li>
                <li>
                  Send updates regarding courses, fees, schedules, and new
                  programs.
                </li>
                <li>Improve our services and overall student experience.</li>
              </ul>
            </div>

            {/* 3 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Information Security
              </h3>

              <p className="text-gray-600 leading-8">
                We implement appropriate technical and organizational security
                measures to protect your personal information. Access to your
                information is restricted to authorized staff only.
              </p>
            </div>

            {/* 4 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4. Confidentiality
              </h3>

              <p className="text-gray-600 leading-8">
                Your personal information will not be sold or shared with any
                third party without your consent, except where required by law
                or for official academic purposes.
              </p>
            </div>

            {/* 5 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                5. Communication
              </h3>

              <p className="text-gray-600 leading-8">
                By registering with ZINT Institute, you consent to receive
                calls, SMS, WhatsApp messages, and emails related to admissions,
                classes, examinations, placements, important updates, and
                promotional offers.
              </p>
            </div>

            {/* 6 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6. Online Payments
              </h3>

              <p className="text-gray-600 leading-8">
                Online payments are processed through secure payment gateways.
                ZINT Institute does not store your card details, UPI PIN, CVV,
                or banking passwords.
              </p>
            </div>

            {/* 7 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7. Changes to this Policy
              </h3>

              <p className="text-gray-600 leading-8">
                ZINT Institute reserves the right to update this Privacy Policy
                at any time. Any changes will become effective immediately upon
                publication on our website.
              </p>
            </div>

            {/* 8 */}
            <div className="border-l-4 border-indigo-600 pl-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                8. Policy Updates
              </h3>

              <p className="text-gray-600 leading-8">
                This Privacy Policy may be updated from time to time. We
                encourage you to review this page regularly whenever you visit
                our website to stay informed about how your information is
                protected.
              </p>
            </div>

          </div>

          {/* Footer Note */}
          <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-indigo-700 mb-2">
              Contact Us
            </h4>

            <p className="text-gray-700 leading-7">
              If you have any questions regarding this Privacy Policy or the way
              your information is handled, please contact ZINT Institute. We are
              committed to addressing your concerns promptly and transparently.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}