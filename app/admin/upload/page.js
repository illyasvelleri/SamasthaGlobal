"use client";

import { useState, useRef } from "react";

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
  const [previewLoading, setPreviewLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  /* ------------------ PREVIEW TOPIC ------------------ */
  const handlePreview = async () => {
    if (!form.text.trim()) {
      setMessage({
        type: "error",
        text: "Arabic fiqh text is required for preview",
      });
      textareaRef.current?.focus();
      return;
    }

    setPreviewLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/upload/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: form.book,
          text: form.text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Preview failed");
      }

      setForm((prev) => ({
        ...prev,
        topic: data.topic || prev.topic,
        subtopic: data.subtopic || prev.subtopic,
      }));

      setMessage({
        type: "success",
        text: "Topic & subtopic generated (preview)",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Preview failed",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  /* ------------------ SAVE ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.topic.trim()) {
      setMessage({
        type: "error",
        text: "Topic is required. Use preview or enter manually.",
      });
      return;
    }

    if (!form.text.trim()) {
      setMessage({
        type: "error",
        text: "Arabic fiqh text is required",
      });
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      setForm((prev) => ({
        ...prev,
        text: "",
        chunkId: "",
      }));

      textareaRef.current?.focus();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const textLength = form.text.length;
  const maxLength = 10000;

  const isDisabled =
    loading || !form.text.trim() || !form.topic.trim();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold text-center mb-2">
          Fiqh Chunk Upload
        </h1>
        <p className="text-center text-gray-600 mb-6">{form.book}</p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Topic *
            </label>
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* Subtopic */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Subtopic
            </label>
            <input
              name="subtopic"
              value={form.subtopic}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* Arabic Text */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">
                Fiqh Text (Arabic) *
              </label>
              <span className="text-xs text-gray-500">
                {textLength}/{maxLength}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              name="text"
              value={form.text}
              onChange={handleChange}
              rows={10}
              maxLength={maxLength}
              className="w-full px-4 py-3 border rounded-xl font-serif"
            />
          </div>

          {/* Preview */}
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading}
            className="w-full py-3 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium"
          >
            {previewLoading ? "Generating preview..." : "Preview Topic"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-center text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-4 px-4 rounded-xl font-semibold ${
              isDisabled
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Chunk"}
          </button>
        </form>
      </div>
    </div>
  );
}



// "use client";

// import { useState, useRef, useEffect } from "react";

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
//   const [message, setMessage] = useState(null);

//   const formRef = useRef(null);
//   const textareaRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));

//     // Clear message when user starts typing
//     if (message) setMessage(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!form.topic.trim() || !form.text.trim()) {
//       setMessage({
//         type: "error",
//         text: "Topic and Arabic text are required",
//       });
//       formRef.current?.querySelector("#topic")?.focus();
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...form,
//           order: form.order ? Number(form.order) : undefined,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to save");
//       }

//       setMessage({
//         type: "success",
//         text: `Saved successfully! Chunk ID: ${data.chunkId}`,
//       });

//       // Reset fields after success
//       setForm((prev) => ({
//         ...prev,
//         text: "",
//         chunkId: "",
//       }));

//       // Focus textarea again for next entry
//       textareaRef.current?.focus();
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err.message || "Something went wrong. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-focus textarea after successful save
//   useEffect(() => {
//     if (message?.type === "success") {
//       textareaRef.current?.focus();
//     }
//   }, [message]);

//   const textLength = form.text.length;
//   const maxLength = 10000;
//   const isDisabled = loading || !form.topic.trim() || !form.text.trim();

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
//       <div className="max-w-2xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-10 flex-1">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
//           Fiqh Chunk Upload
//         </h1>
//         <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
//           {form.book}
//         </p>

//         {/* Native form – Enter key works */}
//         <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
//           {/* Topic */}
//           <div>
//             <label
//               htmlFor="topic"
//               className="block text-sm font-medium text-gray-700 mb-1.5"
//             >
//               Topic <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="topic"
//               name="topic"
//               type="text"
//               value={form.topic}
//               onChange={handleChange}
//               placeholder="Main topic (required)"
//               required
//               className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
//             />
//           </div>

//           {/* Subtopic */}
//           <div>
//             <label
//               htmlFor="subtopic"
//               className="block text-sm font-medium text-gray-700 mb-1.5"
//             >
//               Subtopic
//             </label>
//             <input
//               id="subtopic"
//               name="subtopic"
//               type="text"
//               value={form.subtopic}
//               onChange={handleChange}
//               placeholder="Optional subtopic"
//               className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
//             />
//           </div>

//           {/* Chunk ID + Order */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label
//                 htmlFor="chunkId"
//                 className="block text-sm font-medium text-gray-700 mb-1.5"
//               >
//                 Chunk ID
//               </label>
//               <input
//                 id="chunkId"
//                 name="chunkId"
//                 type="text"
//                 value={form.chunkId}
//                 onChange={handleChange}
//                 placeholder="Auto-generated if empty"
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="order"
//                 className="block text-sm font-medium text-gray-700 mb-1.5"
//               >
//                 Order
//               </label>
//               <input
//                 id="order"
//                 name="order"
//                 type="number"
//                 value={form.order}
//                 onChange={handleChange}
//                 placeholder="Optional number"
//                 className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base transition-all shadow-sm"
//               />
//             </div>
//           </div>

//           {/* Arabic Text */}
//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label
//                 htmlFor="text"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Fiqh Text (Arabic) <span className="text-red-500">*</span>
//               </label>
//               <span
//                 className={`text-xs sm:text-sm ${
//                   textLength > maxLength * 0.9 ? "text-red-600" : "text-gray-500"
//                 }`}
//               >
//                 {textLength} / {maxLength.toLocaleString()}
//               </span>
//             </div>

//             <textarea
//               id="text"
//               name="text"
//               ref={textareaRef}
//               value={form.text}
//               onChange={handleChange}
//               placeholder="Paste Arabic fiqh text here..."
//               rows={10}
//               maxLength={maxLength}
//               dir="auto"
//               className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-base resize-y min-h-[180px] leading-relaxed shadow-sm transition-all font-serif"
//             />
//           </div>

//           {/* Feedback message */}
//           {message && (
//             <div
//               className={`mt-6 p-4 rounded-xl text-center text-sm font-medium border ${
//                 message.type === "success"
//                   ? "bg-green-50 text-green-800 border-green-200"
//                   : "bg-red-50 text-red-800 border-red-200"
//               }`}
//             >
//               {message.text}
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={isDisabled}
//             className={`
//               mt-8 w-full py-4 px-6 text-lg font-semibold rounded-xl
//               transition-all duration-200 active:scale-[0.98]
//               ${
//                 isDisabled
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
//               }
//             `}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <circle
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     strokeWidth="4"
//                     stroke="currentColor"
//                   />
//                 </svg>
//                 Saving...
//               </span>
//             ) : (
//               "Save Chunk"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }