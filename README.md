# 🔬 VirtualLabX (VLab)

VirtualLabX is a state-of-the-art interactive e-learning platform that combines interactive scientific simulations, secure certification exams, real-time AI-assisted proctoring, and verifiable credential issuance. Built using modern web technologies, VirtualLabX aims to make laboratory education and remote assessments highly interactive, secure, and verifiable.

---

## 🌟 Key Features

### 1. Interactive Virtual Labs
* **Linear Regression Lab:**
  * Interactive chart plotting simulation.
  * Real-time optimization walkthroughs (Slope, Intercept, Cost function).
  * Knowledge assessments (in-lab quizzes).
  * Interactive coding environments to learn concepts step-by-step.
* **Matrix Multiplication Lab:**
  * Step-driven simulation visualization.
  * Interactive grid manipulation with randomizer and manual editing support.
  * Live status machine highlighting active rows, columns, and dot product accumulation.

### 2. Certification Exams & Question Engine
* **Topic-Based Assessment Collections:** Active exams on React, Python, DSA, and Full-Stack development.
* **Secured Exam Lobby:** Verifies system requirements, camera access, and rules acknowledgement.
* **Dynamic Question Models:** Dynamic backend question factory compiling MCQ, multiple-choice, and numerical-entry questions.

### 3. AI-Assisted Proctoring Engine (Client-Side)
* **Face Presence Detection:** Employs `@vladmandic/face-api` (TinyFaceDetector) to track user presence in front of the camera.
* **Gaze Tracking & Classification:** Utilizes `@mediapipe/face_mesh` for real-time gaze estimation (LEFT, CENTER, RIGHT).
* **Audio Voice Activity Detection:** Web Audio API logs voice activity above ambient calibration thresholds.
* **User Behavior Lockdowns:** Captures visibility events (tab switching), disables shortcut keys, and suppresses context menus during exams.
* **Evidence Gathering:** Automatically triggers and uploads base64 webcam snapshots on suspicious activity.

### 4. Verifiable Credentials & Issuer Pipeline
* **Dynamic PDF Generation:** High-fidelity certificate rendering using Puppeteer.
* **Public QR Verification:** Each certificate has a unique UUID hash and QR code pointing to a verification path (e.g., `/verify/:hash`).
* **Profile Integration:** Users can access, view, and download earned certificates from their personal profiles.

### 5. Admin & Moderator Control Panels
* **Exam Collection CRUD:** Add, update, or remove exam topics.
* **Question Bank CRUD:** Manage individual question banks per topic.
* **Session Monitoring:** Review active and past exam sessions, analyze violation timelines, and view captured snapshot evidence.
* **User Management:** Promote standard users to moderators.

---

## 💻 Tech Stack

### Frontend
* **Core:** React 18 (Vite build system), React Router DOM v7
* **Styling:** Tailwind CSS v4, Vanilla CSS
* **Animations:** GSAP & Framer Motion
* **Visualizations:** Recharts, React Flow / XYFlow
* **Proctoring:** `@vladmandic/face-api`, `@mediapipe/face_mesh`, Web Audio API

### Backend
* **Core:** Node.js, Express 5
* **Database:** MongoDB + Mongoose (dynamic question schemas)
* **Authentication:** JWT, BcryptJS, Firebase Auth integration
* **Certificate Engine:** Puppeteer (HTML to PDF buffer), `qrcode` generator

---

## 📁 Repository Structure

```
VLab/
├── backend/                  # Node.js + Express backend app
│   ├── models/               # Mongoose schemas (User, ExamSession, Certificate, etc.)
│   ├── routes/               # Express endpoints (auth, exams, questions, certificates)
│   ├── services/             # Puppeteer PDF & QR code generators
│   ├── utils/                # Helper utilities and templates
│   ├── seed.js               # Exam collection seeder
│   ├── seedNewLabs.js        # Detailed question & lab seeder
│   ├── server.js             # Express server entry point
│   └── package.json          # Backend package manifest
├── src/                      # React frontend source
│   ├── components/           # Reusable widgets, proctoring HUD, navigation
│   ├── context/              # Auth, Exam, and Spotify global states
│   ├── pages/                # Page views (Labs, Profile, Lobby, Exam, Verify, Admin)
│   ├── App.jsx               # Navigation maps and providers
│   └── main.jsx              # React entry mount
├── package.json              # Frontend package manifest
└── README.md                 # Project guide (this file)
```

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (running locally or via MongoDB Atlas)

---

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd VLab
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration
Create a `.env` file inside the `backend` directory:
```bash
cd backend
# Create a .env file and configure the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/VLab
JWT_SECRET=supersecretjwttokenkey
```

#### Frontend Configuration
Create a `.env` file in the root directory:
```bash
cd ..
# Create a .env file and configure the following:
DATABASE_URL="file:./dev.db" # Required if using Prisma, default is dev.db

# Firebase configuration (Optional: Enable to support social login integrations)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

---

### Step 3: Install Dependencies

#### Install Frontend Dependencies (Root Directory)
```bash
# In the root directory
npm install
```

#### Install Backend Dependencies
```bash
# In the backend directory
cd backend
npm install
cd ..
```

---

### Step 4: Seed the Database
Ensure your MongoDB local instance is running, then populate exam topics and lab content:

```bash
cd backend
# Seed primary exam collections
node seed.js

# Seed labs, modules, and questions
node seedNewLabs.js
cd ..
```

---

### Step 5: Run the Project

#### 1. Start the Backend Server
```bash
cd backend
npm run dev
# The server will start on http://localhost:5000
```

#### 2. Start the Frontend Dev Server
```bash
# In the root directory (open a new terminal)
npm run dev
# The client will start on http://localhost:5173
```

---

## 🌐 Deployment Details

### Backend Deployment (e.g., Render, Railway)
1. Set up a MongoDB Atlas cluster and get the connection string.
2. Deploy the `backend` directory.
3. Configure the environment variables on the hosting platform:
   * `MONGO_URI`: Your MongoDB Atlas connection string.
   * `JWT_SECRET`: A secure random secret key.
   * `PORT`: `5000` (or leave to platform default).
4. Build commands on hosting: `npm install` and start script: `node server.js`.

### Frontend Deployment (e.g., Vercel, Netlify)
1. Deploy the root directory of the repository.
2. Select **Vite** as the framework preset.
3. Configure Build Settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`
4. Set up the Environment Variables (e.g. `VITE_FIREBASE_*` keys if Firebase social login is utilized).

