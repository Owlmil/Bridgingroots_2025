import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleVerification,
  toggleVisibility,
  seedSampleData,
} from "../services/dictionaryService";

// ============ PUBLIC BROWSE VIEW ============
const PublicBrowseView = ({
  entries,
  loading,
  error,
  onAdminLogin,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);

  const publicEntries = entries.filter((e) => e.visible && e.verified);

  const filteredEntries = publicEntries.filter((entry) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      entry.english_word?.toLowerCase().includes(search) ||
      entry.sencoten_word?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600 font-medium">
            Loading dictionary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                SENĆOŦEN Dictionary
              </h1>
              <p className="text-gray-500 mt-1">
                Explore the language of the W̱SÁNEĆ peoples
              </p>
            </div>
            <button
              onClick={onAdminLogin}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <LockIcon fontSize="small" />
              <span className="hidden sm:inline font-medium">
                Teacher Login
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search words in English or SENĆOŦEN..."
                className="w-full px-5 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white outline-none text-lg transition-all duration-200"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MenuBookIcon style={{ fontSize: 48, color: "#9ca3af" }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {publicEntries.length === 0
                ? "No words available yet"
                : "No words match your search"}
            </h3>
            <p className="text-gray-500">
              {publicEntries.length === 0
                ? "Login as a teacher to add dictionary entries"
                : "Try a different search term"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              {filteredEntries.length} words found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.dictionary_id}
                  onClick={() => setSelectedWord(entry)}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:border-sky-200"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 to-indigo-100 relative overflow-hidden flex items-center justify-center">
                    {entry.image_url ? (
                      <img
                        src={entry.image_url}
                        alt={entry.english_word}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon style={{ fontSize: 64, color: "#cbd5e1" }} />
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <VerifiedIcon style={{ fontSize: 12 }} /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Word Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {entry.english_word}
                    </h3>
                    {entry.english_phonetic && (
                      <p className="text-gray-400 text-sm">
                        /{entry.english_phonetic}/
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sky-600 font-semibold text-lg">
                        {entry.sencoten_word}
                      </p>
                      {entry.sencoten_phonetic && (
                        <p className="text-gray-400 text-sm">
                          /{entry.sencoten_phonetic}/
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-gradient-to-br from-sky-100 to-indigo-100 relative flex items-center justify-center">
              {selectedWord.image_url ? (
                <img
                  src={selectedWord.image_url}
                  alt={selectedWord.english_word}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <ImageIcon style={{ fontSize: 80, color: "#cbd5e1" }} />
              )}
              <button
                onClick={() => setSelectedWord(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedWord.english_word}
                  </h2>
                  {selectedWord.english_phonetic && (
                    <p className="text-gray-500">
                      /{selectedWord.english_phonetic}/
                    </p>
                  )}
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1 shrink-0">
                  <VerifiedIcon style={{ fontSize: 14 }} /> Verified
                </span>
              </div>

              <div className="mt-6 p-5 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl">
                <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider mb-2">
                  SENĆOŦEN
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedWord.sencoten_word || "—"}
                </p>
                {selectedWord.sencoten_phonetic && (
                  <p className="text-sky-600 mt-1 text-lg">
                    /{selectedWord.sencoten_phonetic}/
                  </p>
                )}
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Contributed by{" "}
                <span className="font-medium text-gray-700">
                  {selectedWord.created_by_name || "Community Member"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ ADMIN LOGIN MODAL ============
const AdminLoginModal = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "teacher123") {
      onLogin();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <AdminPanelSettingsIcon
              className="text-white"
              style={{ fontSize: 28 }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Teacher Login</h2>
            <p className="text-gray-500 text-sm">Access admin panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter password"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white outline-none text-lg transition-all"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          )}
          <p className="text-xs text-gray-400 mt-3 bg-gray-50 px-3 py-2 rounded-lg">
            💡 Demo password:{" "}
            <code className="font-mono text-gray-600">teacher123</code>
          </p>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl hover:from-sky-600 hover:to-indigo-600 font-semibold shadow-lg shadow-sky-500/25 transition-all"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ ADMIN VIEW ============
const AdminView = ({ entries, loading, onBack, fetchEntries }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    sencoten_word: "",
    sencoten_phonetic: "",
    english_word: "",
    english_phonetic: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setFormData({
      sencoten_word: "",
      sencoten_phonetic: "",
      english_word: "",
      english_phonetic: "",
      image_url: "",
    });
    setEditingEntry(null);
  };
  const handleCreate = () => {
    resetForm();
    setOpenModal(true);
  };
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      sencoten_word: entry.sencoten_word || "",
      sencoten_phonetic: entry.sencoten_phonetic || "",
      english_word: entry.english_word || "",
      english_phonetic: entry.english_phonetic || "",
      image_url: entry.image_url || "",
    });
    setOpenModal(true);
  };
  const handleToggleVerification = async (entry) => {
    try {
      await toggleVerification(entry.dictionary_id, !entry.verified);
      fetchEntries();
    } catch (err) {
      alert("Failed to update.");
    }
  };
  const handleToggleVisibility = async (entry) => {
    try {
      await toggleVisibility(entry.dictionary_id, !entry.visible);
      fetchEntries();
    } catch (err) {
      alert("Failed to update.");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteEntry(id);
      fetchEntries();
    } catch (err) {
      alert("Failed to delete.");
    }
  };
  const handleSave = async () => {
    if (!formData.english_word.trim()) {
      alert("English word is required.");
      return;
    }
    setSaving(true);
    try {
      const wordData = {
        ...formData,
        image_url: formData.image_url || null,
        displayName: "Teacher",
      };
      if (editingEntry) {
        await updateEntry(editingEntry.dictionary_id, wordData);
      } else {
        await createEntry(wordData);
      }
      fetchEntries();
      setOpenModal(false);
      resetForm();
    } catch (err) {
      alert(`Failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  const handleSeedData = async () => {
    if (!window.confirm("Add sample words?")) return;
    try {
      await seedSampleData();
      fetchEntries();
    } catch (err) {
      alert("Failed.");
    }
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    if (filterStatus === "pending")
      filtered = filtered.filter((e) => !e.verified);
    if (filterStatus === "verified")
      filtered = filtered.filter((e) => e.verified);
    if (filterStatus === "visible")
      filtered = filtered.filter((e) => e.visible);
    if (filterStatus === "hidden")
      filtered = filtered.filter((e) => !e.visible);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.english_word?.toLowerCase().includes(s) ||
          e.sencoten_word?.toLowerCase().includes(s),
      );
    }
    return filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  };

  const filteredEntries = getFilteredEntries();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowBackIcon />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage dictionary entries</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
            <AdminPanelSettingsIcon fontSize="small" />
            Teacher
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="all">All ({entries.length})</option>
                <option value="verified">
                  ✓ Verified ({entries.filter((e) => e.verified).length})
                </option>
                <option value="pending">
                  ⏳ Pending ({entries.filter((e) => !e.verified).length})
                </option>
                <option value="visible">
                  👁 Visible ({entries.filter((e) => e.visible).length})
                </option>
                <option value="hidden">
                  🙈 Hidden ({entries.filter((e) => !e.visible).length})
                </option>
              </select>
              {entries.length === 0 && (
                <button
                  onClick={handleSeedData}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
                >
                  + Sample Data
                </button>
              )}
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                <AddIcon fontSize="small" />
                Add Entry
              </button>
            </div>
          </div>
        </div>

        <p className="text-gray-500 mb-5">
          Showing {filteredEntries.length} of {entries.length} entries
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.dictionary_id}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 ${entry.verified ? "border-l-emerald-500" : "border-l-amber-400"}`}
            >
              <div className="p-5">
                <div className="flex justify-end mb-4 gap-2">
                  {entry.visible && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                      <VisibilityIcon style={{ fontSize: 12 }} /> Public
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${entry.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {entry.verified ? (
                      <>
                        <VerifiedIcon style={{ fontSize: 12 }} /> Verified
                      </>
                    ) : (
                      "⏳ Pending"
                    )}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-20 h-20 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {entry.image_url ? (
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon style={{ fontSize: 32, color: "#94a3b8" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {entry.english_word || "—"}
                    </h3>
                    {entry.english_phonetic && (
                      <p className="text-sm text-gray-400">
                        /{entry.english_phonetic}/
                      </p>
                    )}
                    <p className="text-sky-600 font-semibold mt-1 truncate">
                      {entry.sencoten_word || "—"}
                    </p>
                    {entry.sencoten_phonetic && (
                      <p className="text-sm text-gray-400">
                        /{entry.sencoten_phonetic}/
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  By: {entry.created_by_name || "Unknown"}
                </div>

                <div className="mt-4 flex gap-2 justify-end flex-wrap">
                  <button
                    onClick={() => handleToggleVerification(entry)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${entry.verified ? "bg-amber-100 hover:bg-amber-200 text-amber-700" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"}`}
                  >
                    {entry.verified ? "Unverify" : "✓ Verify"}
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(entry)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${entry.visible ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-purple-100 hover:bg-purple-200 text-purple-700"}`}
                  >
                    {entry.visible ? (
                      <>
                        <VisibilityOffIcon style={{ fontSize: 16 }} /> Hide
                      </>
                    ) : (
                      <>
                        <VisibilityIcon style={{ fontSize: 16 }} /> Show
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="py-2 px-3 rounded-lg text-sm font-medium bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
                  >
                    <EditIcon style={{ fontSize: 16 }} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.dictionary_id)}
                    className="py-2 px-3 rounded-lg text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                  >
                    <DeleteIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <MenuBookIcon style={{ fontSize: 64, color: "#d1d5db" }} />
            <p className="text-gray-500 text-lg mt-4">No entries found</p>
          </div>
        )}
      </main>

      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-5 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
              <button
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    English Word *
                  </label>
                  <input
                    type="text"
                    value={formData.english_word}
                    onChange={(e) =>
                      setFormData({ ...formData, english_word: e.target.value })
                    }
                    placeholder="e.g., Water"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    English Phonetic
                  </label>
                  <input
                    type="text"
                    value={formData.english_phonetic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        english_phonetic: e.target.value,
                      })
                    }
                    placeholder="e.g., ˈwɔːtər"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SENĆOŦEN Word
                  </label>
                  <input
                    type="text"
                    value={formData.sencoten_word}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sencoten_word: e.target.value,
                      })
                    }
                    placeholder="e.g., ṈO,EL"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SENĆOŦEN Phonetic
                  </label>
                  <input
                    type="text"
                    value={formData.sencoten_phonetic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sencoten_phonetic: e.target.value,
                      })
                    }
                    placeholder="e.g., noh-el"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="mt-3 w-24 h-24 object-cover rounded-xl border"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
            </div>
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.english_word.trim()}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl hover:from-sky-600 hover:to-indigo-600 font-semibold disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center shadow-lg shadow-sky-500/25 transition-all"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : editingEntry ? (
                  "Save Changes"
                ) : (
                  "Create Entry"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ MAIN COMPONENT ============
const CommunityDictionary = () => {
  const [view, setView] = useState("public");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await getAllEntries();
      setEntries(data);
    } catch (err) {
      setError("Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (view === "login")
    return (
      <>
        <PublicBrowseView
          entries={entries}
          loading={loading}
          error={error}
          onAdminLogin={() => setView("login")}
          onRefresh={fetchEntries}
        />
        <AdminLoginModal
          onLogin={() => setView("admin")}
          onClose={() => setView("public")}
        />
      </>
    );
  if (view === "admin")
    return (
      <AdminView
        entries={entries}
        loading={loading}
        onBack={() => setView("public")}
        fetchEntries={fetchEntries}
      />
    );
  return (
    <PublicBrowseView
      entries={entries}
      loading={loading}
      error={error}
      onAdminLogin={() => setView("login")}
      onRefresh={fetchEntries}
    />
  );
};

export default CommunityDictionary;
