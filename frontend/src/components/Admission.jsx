import { useState } from "react";



const STEPS = [
  "Academic Details",
  "Course Selection",
  "Documents",
  "Payment",
  "Review & Submit",
];

const COURSES = [
  { id: 1, name: "Full Stack Web Development", duration: "6 months", fee: "₹45,000", icon: "🖥️", tag: "Popular" },
  { id: 2, name: "Data Science & AI",           duration: "8 months", fee: "₹55,000", icon: "🤖", tag: "Trending" },
  { id: 3, name: "Cloud Computing (AWS)",        duration: "4 months", fee: "₹35,000", icon: "☁️", tag: "" },
  { id: 4, name: "Cyber Security",               duration: "5 months", fee: "₹40,000", icon: "🔐", tag: "New" },
  { id: 5, name: "DevOps & Docker",              duration: "4 months", fee: "₹38,000", icon: "⚙️", tag: "" },
  { id: 6, name: "Mobile App Development",       duration: "6 months", fee: "₹42,000", icon: "📱", tag: "" },
];

const TAG_COLOR = {
  Popular:  { bg: "#fdf2f8", text: "#be185d", border: "#fbcfe8" },
  Trending: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  New:      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:         "#fff5f8",
  card:       "#ffffff",
  primary:    "#e91e8c",
  primary2:   "#f43f9a",
  soft:       "#fce7f3",
  softBorder: "#f9a8d4",
  muted:      "#9d174d",
  mutedLight: "#fbcfe8",
  text:       "#1a0a12",
  textSub:    "#6b2150",
  textHint:   "#be85a6",
  success:    "#059669",
  successBg:  "#ecfdf5",
  successBdr: "#6ee7b7",
  warn:       "#b45309",
  warnBg:     "#fffbeb",
  warnBdr:    "#fcd34d",
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const baseInput = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${C.softBorder}`,
  background: "#fff",
  color: C.text,
  fontSize: 14,
  outline: "none",
  transition: "border-color .15s",
  boxSizing: "border-box",
};

function Label({ children }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5,
      color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </label>
  );
}

function Input({ label, placeholder, type = "text", value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...baseInput, borderColor: focus ? C.primary : C.softBorder }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}

function Sel({ label, value, onChange, children }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <select
        value={value}
        onChange={onChange}
        style={{ ...baseInput, borderColor: focus ? C.primary : C.softBorder, appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23e91e8c' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        {children}
      </select>
    </div>
  );
}


// ─── Step 1 — Academic Details ────────────────────────────────────────────────

function Step1({ data, set }) {
  const u = (k) => (e) => set({ ...data, [k]: e.target.value });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Sel label="Highest Qualification" value={data.qualification} onChange={u("qualification")}>
        <option value="">Select qualification</option>
        <option value="10th">10th (SSC)</option>
        <option value="12th">12th (HSC)</option>
        <option value="diploma">Diploma</option>
        <option value="ug">Under Graduate (UG)</option>
        <option value="pg">Post Graduate (PG)</option>
        <option value="pg">Others</option>
      </Sel>
      
      <Input label="Year of Passing"      placeholder="2024"             value={data.yearOfPassing} onChange={u("yearOfPassing")} />
      <Input label="Board / University"   placeholder="CBSE / Osmania"   value={data.board}         onChange={u("board")} />
      <Input label="Stream / Specialization" placeholder="Science / B.Tech (CSE)" value={data.stream} onChange={u("stream")} />
      <Sel   label="Employment Status"   value={data.employment} onChange={u("employment")}>
        <option value="">Select status</option>
        <option value="student">Student</option>
        <option value="fresher">Fresher</option>
        <option value="employed">Employed</option>
        <option value="self-employed">Self-Employed</option>
      </Sel>
    </div>
  );
}

// ─── Step 2 — Course Selection ────────────────────────────────────────────────

function Step2({ data, set }) {
  const u = (k) => (e) => set({ ...data, [k]: e.target.value });
  return (
    <div>
      <p style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>
        Select the course you want to enrol in:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {COURSES.map((c) => {
          const sel = data.course === c.id;
          return (
            <div
              key={c.id}
              onClick={() => set({ ...data, course: c.id })}
              style={{
                position: "relative",
                padding: "14px 14px 12px",
                borderRadius: 14,
                border: sel ? `2px solid ${C.primary}` : `1px solid ${C.softBorder}`,
                background: sel ? C.soft : "#fff",
                cursor: "pointer",
                transition: "all .18s",
                boxShadow: sel ? `0 0 0 3px ${C.soft}` : "none",
              }}
            >
              {c.tag && (
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: TAG_COLOR[c.tag].bg, color: TAG_COLOR[c.tag].text,
                  border: `1px solid ${TAG_COLOR[c.tag].border}`,
                }}>
                  {c.tag}
                </span>
              )}
              {sel && (
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  width: 18, height: 18, borderRadius: "50%",
                  background: C.primary, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 10, color: "#fff",
                }}>✓</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: C.textHint, margin: "2px 0 0" }}>{c.duration}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10,
                borderTop: `1px solid ${C.mutedLight}` }}>
                <span style={{ fontSize: 11, color: C.textSub }}>Course Fee</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{c.fee}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Sel label="Preferred Batch Timing" value={data.timing} onChange={u("timing")}>
        <option value="">Select timing</option>
        <option value="morning">Morning (7 AM – 10 AM)</option>
        <option value="afternoon">Afternoon (12 PM – 3 PM)</option>
        <option value="evening">Evening (5 PM – 8 PM)</option>
        <option value="weekend">Weekend Only</option>
      </Sel>
    </div>
  );
}

// ─── Step 3 — Documents ───────────────────────────────────────────────────────

function Step3({ data, set }) {
  const docs = [
    { key: "photo",     label: "Passport Photo",        hint: "JPG/PNG · max 2 MB" },
    { key: "idProof",   label: "Aadhaar / PAN Card",    hint: "PDF/JPG · max 5 MB" },
    
  ];
  return (
    <div>
      <p style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>
        Upload required documents. All files are securely stored.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {docs.map((doc) => (
          <div key={doc.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: 12,
            border: `1px solid ${C.softBorder}`, background: "#fff",
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{doc.label}</p>
              <p style={{ fontSize: 11, color: C.textHint, margin: "2px 0 0" }}>{doc.hint}</p>
            </div>
            <label style={{
              cursor: "pointer", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: data[doc.key] ? C.successBg : C.soft,
              border: `1px solid ${data[doc.key] ? C.successBdr : C.softBorder}`,
              color: data[doc.key] ? C.success : C.primary,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {data[doc.key] ? "✓ Uploaded" : "↑ Upload"}
              <input type="file" style={{ display: "none" }}
                onChange={(e) => e.target.files[0] && set({ ...data, [doc.key]: e.target.files[0].name })} />
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10,
        background: C.soft, border: `1px solid ${C.softBorder}` }}>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          🔒 Your documents are encrypted and securely stored. We never share your data with third parties.
        </p>
      </div>
    </div>
  );    
}

// ─── Step 5 — Payment ─────────────────────────────────────────────────────────

// Simple inline QR code using a public QR API (replace UPI ID as needed)
const UPI_ID   = "7879547759@ybl";
const UPI_NAME = "Shivam Savita";

function Step4({ payment, setPayment, courseData }) {
  const u = (k) => (e) => setPayment({ ...payment, [k]: e.target.value });
  const selectedCourse = COURSES.find((x) => x.id === courseData.course);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedCourse?.fee.replace(/[^0-9]/g, "") || ""}&cu=INR`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;

  return (
    <div>
      {/* QR section */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "24px 20px", borderRadius: 16, marginBottom: 20,
        background: "linear-gradient(145deg, #fff0f6, #fce7f3)",
        border: `1px solid ${C.softBorder}`,
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 4 }}>
          Scan &amp; Pay via UPI
        </p>
        {selectedCourse ? (
          <p style={{ fontSize: 22, fontWeight: 700, color: C.primary, marginBottom: 16 }}>
            {selectedCourse.fee}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: C.textHint, marginBottom: 16 }}>
            (Select a course first to see the amount)
          </p>
        )}

        {/* QR code image — sourced from free QR API */}
        <div style={{
          padding: 10, borderRadius: 14, background: "#fff",
          border: `2px solid ${C.softBorder}`,
          boxShadow: "0 4px 20px rgba(233,30,140,0.10)",
        }}>
          <img
            src={qrUrl}
            alt="UPI QR Code"
            width={180}
            height={180}
            style={{ display: "block", borderRadius: 6 }}
          />
        </div>

        <p style={{ fontSize: 12, color: C.textHint, marginTop: 12, textAlign: "center" }}>
          UPI ID: <strong style={{ color: C.primary }}>{UPI_ID}</strong>
        </p>
        <p style={{ fontSize: 11, color: C.textHint, marginTop: 4, textAlign: "center" }}>
          Pay using PhonePe · Google Pay · Paytm · Any UPI App
        </p>
      </div>

      {/* Payment details form */}
      <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
        After payment, fill in your transaction details:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Input
            label="UTR Number / Transaction ID"
            placeholder="12-digit transaction ID"
            value={payment.transactionId}
            onChange={u("transactionId")}
          />
        </div>
        <Input label="Sender UPI Name"   placeholder="Name on UPI account" value={payment.senderName}   onChange={u("senderName")} />
        <Input label="Amount Paid (₹)" placeholder="e.g. 45000"          value={`${selectedCourse?.fee.replace(/[^0-9]/g, "")}`}       onChange={u("amount")} />
        <Input label="Payment Date"      type="date"                        value={payment.paymentDate}  onChange={u("paymentDate")} />
        <Input label="Payment Time"      type="time"                        value={payment.paymentTime}  onChange={u("paymentTime")} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Label>Payment Screenshot</Label>
          <label style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px", borderRadius: 10, cursor: "pointer",
            border: `1.5px dashed ${payment.screenshot ? C.primary : C.softBorder}`,
            background: payment.screenshot ? C.soft : "#fafafa",
            color: payment.screenshot ? C.primary : C.textHint,
            fontSize: 13, fontWeight: 500,
          }}>
            {payment.screenshot ? `✓ ${payment.screenshot}` : "↑ Upload payment screenshot"}
            <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
              onChange={(e) => e.target.files[0] && setPayment({ ...payment, screenshot: e.target.files[0].name })} />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10,
        background: C.warnBg, border: `1px solid ${C.warnBdr}` }}>
        <p style={{ fontSize: 12, color: C.warn, margin: 0 }}>
          ⚠️ Do not close this page before completing the form. Admission is confirmed only after payment verification.
        </p>
      </div>
    </div>
  );
}

// ─── Step 6 — Review & Submit ─────────────────────────────────────────────────

function Step5({ personal, academic, course, payment }) {
  const sel = COURSES.find((x) => x.id === course.course);
  const rows = [
    ["Qualification",     academic.qualification   || "—"],
    ["Year of Passing",   academic.yearOfPassing   || "—"],
    ["Course",            sel?.name       || "—"],
    ["Duration",          sel?.duration   || "—"],
    ["Batch Timing",      course.timing   || "—"],
    ["Course Fee",        sel?.fee        || "—"],
    ["Transaction ID",    payment.transactionId || "—"],
    ["Sender Name",       payment.senderName    || "—"],
    ["Amount Paid",       payment.amount ? `₹${payment.amount}` : "—"],
    ["Payment Date",      payment.paymentDate   || "—"],
  ];

  return (
    <div>
      <p style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>
        Review all details before submitting your application.
      </p>
      <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.softBorder}` }}>
        {rows.map(([label, value], i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px",
            background: i % 2 === 0 ? "#fff" : C.soft,
            borderBottom: i < rows.length - 1 ? `1px solid ${C.mutedLight}` : "none",
          }}>
            <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start",
        padding: "14px 16px", borderRadius: 12, background: C.warnBg, border: `1px solid ${C.warnBdr}` }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <p style={{ fontSize: 12, color: C.warn, margin: 0, lineHeight: 1.6 }}>
          By submitting this form you agree to our Terms &amp; Conditions and Privacy Policy.
          Admission is subject to verification of submitted documents and payment.
        </p>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const STEP_ICONS = ["👤", "🎓", "📘", "📁", "💳", "✅"];

export default function App() {
  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [academic, setAcademic] = useState({
    qualification: "", percentage: "", yearOfPassing: "", board: "", stream: "", employment: "",
  });
  const [course,   setCourse]   = useState({ course: null, timing: "" });
  const [docs,     setDocs]     = useState({ photo: "", idProof: "" });
  const [payment,  setPayment]  = useState({
    transactionId: "", senderName: "", amount: "", paymentDate: "", paymentTime: "", screenshot: "",
  });

  const stepComponents = [
   
    <Step1 data={academic}  set={setAcademic} />,
    <Step2 data={course}    set={setCourse} />,
    <Step3 data={docs}      set={setDocs} />,
    <Step4 payment={payment} setPayment={setPayment} courseData={course} />,
    <Step5  academic={academic} course={course} payment={payment} />,
  ];

  const total = STEPS.length;

  function reset() {
    setStep(0); setSubmitted(false);
    setPersonal({ firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", address: "" });
    setAcademic({ qualification: "", percentage: "", yearOfPassing: "", board: "", stream: "", employment: "" });
    setCourse({ course: null, timing: "" });
    setDocs({ photo: "", idProof: "", marksheet: "", signature: "" });
    setPayment({ transactionId: "", senderName: "", amount: "", paymentDate: "", paymentTime: "", screenshot: "" });
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
            background: C.successBg, border: `2px solid ${C.successBdr}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
          }}>✓</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>
            Application Submitted!
          </h2>
          <p style={{ fontSize: 14, color: C.textSub, marginBottom: 6 }}>
            Your admission application has been received successfully.
          </p>
          <p style={{ fontSize: 13, color: C.textHint, marginBottom: 20 }}>
            Application ID:{" "}
            <strong style={{ color: C.primary }}>ADM-{Date.now().toString().slice(-6)}</strong>
          </p>
          <div style={{ padding: "14px 16px", borderRadius: 12, background: C.successBg,
            border: `1px solid ${C.successBdr}`, marginBottom: 24, textAlign: "left" }}>
            <p style={{ fontSize: 13, color: C.success, margin: 0 }}>
              📧 A confirmation email has been sent to{" "}
              <strong>{personal.email || "your email"}</strong>.
              Our team will contact you within 24–48 hours after verifying your payment.
            </p>
          </div>
          <button onClick={reset} style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            Apply for Another Course
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${C.softBorder}`,
        background: "#fff",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🎓</div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
              Online Admission Portal
            </h1>
            <p style={{ fontSize: 12, color: C.textHint, margin: 0 }}>
              Fill in your details to secure your seat
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 48px" }}>

        {/* Step indicator */}
        <div style={{ marginBottom: 32, position: "relative" }}>
          {/* Track line */}
          <div style={{
            position: "absolute", top: 18, left: 20, right: 20, height: 2,
            background: C.mutedLight, borderRadius: 2, zIndex: 0,
          }} />
          {/* Progress fill */}
          <div style={{
            position: "absolute", top: 18, left: 20, height: 2,
            background: `linear-gradient(90deg, ${C.primary}, ${C.primary2})`,
            borderRadius: 2, zIndex: 1,
            width: `calc(${(step / (total - 1)) * 100}% - 40px * ${step / (total - 1)})`,
            transition: "width .4s ease",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {STEPS.map((s, i) => {
              const done    = i < step;
              const current = i === step;
              return (
                <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, transition: "all .25s",
                    background: done ? C.success : current
                      ? `linear-gradient(135deg, ${C.primary}, ${C.primary2})`
                      : "#fff",
                    border: done || current ? "none" : `2px solid ${C.softBorder}`,
                    color: done || current ? "#fff" : C.textHint,
                    boxShadow: current ? `0 0 0 4px ${C.soft}` : "none",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: current ? 600 : 400,
                    color: current ? C.primary : C.textHint,
                    whiteSpace: "nowrap",
                  }}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          border: `1px solid ${C.softBorder}`,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(233,30,140,0.06)",
        }}>

          {/* Card header */}
          <div style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${C.mutedLight}`,
            background: "linear-gradient(135deg, #fff0f8, #fce7f3)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>
                Step {step + 1}: {STEPS[step]}
              </h2>
              <p style={{ fontSize: 12, color: C.textHint, margin: 0 }}>
                {step + 1} of {total} — {Math.round(((step + 1) / total) * 100)}% complete
              </p>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 22,
              background: C.soft, border: `1px solid ${C.softBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {STEP_ICONS[step]}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: C.mutedLight }}>
            <div style={{
              height: "100%",
              width: `${((step + 1) / total) * 100}%`,
              background: `linear-gradient(90deg, ${C.primary}, ${C.primary2})`,
              transition: "width .4s ease",
            }} />
          </div>

          {/* Form body */}
          <div style={{ padding: "24px" }}>
            {stepComponents[step]}
          </div>

          {/* Navigation */}
          <div style={{
            padding: "16px 24px",
            borderTop: `1px solid ${C.mutedLight}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fafafa",
          }}>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: `1px solid ${C.softBorder}`, background: "#fff",
                color: step === 0 ? C.mutedLight : C.textSub,
                cursor: step === 0 ? "default" : "pointer",
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
              ← Previous
            </button>

            {step < total - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                style={{
                  padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: "none", cursor: "pointer", color: "#fff",
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
                  boxShadow: `0 4px 14px rgba(233,30,140,0.3)`,
                }}
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: "none", cursor: "pointer", color: "#fff",
                  background: `linear-gradient(135deg, ${C.success}, #10b981)`,
                  boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                🚀 Submit Application
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: C.textHint, marginTop: 20 }}>
          🔒 Secure &amp; Encrypted · Need help? Call us at +91 98765 43210
        </p>
      </div>
    </div>
  );
}
