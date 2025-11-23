# Food Management & Sustainability Platform (Echo Food)

A comprehensive solution to reduce food waste, manage inventory, and promote sustainable consumption habits using AI.

## 🚀 Features

- **Smart Inventory Management**: Upload receipts or food photos to automatically populate your inventory using AI (Gemini Vision & OCR).
- **NourishBot (AI Assistant)**: Chat with our sustainability expert for recipes, leftovers usage, and eco-tips.
- **Sustainability Dashboard**: Track your food waste reduction, money saved, and SDG impact.
- **Expiry Tracking**: Automatic expiry date estimation and alerts.

## 📂 Project Structure

The project is divided into two main directories:

- **Frontend**: `Food-Management-Sustainability-Platform-frontend-main` (React + Vite + Tailwind)
- **Backend**: `-Food-Management-Sustainability-Platform--main` (NestJS + MongoDB)

---

## 🛠️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance running on port 27017 OR MongoDB Atlas connection string)

---

## ⚙️ Installation & Setup

### 1. Backend Setup (NestJS)

Navigate to the backend directory:
```bash
cd -Food-Management-Sustainability-Platform--main
```

Install dependencies:
```bash
npm install
```

**Environment Variables**:
Create a `.env` file in the backend root directory with the following keys:
```env
MONGO_URI=mongodb://localhost:27017/hackathon_db
JWT_SECRET=your_jwt_secret_key
```
*(Note: Adjust `MONGO_URI` if using a cloud database)*

Start the backend server:
```bash
npm run start:dev
```
The backend will run on **http://localhost:3000**.

### 2. Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd Food-Management-Sustainability-Platform-frontend-main
```

Install dependencies:
```bash
npm install
```

**Environment Variables**:
Create a `.env` file in the frontend root directory with your API keys:
```env
# Google Gemini AI (Required for Chatbot & Image Analysis)
VITE_GEMINI_API_KEY=your_google_gemini_api_key

# Firebase Configuration (Required for Auth)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Start the frontend development server:
```bash
npm run dev
```
The frontend will run on **http://localhost:5173**.

---

## 🏃‍♂️ How to Run

1.  Ensure **MongoDB** is running.
2.  Start the **Backend** (`npm run start:dev` in backend folder).
3.  Start the **Frontend** (`npm run dev` in frontend folder).
4.  Open your browser and go to `http://localhost:5173`.

## 🧪 Testing AI Features

- **Chatbot**: Click the floating chat icon to talk to NourishBot.
- **Upload**: Go to the "Upload" page. You can upload:
    -   **Receipts**: AI extracts items and quantities.
    -   **Food Photos**: AI identifies the food and estimates expiry.
