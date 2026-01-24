# Bridgingroots_2025

Sencoten-dictionary
A full-stack web application for preserving and teaching the SENĆOŦEN language of the W̱SÁNEĆ (Saanich) First Nations peoples. Built during my co-op placement to support indigenous language revitalization efforts. The goal of this program was to preserve language over time and create an archive.

<img width="1172" height="808" alt="Screenshot 2026-01-22 170537" src="https://github.com/user-attachments/assets/d9f16937-ba37-4631-895c-e0e7042c3778" />
Public View
<img width="1385" height="842" alt="Screenshot 2026-01-22 170528" src="https://github.com/user-attachments/assets/cdad5c14-2de9-44dd-acaa-052ed433e0b7" />
Teacher/Admin View

Features

Public Dictionary - Browse verified SENĆOŦEN words with English translations and phonetic guides
Teacher Admin Panel - Add, edit, verify, and manage dictionary entries
Search & Filter - Find words by English or SENĆOŦEN text
Verification System - Community submissions require teacher approval before going public
Visibility - We were requested by stakeholders to ensure user privacy and provide the option to hide their entries.

🛠 Tech Stack
Frontend

React 18 with functional components and hooks
Tailwind CSS for styling
Material UI icons
Vite for fast development

Backend (Original Production)

Node.js + Express REST API
MySQL database with relational schema
Role-based authentication


Note: This repo is a standalone portfolio excerpt. The frontend runs independently using localStorage, while the /backend folder contains the original Express + MySQL code for reference.

🚀 Quick Start
npm install
npm run dev

Open at http://localhost:5173

Demo Login: Click "Teacher Login" → Password: teacher123 → Click "Add Sample Data"

🔌 API Endpoints (Backend Reference)
|Method |Endpoint|Description|
| --- | --- | --- |
|GET |/dictionary |Get all entries|
|GET |/dictionary/:id |Get single entry|
|POST |/dictionary |Create new entry|
|PUT |/dictionary/:id |Update entry |
|PUT |/dictionary/:id/verify |Toggle verification status|
|PUT |/dictionary/:id/visibility|Toggle public visibility|
|DELETE|/dictionary/:id|Delete entry|

💡 Technical Highlights

Component Architecture — Separated concerns with PublicBrowseView, AdminView, and modal components
State Management — Centralized state with props drilling; service layer abstraction for easy backend swapping
UX Considerations — Loading states, error handling, confirmation dialogs, optimistic UI updates

🎯 My Role

As a co-op developer on this project, I:
Designed and implemented the dictionary management interface
Built RESTful API endpoints for CRUD operations
Created the verification workflow for community-submitted content
Collaborated with language teachers to understand requirements

🔗 See the full application:  https://inspireuvic.org/project/bridging-roots-bayside/  
📧 Contact: goelmanya24@gmail.com

