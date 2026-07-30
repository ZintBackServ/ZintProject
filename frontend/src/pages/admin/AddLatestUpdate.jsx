import React, { useState } from "react";

const AddLatestUpdate = () => {
  const [heading, setHeading] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Please select a valid PDF file." });
      setPdfFile(null);
      e.target.value = "";
      return;
    }
    setPdfFile(file || null);
    setMessage(null);
  };

  const resetForm = () => {
    setHeading("");
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!heading.trim()) {
      setMessage({ type: "error", text: "Heading is required." });
      return;
    }
    if (!pdfFile) {
      setMessage({ type: "error", text: "PDF file is required." });
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading.trim());
    formData.append("pdf", pdfFile);

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updates/addUpdate`, {
        method: "POST",
        body: formData,
      });

      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        // not valid JSON
      }

      if (!res.ok) {
        throw new Error(data?.msg || `Request failed with status ${res.status}`);
      }
      if (!data) {
        throw new Error("Server returned an empty or invalid response.");
      }

      setMessage({ type: "success", text: data.msg || "Update added successfully!" });
      resetForm();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to add update." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 sm:mt-10 bg-white rounded-2xl shadow-md shadow-black/5 px-5 py-6 sm:px-7 sm:py-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 sm:mb-6">
        Add Latest Update
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="heading" className="text-sm font-semibold text-gray-700">
            Heading
          </label>
          <input
            id="heading"
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. National Seminar on Social Media and Human Life"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700 transition-colors"
          />
        </div>

        {/* PDF Upload */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pdf" className="text-sm font-semibold text-gray-700">
            PDF File
          </label>
          <input
            id="pdf"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-xs sm:text-sm text-gray-600 file:mr-3 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-900 hover:file:bg-purple-200 file:cursor-pointer cursor-pointer"
          />
          {pdfFile && (
            <p className="text-xs text-gray-500 mt-1 break-all">
              Selected: {pdfFile.name}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto mt-2 bg-purple-900 text-white border-none px-5 py-3 rounded-full font-semibold cursor-pointer hover:bg-purple-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Add Update"}
        </button>
      </form>
    </div>
  );
};

export default AddLatestUpdate;