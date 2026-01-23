// Using localStorage for persistence - no backend setup required!

const STORAGE_KEY = "sencoten_dictionary";

// Helper to get entries from localStorage
const getStoredEntries = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save entries to localStorage
const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Simulate async API call (makes it easy to swap in real API later)
const simulateDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Get all dictionary entries
export const getAllEntries = async () => {
  await simulateDelay();
  const entries = getStoredEntries();
  return entries.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
};

// Get single entry by ID
export const getEntryById = async (id) => {
  await simulateDelay();
  const entries = getStoredEntries();
  return entries.find((e) => e.dictionary_id === id) || null;
};

// Create new entry
export const createEntry = async (entryData) => {
  await simulateDelay();
  const entries = getStoredEntries();

  const newEntry = {
    dictionary_id: generateId(),
    english_word: entryData.english_word || "",
    english_phonetic: entryData.english_phonetic || "",
    sencoten_word: entryData.sencoten_word || "",
    sencoten_phonetic: entryData.sencoten_phonetic || "",
    image_url: entryData.image_url || null,
    verified: entryData.verified || false,
    visible: entryData.visible || false,
    created_by: entryData.user_id || null,
    created_by_name:
      entryData.displayName || entryData.created_by_name || "Anonymous",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  entries.push(newEntry);
  saveEntries(entries);

  return { success: true, id: newEntry.dictionary_id };
};

// Update entry
export const updateEntry = async (id, entryData) => {
  await simulateDelay();
  const entries = getStoredEntries();
  const index = entries.findIndex((e) => e.dictionary_id === id);

  if (index === -1) {
    throw new Error("Entry not found");
  }

  entries[index] = {
    ...entries[index],
    ...entryData,
    updated_at: new Date().toISOString(),
  };

  saveEntries(entries);
  return { success: true };
};

// Delete entry
export const deleteEntry = async (id) => {
  await simulateDelay();
  const entries = getStoredEntries();
  const filtered = entries.filter((e) => e.dictionary_id !== id);
  saveEntries(filtered);
  return { success: true };
};

// Toggle verification status
export const toggleVerification = async (id, verified) => {
  return updateEntry(id, { verified });
};

// Toggle visibility status
export const toggleVisibility = async (id, visible) => {
  return updateEntry(id, { visible });
};

// Seed sample data (for demo purposes)
export const seedSampleData = async () => {
  const existingEntries = getStoredEntries();

  if (existingEntries.length > 0) {
    return { success: true, count: 0, message: "Data already exists" };
  }

  const sampleEntries = [
    {
      english_word: "Water",
      english_phonetic: "ˈwɔːtər",
      sencoten_word: "ṈO,EL",
      sencoten_phonetic: "noh-el",
      image_url:
        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
      verified: true,
      visible: true,
      created_by_name: "Language Elder",
    },
    {
      english_word: "Sun",
      english_phonetic: "sʌn",
      sencoten_word: "SȻÁĆEL",
      sencoten_phonetic: "ska-chel",
      image_url:
        "https://images.unsplash.com/photo-1575881875475-31023242e3f9?w=400&h=400&fit=crop",
      verified: true,
      visible: true,
      created_by_name: "Language Elder",
    },
    {
      english_word: "Moon",
      english_phonetic: "muːn",
      sencoten_word: "ṮEṮȻEN",
      sencoten_phonetic: "theth-ken",
      image_url:
        "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop",
      verified: true,
      visible: true,
      created_by_name: "Community Member",
    },
    {
      english_word: "Tree",
      english_phonetic: "triː",
      sencoten_word: "SḴELÁLṈEṈ",
      sencoten_phonetic: "skeh-lal-nen",
      image_url:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=400&fit=crop",
      verified: false,
      visible: false,
      created_by_name: "Student",
    },
    {
      english_word: "Hello",
      english_phonetic: "həˈloʊ",
      sencoten_word: "ÍY SȻÁĆEL",
      sencoten_phonetic: "ee ska-chel",
      image_url:
        "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400&h=400&fit=crop",
      verified: true,
      visible: true,
      created_by_name: "Language Teacher",
    },
    {
      english_word: "Thank you",
      english_phonetic: "θæŋk juː",
      sencoten_word: "HÍSW̱ḴE",
      sencoten_phonetic: "hee-skwe",
      image_url:
        "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=400&fit=crop",
      verified: true,
      visible: true,
      created_by_name: "Language Elder",
    },
  ];

  for (const entry of sampleEntries) {
    await createEntry(entry);
  }

  return { success: true, count: sampleEntries.length };
};

// Clear all data (useful for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
