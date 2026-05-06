# 🚀 Khurana Travels — Full-Stack Travel Booking Platform

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React + Tailwind CSS v4 + Framer Motion + React Three Fiber
- **Backend**: Node.js + Express 5 + MongoDB (Mongoose)
- **Auth**: JWT (Admin only)

---

## 🏗️ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env file with your MongoDB URI

# Seed database (creates admin + sample packages)
npm run seed

# Start development server
npm run dev
```

The backend runs on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on **http://localhost:3000**

---

## 🔐 Admin Credentials (Default)

```
Username: admin
Password: admin123
```

Access admin panel at: **http://localhost:3000/admin/login**

---

## 📁 Project Structure

```
khurana-travels/
├── frontend/                    # Next.js App
│   └── src/
│       ├── app/                 # Pages (App Router)
│       ├── components/          # Reusable components
│       ├── context/             # Auth + Booking state
│       ├── hooks/               # Custom hooks
│       └── lib/                 # API, utils, constants
├── backend/
│   └── src/
│       ├── config/              # DB + ENV config
│       ├── models/              # Mongoose models
│       ├── routes/              # Express routes
│       ├── controllers/         # Request handlers
│       ├── middleware/          # Auth, upload, errors
│       ├── utils/               # Validators, JWT
│       └── seed/                # Database seeder
└── README.md
```

---

## 🔗 API Endpoints

### Public
- `GET /api/packages` — List active packages
- `GET /api/packages/:id` — Package details + booked seats
- `POST /api/bookings` — Create booking
- `POST /api/upload/single` — Upload single file
- `POST /api/upload` — Upload multiple files

### Admin (JWT Required)
- `POST /api/admin/login` — Admin login
- `GET /api/admin/profile` — Admin profile
- `GET /api/bookings` — All bookings
- `GET /api/bookings/stats` — Dashboard stats
- `PUT /api/bookings/:id/status` — Update status
- `POST /api/packages` — Create package
- `PUT /api/packages/:id` — Update package
- `DELETE /api/packages/:id` — Delete package

---

## 🚀 Deployment

### Backend (Render / Railway / VPS)
1. Set environment variables (MongoDB Atlas URI, JWT_SECRET, etc.)
2. Start command: `npm start`

### Frontend (Vercel)
1. Connect Git repository
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy automatically

---

## 💰 Important Notes

- **No online payment** — All payments are handled offline
- **Admin only auth** — No public user registration
- **File uploads** — Stored in `/uploads` directory (consider S3 for production)
