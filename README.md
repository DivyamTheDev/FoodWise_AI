# 🥗 Food Optimizer (AI-Powered Food Inventory & Recipe Assistant)

**Food Optimizer** is a fullstack web application designed to eliminate household food waste. It tracks food inventory expiration dates, sends proactive visual and browser expiry alerts, provides AI-driven food preservation recommendations, and generates delicious zero-waste recipes crafted specifically around ingredients that are about to spoil.

---

## ✨ Features (Version 1.0)

1. **Smart Pantry & Fridge Inventory**:
   - Track items with category, quantity, unit, storage location (Fridge, Freezer, Pantry, Countertop), purchase date, expiration date, and cost.
   - Quick quantity adjusters (`+` and `-`) and one-click item usage marking.
   - Real-time search and multi-filtering (by category, storage location, and shelf-life urgency).

2. **Proactive Expiry Alerts & Urgency Categorization**:
   - Visual color-coded urgency badges:
     - 🔴 **Expired** (with days elapsed)
     - 🚨 **Expires TODAY** (blinking alert)
     - 🟡 **Expiring Soon** (1–3 days remaining)
     - 🟢 **Fresh / Safe**
   - Financial risk indicator (total estimated value of groceries at risk of going to waste).
   - One-click browser notification enablement for daily alerts.

3. **AI Culinary Zero-Waste Studio**:
   - Powered by **Google Gemini API** (`gemini-1.5-flash`), with a built-in intelligent rule-based culinary fallback engine so it works immediately out-of-the-box even without an API key!
   - Select individual leftover ingredients or click **"Auto-Pick Expiring Items"**.
   - Custom dietary filters (Vegetarian, Vegan, High-Protein, Low-Carb, Gluten-Free) and cook times (<15m, <30m, etc.).
   - Interactive recipe view with ingredient checklists and step-by-step cooking cards.
   - **"Cook (Deduct)" button**: Automatically reduces or marks used ingredients as consumed directly in your inventory!
   - Dedicated **Zero-Waste Cookbook** to bookmark favorite recipes.

4. **Resilient Dual-Mode Database**:
   - Connects directly to **MongoDB Cloud (Atlas)** using Mongoose.
   - Includes automatic dynamic in-memory store fallback with realistic pre-seeded dummy data so you can test and explore immediately without database setup blockers.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, Mongoose, Google Generative AI SDK (`@google/generative-ai`), CORS, Dotenv.
- **Frontend**: React (Vite), Tailwind CSS, Lucide React icons, Axios.
- **Database**: MongoDB Cloud (Atlas) / In-Memory resilient fallback.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# Optional: MongoDB Cloud (Atlas) Connection String
# e.g.: mongodb+srv://<username>:<password>@cluster0.mongodb.net/food_optimizer?retryWrites=true&w=majority
MONGODB_URI=

# Optional: Google Gemini API Key for generative AI recipes
GEMINI_API_KEY=
```
*(If left blank, the app will run with pre-seeded sample data in resilient local mode and use the built-in culinary AI optimizer engine).*

### 3. Running the Application

#### Option A: Run Full App on Single Port (`http://localhost:5000`)
The backend is already configured to serve the compiled React frontend:
```bash
cd backend
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

#### Option B: Run in Development Mode with Hot Reloading
Run backend:
```bash
cd backend
npm run dev
```
In another terminal, run frontend:
```bash
cd frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📦 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system configuration status |
| `GET` | `/api/inventory` | List items (supports `?category=`, `?status=`, `?search=`, `?location=`) |
| `POST` | `/api/inventory` | Add a new inventory item |
| `PUT` | `/api/inventory/:id` | Update an existing item |
| `DELETE` | `/api/inventory/:id` | Delete an item |
| `POST` | `/api/inventory/:id/consume`| Deduct quantity or mark item as consumed |
| `POST` | `/api/inventory/seed` | Reset and reload initial realistic dummy data |
| `GET` | `/api/alerts` | Get expiring items, alert counts, and AI preservation tips |
| `GET` | `/api/recipes` | Get saved cookbook recipes |
| `POST` | `/api/recipes/generate` | Generate AI recipes using leftover/expiring ingredients |
| `POST` | `/api/recipes/save` | Save recipe to favorites |
| `POST` | `/api/recipes/cook` | Cook recipe and deduct used ingredients from inventory |
