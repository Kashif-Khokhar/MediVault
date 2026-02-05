# MediVault 🏥🛡️

**MediVault** is a next-generation, zero-knowledge digital health locker designed to give you complete control over your medical records. Your health data is encrypted locally on your device, ensuring that not even the cloud server can see your private information.

---

## 🔒 Security Architecture
MediVault operates on a **Zero-Knowledge** model. Your data is encrypted before it ever leaves your device.
- **Key Derivation**: We use **PBKDF2** with 100,000 iterations to derive a strong encryption key from your vault passcode.
- **Encryption**: All documents, vitals, and personal notes are encrypted using **AES-256-CBC** (military-grade).
- **No Passcode Storage**: We never store (or even know) your vault passcode or recovery key.

---

## ✨ Features
### 📁 Secure Health Records
- **Localized Storage**: Fast access via IndexedDB (Dexie.js).
- **Categorized Filing**: Organize by reports, prescriptions, and lab results.
- **Seamless Sync**: Optional encrypted backup to MongoDB for cross-device access.

### 📊 Vital Tracking
- Track Blood Pressure, Heart Rate, Glucose Levels, and more.
- Interactive charts powered by **Recharts** to visualize your health trends.

### 💊 Medication Reminders
- Never miss a dose with integrated reminder scheduling.
- Smart notifications for upcoming medications.

### 🚨 Emergency Vault
- Securely store emergency contacts and blood group information for quick access when needed most.

---

## 🛠️ Technical Stack
### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Auth**: JWT (JSON Web Tokens)

---

## 📂 Project Structure
```text
/server             # Node.js backend
  ├── /models       # Mongoose schemas (Encrypted Records, Users)
  ├── /routes       # API endpoints for sync and auth
  └── /middleware   # Security and Auth guards
/src/               # React frontend
  ├── /components   # UI modules (Dashboard, Records, Vitals)
  ├── /context      # Security and Vault state logic
  ├── /services     # AES-256 Encryption & API logic
  ├── /db           # Local database schema (Dexie)
  └── /assets       # Shared UI assets
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. `npm run dev`

### 3. Frontend Setup
1. `cd ..`
2. `npm install`
3. `npm run dev`

---

## ⚠️ Important Safety Note
Always keep your **Recovery Key** in a safe, offline location. Because we use zero-knowledge encryption, if you lose your passcode and your recovery key, **your data cannot be recovered even by us.**
