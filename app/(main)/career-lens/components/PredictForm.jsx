"use client";

import { useState } from "react";

export default function PredictForm() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your resume first!");

    setLoading(true);
    setPrediction("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.roles && result.roles.length > 0) {
        const roles = result.roles
          .map(([role, prob]) => `${role} (${(prob * 100).toFixed(1)}%)`)
          .join(", ");
        setPrediction(`Top Predicted Roles: ${roles}`);
      } else {
        setPrediction("No predictions found. Try another resume.");
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setPrediction("Error: Unable to connect to prediction server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-6 text-gray-200"
    >
      {/* Upload Box */}
      <label
        htmlFor="resume"
        className="cursor-pointer flex flex-col items-center justify-center w-full max-w-xl p-10 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 hover:border-zinc-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>

        <p className="text-gray-400 text-sm md:text-base">
          {file ? (
            <span className="text-gray-100 font-semibold">{file.name}</span>
          ) : (
            <>
              <span className="font-medium text-gray-200">Upload your resume</span>{" "}
              <span className="text-gray-500">(PDF / DOCX)</span>
            </>
          )}
        </p>
        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Predict Button */}
      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-400 text-black font-semibold hover:from-white hover:to-gray-300 shadow-lg hover:shadow-gray-700/30 transition-all"
      >
        {loading ? "Predicting..." : "Predict Job Role"}
      </button>

      {/* Result */}
      {prediction && (
        <div className="mt-6 w-full max-w-xl text-center bg-zinc-900 border border-zinc-800 p-5 rounded-xl text-gray-100 shadow-lg">
          {prediction}
        </div>
      )}
    </form>
  );
}
