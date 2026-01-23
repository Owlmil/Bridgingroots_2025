# SENĆOŦEN Community Dictionary

A React application for preserving and sharing the SENĆOŦEN language. This community-driven dictionary allows users to contribute, verify, and browse indigenous language entries.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![MUI](https://img.shields.io/badge/MUI-5.14-blue)

## Features

- 📖 **Browse Dictionary** - Search and filter SENĆOŦEN language entries
- ✏️ **Add/Edit Entries** - Contribute new words with English and SENĆOŦEN translations
- ✅ **Verification System** - Mark entries as verified by language experts
- 👁️ **Visibility Control** - Manage which entries are publicly visible
- 🔍 **Advanced Filtering** - Filter by verification status, visibility, and search terms
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 💾 **Persistent Storage** - Data persists in browser localStorage

## Tech Stack

- **Frontend**: React 18 + Vite
- **State/Storage**: localStorage with async API patterns
- **UI Components**: Material-UI (MUI)
- **Styling**: Custom CSS utilities

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd sencoten-dictionary

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Click **"Add Sample Data"** to populate the dictionary with example SENĆOŦEN words!

## Project Structure

```
sencoten-dictionary/
├── src/
│   ├── components/
│   │   └── CommunityDictionary.jsx  # Main dictionary component
│   ├── services/
│   │   └── dictionaryService.js     # CRUD operations (localStorage)
│   ├── App.jsx                       # App entry point
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Styles
├── index.html
├── package.json
└── vite.config.js
```

## Data Schema

Each dictionary entry has the following structure:

```javascript
{
  dictionary_id: "abc123",
  english_word: "Water",
  english_phonetic: "ˈwɔːtər",
  sencoten_word: "ṈO,EL",
  sencoten_phonetic: "noh-el",
  image_url: null,
  verified: true,
  visible: true,
  created_by_name: "User Name",
  created_at: "2024-01-15T10:30:00.000Z",
  updated_at: "2024-01-15T10:30:00.000Z"
}
```

## API Service Layer

The `dictionaryService.js` uses async/await patterns, making it easy to swap localStorage for a real backend:

```javascript
// Current: localStorage
const entries = await getAllEntries();

// Easy to swap in: REST API, Firebase, Supabase, etc.
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy - that's it!

### Deploy to Netlify

```bash
npm run build
# Drag & drop the `dist` folder to Netlify
```

## Extending This Project

The service layer is designed to be swappable. To connect a real backend:

1. Replace the functions in `src/services/dictionaryService.js`
2. Keep the same function signatures
3. The UI will work without any changes

Example backends you could add:
- Firebase Firestore
- Supabase
- Your own REST API
- MongoDB + Express

## About SENĆOŦEN

SENĆOŦEN is the language of the W̱SÁNEĆ (Saanich) peoples of the Coast Salish region. This project aims to support language preservation and revitalization efforts.

## License

MIT License

---

Built with ❤️ for indigenous language preservation
