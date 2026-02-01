// "use client";

// import { useState } from "react";

// export default function ChunkUploadPage() {
//   const [form, setForm] = useState({
//     book: "Fathul Mueen",
//     topic: "",
//     subtopic: "",
//     chunkId: "",
//     order: "",
//     text: "",
//   });
//   const [loading, setLoading] = useState(false);

//   async function submit() {
//     setLoading(true);
//     const res = await fetch("/api/upload", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ...form,
//         order: form.order ? Number(form.order) : undefined,
//       }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (!res.ok) {
//       alert("Error: " + data.error);
//       return;
//     }

//     alert("Saved! Chunk ID: " + data.chunkId);
//     setForm({ ...form, text: "" });
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 sm:p-10">
//       <h2 className="text-2xl font-bold mb-6 text-center">Fiqh Chunk Upload</h2>

//       <div className="grid gap-4">
//         <input
//           value={form.topic}
//           placeholder="Topic (required)"
//           onChange={(e) => setForm({ ...form, topic: e.target.value })}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <input
//           value={form.subtopic}
//           placeholder="Subtopic"
//           onChange={(e) => setForm({ ...form, subtopic: e.target.value })}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <input
//           value={form.chunkId}
//           placeholder="Chunk ID (auto if empty)"
//           onChange={(e) => setForm({ ...form, chunkId: e.target.value })}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <input
//           value={form.order}
//           placeholder="Order (optional)"
//           onChange={(e) => setForm({ ...form, order: e.target.value })}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <textarea
//           value={form.text}
//           placeholder="Paste Arabic fiqh text here"
//           rows={12}
//           onChange={(e) => setForm({ ...form, text: e.target.value })}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//         />
//       </div>

//       <button
//         onClick={submit}
//         disabled={loading}
//         className="mt-6 w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//       >
//         {loading ? "Saving..." : "Save Chunk"}
//       </button>
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";

export default function ChunkUploadPage() {
  const [form, setForm] = useState({
    book: "Fathul Mueen",
    topic: "",
    subtopic: "",
    chunkId: "",
    order: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.topic.trim() || !form.text.trim()) {
      setMessage({
        type: "error",
        text: "Topic and Arabic text are required",
      });
      formRef.current?.querySelector("#topic")?.focus();
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          order: form.order ? Number(form.order) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      setMessage({
        type: "success",
        text: `Saved successfully! Chunk ID: ${data.chunkId}`,
      });

      // Reset fields after success
      setForm((prev) => ({
        ...prev,
        text: "",
        chunkId: "",
      }));

      // Focus textarea again for next entry
      textareaRef.current?.focus();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus textarea after successful save
  useEffect(() => {
    if (message?.type === "success") {
      textareaRef.current?.focus();
    }
  }, [message]);

  const textLength = form.text.length;
  const maxLength = 10000;
  const isDisabled = loading || !form.topic.trim() || !form.text.trim();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-10 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Fiqh Chunk Upload
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
          {form.book}
        </p>

        {/* Native form – Enter key works */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Topic */}
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              value={form.topic}
              onChange={handleChange}
              placeholder="Main topic (required)"
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
            />
          </div>

          {/* Subtopic */}
          <div>
            <label
              htmlFor="subtopic"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Subtopic
            </label>
            <input
              id="subtopic"
              name="subtopic"
              type="text"
              value={form.subtopic}
              onChange={handleChange}
              placeholder="Optional subtopic"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
            />
          </div>

          {/* Chunk ID + Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="chunkId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Chunk ID
              </label>
              <input
                id="chunkId"
                name="chunkId"
                type="text"
                value={form.chunkId}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Order
              </label>
              <input
                id="order"
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
                placeholder="Optional number"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Arabic Text */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Fiqh Text (Arabic) <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-xs sm:text-sm ${
                  textLength > maxLength * 0.9 ? "text-red-600" : "text-gray-500"
                }`}
              >
                {textLength} / {maxLength.toLocaleString()}
              </span>
            </div>

            <textarea
              id="text"
              name="text"
              ref={textareaRef}
              value={form.text}
              onChange={handleChange}
              placeholder="Paste Arabic fiqh text here..."
              rows={10}
              maxLength={maxLength}
              dir="auto"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base resize-y min-h-[180px] leading-relaxed shadow-sm transition-all font-serif"
            />
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center text-sm font-medium border ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`
              mt-8 w-full py-4 px-6 text-lg font-semibold rounded-xl
              transition-all duration-200 active:scale-[0.98]
              ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                    stroke="currentColor"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Chunk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}