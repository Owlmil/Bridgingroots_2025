// backend/database.js
// Database layer for SENĆOŦEN Dictionary
// Original project uses MySQL - this file shows the database operations

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Database connection
async function connect() {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  return connection;
}

// Get all dictionary entries with creator/updater names
async function getAllDictionaryEntries() {
  let connection;
  try {
    connection = await connect();
    const query = `
        SELECT
            d.*,
            u1.displayName AS created_by_name,
            u2.displayName AS updated_by_name
        FROM dictionaries d
        LEFT JOIN users u1 ON d.created_by = u1.user_id
        LEFT JOIN users u2 ON d.updated_by = u2.user_id
    `;
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error("DB error in getAllDictionaryEntries:", error);
    return [];
  } finally {
    if (connection) await connection.end();
  }
}

// Get single dictionary entry by ID
async function getDictionaryEntryById(id) {
  let connection;
  try {
    connection = await connect();
    const query = `
        SELECT
            d.*,
            u1.displayName AS created_by_name,
            u2.displayName AS updated_by_name
        FROM dictionaries d
        LEFT JOIN users u1 ON d.created_by = u1.user_id
        LEFT JOIN users u2 ON d.updated_by = u2.user_id
        WHERE d.dictionary_id = ?
    `;
    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return { success: false, error: "Entry not found" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("DB error in getDictionaryEntryById:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Create new dictionary entry
async function createDictionaryEntry({
  english_word,
  english_phonetic,
  sencoten_word,
  sencoten_phonetic,
  image_url,
  created_by,
  created_by_name,
}) {
  let connection;
  try {
    connection = await connect();
    const query = `
        INSERT INTO dictionaries (
            english_word, english_phonetic, sencoten_word, sencoten_phonetic,
            image_url, verified, created_by, created_by_name, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [result] = await connection.execute(query, [
      english_word || null,
      english_phonetic || null,
      sencoten_word || null,
      sencoten_phonetic || null,
      image_url || null,
      false, // starts unverified
      created_by || null,
      created_by_name || null,
    ]);
    return { success: true, dictionaryId: result.insertId };
  } catch (error) {
    console.error("DB error in createDictionaryEntry:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Update dictionary entry
async function updateDictionaryEntry(
  id,
  {
    english_word,
    english_phonetic,
    sencoten_word,
    sencoten_phonetic,
    image_url,
    updated_by,
    updated_by_name,
  }
) {
  let connection;
  try {
    connection = await connect();
    const query = `
        UPDATE dictionaries SET
            english_word = ?,
            english_phonetic = ?,
            sencoten_word = ?,
            sencoten_phonetic = ?,
            image_url = ?,
            updated_by = ?,
            updated_by_name = ?,
            updated_at = NOW()
        WHERE dictionary_id = ?
    `;
    const [result] = await connection.execute(query, [
      english_word ?? null,
      english_phonetic ?? null,
      sencoten_word ?? null,
      sencoten_phonetic ?? null,
      image_url ?? null,
      updated_by || null,
      updated_by_name || null,
      id,
    ]);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("DB error in updateDictionaryEntry:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Delete dictionary entry
async function deleteDictionaryEntry(id) {
  let connection;
  try {
    connection = await connect();

    // Get the image URL before deleting
    const [entries] = await connection.execute(
      `SELECT image_url FROM dictionaries WHERE dictionary_id = ?`,
      [id]
    );

    let imageUrl = null;
    if (entries.length > 0 && entries[0].image_url) {
      imageUrl = entries[0].image_url;
    }

    // Delete the dictionary record
    const [result] = await connection.execute(
      "DELETE FROM dictionaries WHERE dictionary_id = ?",
      [id]
    );

    return { success: true, affectedRows: result.affectedRows, imageUrl };
  } catch (error) {
    console.error("DB error in deleteDictionaryEntry:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Toggle dictionary entry verification (admin only)
async function updateDictionaryVerification(id, verified) {
  let connection;
  try {
    connection = await connect();
    const query =
      "UPDATE dictionaries SET verified = ? WHERE dictionary_id = ?";
    const [result] = await connection.execute(query, [verified, id]);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("DB error in updateDictionaryVerification:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Toggle dictionary entry visibility
async function updateDictionaryVisibility(id, visible) {
  let connection;
  try {
    connection = await connect();
    const query =
      "UPDATE dictionaries SET visible = ? WHERE dictionary_id = ?";
    const [result] = await connection.execute(query, [visible, id]);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("DB error in updateDictionaryVisibility:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = {
  getAllDictionaryEntries,
  getDictionaryEntryById,
  createDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
  updateDictionaryVerification,
  updateDictionaryVisibility,
};