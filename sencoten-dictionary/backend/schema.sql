-- backend/schema.sql
-- Database schema for SENĆOŦEN Dictionary
-- This shows the MySQL table structure used in the original project

CREATE TABLE IF NOT EXISTS dictionaries (
    dictionary_id INT AUTO_INCREMENT PRIMARY KEY,
    english_word VARCHAR(255),
    english_phonetic VARCHAR(255),
    sencoten_word VARCHAR(255),
    sencoten_phonetic VARCHAR(255),
    image_url VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    visible BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_by_name VARCHAR(255),
    updated_by INT,
    updated_by_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Index for faster searches
CREATE INDEX idx_english_word ON dictionaries(english_word);
CREATE INDEX idx_sencoten_word ON dictionaries(sencoten_word);
CREATE INDEX idx_verified ON dictionaries(verified);