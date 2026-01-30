"use client";

import { useState, useEffect } from "react";

export default function FiqhAdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const loadAllMasalas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fiqh-admin-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetch" }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to fetch data");
      }

      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Load error:", err);
      setError(err.message || "Failed to load masalas from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMasalas();
  }, []);

  const handleSave = async (item) => {
    setSavingId(item._id);
    setError(null);

    try {
      const res = await fetch("/api/fiqh-admin-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          _id: item._id,
          bookName: item.bookName,
          page: item.page,
          index: item.index,
          kitab: item.kitab,
          bab: item.bab,
          fasl: item.fasl,
          paragraph: item.paragraph,
          customId: item.customId,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Save failed");
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, ...item } : i))
      );

      alert("Changes saved successfully!");
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const generateCustomId = () => {
    // Simple example — you can replace with your FAM-KTB-... logic
    return `MASALA-${Date.now().toString(36).toUpperCase()}`;
  };

  const handleGenerateId = (id) => {
    const newId = generateCustomId();
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, customId: newId } : item
      )
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this masala?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch("/api/fiqh-admin-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",  // ← you'll need to add "delete" support in API
          _id: id,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setItems((prev) => prev.filter((item) => item._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fiqh Masalas Dashboard</h1>
        <button
          onClick={loadAllMasalas}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Loading...
            </span>
          ) : (
            "Refresh All"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="animate-pulse">Loading masalas...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border rounded-lg bg-gray-50">
          <p className="text-lg">No masalas found in the database yet.</p>
          <p className="mt-2">Upload some books first via the upload page.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                  <input
                    value={item.bookName}
                    onChange={(e) => handleChange(item._id, "bookName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                    <input
                      type="number"
                      value={item.page ?? ""}
                      onChange={(e) => handleChange(item._id, "page", e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Index / Order</label>
                    <input
                      type="number"
                      value={item.index ?? ""}
                      onChange={(e) => handleChange(item._id, "index", e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom ID</label>
                  <div className="flex gap-2">
                    <input
                      value={item.customId || ""}
                      onChange={(e) => handleChange(item._id, "customId", e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="MASALA-..."
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateId(item._id)}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kitab</label>
                  <input
                    value={item.kitab}
                    onChange={(e) => handleChange(item._id, "kitab", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bab</label>
                  <input
                    value={item.bab}
                    onChange={(e) => handleChange(item._id, "bab", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fasl</label>
                  <input
                    value={item.fasl}
                    onChange={(e) => handleChange(item._id, "fasl", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Text / Paragraph</label>
                <textarea
                  value={item.paragraph}
                  onChange={(e) => handleChange(item._id, "paragraph", e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(item)}
                    disabled={savingId === item._id}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                      savingId === item._id
                        ? "bg-gray-400 cursor-wait"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {savingId === item._id ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                      deletingId === item._id
                        ? "bg-gray-400 cursor-wait"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}