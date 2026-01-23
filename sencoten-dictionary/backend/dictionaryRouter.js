// backend/dictionaryRouter.js
// Express router for SENĆOŦEN Dictionary API endpoints

const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  getAllDictionaryEntries,
  getDictionaryEntryById,
  createDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
  updateDictionaryVerification,
  updateDictionaryVisibility,
} = require("./database.js");

const router = express.Router();

// Middleware to log all incoming requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /dictionary - Fetch all dictionary entries
router.get("/", async (req, res) => {
  try {
    const dictionaries = await getAllDictionaryEntries();
    res.json(dictionaries);
  } catch (error) {
    console.error("Error fetching dictionary entries:", error);
    res.status(500).json({ error: "Failed to fetch dictionary entries" });
  }
});

// GET /dictionary/:id - Fetch a single dictionary entry by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid dictionary ID" });
  }

  try {
    const result = await getDictionaryEntryById(id);
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(404).json({ error: "Dictionary entry not found" });
    }
  } catch (error) {
    console.error("Error fetching dictionary entry:", error);
    res.status(500).json({ error: "Failed to fetch dictionary entry" });
  }
});

// POST /dictionary - Create a new dictionary entry
router.post("/", async (req, res) => {
  try {
    const {
      english_word,
      english_phonetic,
      sencoten_word,
      sencoten_phonetic,
      user_id,
      displayName,
    } = req.body;

    const entry = await createDictionaryEntry({
      english_word,
      english_phonetic,
      sencoten_word,
      sencoten_phonetic,
      image_url: req.body.image_url || null,
      created_by: user_id,
      created_by_name: displayName,
    });

    if (entry.success) {
      res.status(201).json({
        message: "Dictionary created successfully!",
        dictionaryId: entry.dictionaryId,
      });
    } else {
      res.status(500).json({ error: entry.error });
    }
  } catch (error) {
    console.error("Error saving dictionary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /dictionary/:id - Update an existing dictionary entry
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      english_word,
      english_phonetic,
      sencoten_word,
      sencoten_phonetic,
      image_url,
      displayName,
    } = req.body;
    const user_id = req.body.user_id ? parseInt(req.body.user_id) : null;

    const updatedEntry = await updateDictionaryEntry(id, {
      english_word,
      english_phonetic,
      sencoten_word,
      sencoten_phonetic,
      image_url: image_url || null,
      updated_by: user_id,
      updated_by_name: displayName,
    });

    if (updatedEntry.success) {
      res.status(200).json({ message: "Dictionary updated successfully!" });
    } else {
      res.status(500).json({ error: updatedEntry.error });
    }
  } catch (error) {
    console.error("Error updating dictionary entry:", error);
    res.status(500).json({ error: "Failed to update dictionary entry" });
  }
});

// PUT /dictionary/:id/verify - Update the verified status
router.put("/:id/verify", async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  try {
    await updateDictionaryVerification(id, verified);
    res.status(200).json({ message: "Verified status updated successfully" });
  } catch (error) {
    console.error("Error updating verified status:", error);
    res.status(500).json({ error: "Failed to update verified status" });
  }
});

// PUT /dictionary/:id/visibility - Update the visibility status
router.put("/:id/visibility", async (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  try {
    await updateDictionaryVisibility(id, visible);
    res.status(200).json({ message: "Visibility updated successfully" });
  } catch (error) {
    console.error("Error updating visibility:", error);
    res.status(500).json({ error: "Failed to update visibility" });
  }
});

// DELETE /dictionary/:id - Delete a dictionary entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteDictionaryEntry(id);
    if (result.success) {
      // If there was an image, delete the file
      if (result.imageUrl) {
        try {
          const filename = path.basename(result.imageUrl);
          const filePath = path.join(
            __dirname,
            "../assets/images/dictionary",
            filename
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted dictionary image: ${filePath}`);
          }
        } catch (imageError) {
          console.error("Error deleting dictionary image:", imageError);
        }
      }
      res.status(204).send();
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: "Failed to delete word" });
  }
});

module.exports = router;