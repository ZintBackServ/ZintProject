import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-10 shadow-lg mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Refund & Payment Policy
          </h1>
          <p className="text-lg text-gray-100 leading-relaxed">
            At <span className="font-semibold">ZINT Institute</span>, we are
            committed to providing quality education with complete transparency
            and professionalism. Students and parents are advised to carefully
            read this Refund & Payment Policy before taking admission. By
            enrolling in any course at ZINT Institute, the student and parent
            acknowledge that they have read, understood, and accepted all the
            terms and conditions mentioned below.
          </p>
        </div>

        <div className="space-y-8">

          {/* Section 1 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              1. Admission Cancellation & Refund
            </h2>

            <ul className="list-disc ml-6 space-y-3 text-gray-700">
              <li>
                If a student cancels their admission before the commencement of
                classes, the Institute will refund the remaining course fee
                after deducting <strong>15% of the total course fee</strong> as
                a <strong>Non-Refundable Processing Fee.</strong>
              </li>

              <li>
                Approved refunds will be processed within
                <strong> 15 Working Days</strong> from the date of approval.
              </li>

              <li>
                Once online or offline classes have commenced, admission cannot
                be cancelled, and
                <strong> no refund shall be granted</strong> under any
                circumstances.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              2. No Refund Will Be Granted In The Following Cases
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>The student voluntarily withdraws or discontinues the course.</li>
              <li>The student remains absent from classes.</li>
              <li>
                The student is unable to complete the course due to personal,
                financial, medical, family, or any other reason.
              </li>
              <li>
                The student is suspended or expelled for violating the
                Institute's rules, regulations, or code of conduct.
              </li>
              <li>
                The student is dissatisfied with the course, faculty, teaching
                methodology, batch timing, placement assistance, or any other
                academic or administrative matter.
              </li>
              <li>
                The student requests cancellation of admission after classes
                have commenced.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              3. Batch Cancellation / Batch Adjustment
            </h2>

            <p className="text-gray-700 mb-4">
              If ZINT Institute is unable to conduct a batch due to
              administrative or unavoidable circumstances, the Institute may
              provide either:
            </p>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Admission in the next available batch of the same course.</li>
              <li>Adjustment to another available batch and timing.</li>
            </ul>

            <p className="mt-4 text-gray-700">
              Refund shall generally not be applicable in such cases unless
              specifically approved by the management in writing.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              4. Installment (EMI) Payment Policy
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>
                Students will be informed about payment modes, installment
                amounts, due dates, and payment terms during admission.
              </li>

              <li>
                Every installment must be paid on or before the scheduled due
                date.
              </li>

              <li>
                Once classes have commenced, timely payment of installments is
                the sole responsibility of the student.
              </li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-3">
              Failure to pay installments may result in:
            </h3>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Late payment charges.</li>
              <li>Suspension of classroom access.</li>
              <li>Restriction from examinations.</li>
              <li>Withholding of certificates.</li>
              <li>Suspension of placement assistance.</li>
              <li>Cancellation of admission, if deemed necessary.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              5. Information Before Admission
            </h2>

            <p className="text-gray-700 mb-4">
              Students and parents are advised to clarify all doubts before
              taking admission regarding:
            </p>

            <div className="grid md:grid-cols-2 gap-3 text-gray-700">
              <div>• Course Details</div>
              <div>• Course Duration</div>
              <div>• Fee Structure</div>
              <div>• Syllabus</div>
              <div>• Batch Timing</div>
              <div>• Training Process</div>
              <div>• Certification</div>
              <div>• Placement Assistance</div>
              <div>• Payment Terms & Conditions</div>
            </div>

            <p className="mt-5 text-gray-700">
              After admission, requests for cancellation or refund on the
              grounds of misunderstanding, dissatisfaction, change of mind,
              personal reasons, or lack of information shall not be accepted.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              6. Refund Request Procedure
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>
                Refund requests shall be accepted only if submitted in writing
                before the commencement of classes.
              </li>

              <li>
                Any refund request received after the prescribed period or after
                classes have commenced shall not be entertained.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              7. Non-Refundable Fees
            </h2>

            <div className="grid md:grid-cols-2 gap-3 text-gray-700">
              <div>• Registration Fee</div>
              <div>• Admission Fee</div>
              <div>• Processing Fee</div>
              <div>• Study Material Fee</div>
              <div>• Examination Fee</div>
              <div>• Practical/Lab Fee</div>
              <div>• Uniform Fee</div>
              <div>• Identity Card Fee</div>
              <div>• Administrative Charges</div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              8. Online Payment Policy
            </h2>

            <ul className="list-disc ml-6 space-y-3 text-gray-700">
              <li>
                Deduction of money from the student's bank account does not
                constitute successful payment.
              </li>

              <li>
                Admission shall be confirmed only after payment is successfully
                credited to the official bank account of ZINT Institute.
              </li>

              <li>
                Banking delays, payment gateway failures, or technical issues
                beyond the Institute's control shall not be the responsibility
                of ZINT Institute.
              </li>

              <li>
                Students must wait until the transaction is successfully
                completed and confirmed.
              </li>

              <li>
                Admission, fee receipt, and academic services will be activated
                only after payment confirmation.
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-purple-700 text-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-5">
              9. Declaration
            </h2>

            <p className="leading-8">
              I/We (Student and Parent/Guardian) hereby declare that we have
              carefully read, understood, and voluntarily accepted the Refund &
              Payment Policy of ZINT Institute before taking admission.
            </p>

            <div className="mt-6">
              <h3 className="font-semibold text-xl mb-3">
                I/We further agree that:
              </h3>

              <ul className="list-disc ml-6 space-y-2">
                <li>
                  No refund shall be claimed contrary to the terms mentioned
                  above.
                </li>

                <li>
                  The decision of ZINT Institute regarding refunds, payments,
                  batch adjustments, and related matters shall be final and
                  binding.
                </li>

                <li>
                  Any dispute arising out of admission shall be subject to the
                  jurisdiction of the competent courts of
                  <strong> Gwalior, Madhya Pradesh, India.</strong>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}