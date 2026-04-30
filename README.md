# VELOCE MOTORS

Full-stack premium automotive website for **VELOCE MOTORS** with a React/Vite frontend, Express API, JWT admin authentication, animated pages, and seed data.

## Stack

- Frontend: React, Vite, TailwindCSS, Framer Motion, Three.js, GSAP, Axios, React Router DOM v6
- Backend: Node.js, Express.js, JWT, Mongoose
- Database: MongoDB when `MONGO_URI` is provided. If MongoDB is unavailable, the API uses local SQLite at `server/data/veloce.sqlite` so the site still runs immediately.

## Setup

```bash
cd C:\Users\ASUS\veloce-motors
npm install
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5000/api/health`

## Admin Login

- Email: `admin@veloce.com`
- Password: `admin123`

## Environment

Copy `.env.example` to `.env` and adjust values for your machine:

```env
MONGO_URI=mongodb://127.0.0.1:27017/veloce_motors
JWT_SECRET=change-me-to-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

For instant local development without MongoDB, leave `MONGO_URI` unset. Node 24+ includes the SQLite module used by this fallback.

## API

- `GET /api/cars`
- `GET /api/cars/:id`
- `POST /api/cars` admin only
- `PUT /api/cars/:id` admin only
- `DELETE /api/cars/:id` admin only
- `GET /api/orders` admin only
- `POST /api/orders`
- `GET /api/contact` admin only
- `POST /api/contact`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Deploying From GitHub To Vercel

This repo includes `vercel.json` and `api/index.js`, so Vercel can deploy the Vite frontend and Express API from GitHub.

Use these settings when importing `YashNirgulkar/Velocity_Cars` into Vercel:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `client/dist`
- Install command: `npm install`

Recommended production environment variables:

```env
JWT_SECRET=use-a-long-random-production-secret
MONGO_URI=mongodb+srv://...
```

If `MONGO_URI` is missing, the serverless API uses a temporary SQLite fallback and auto-seeds demo cars/admin. That is fine for a demo, but orders/contact submissions are not durable across serverless cold starts without MongoDB.

## Notes

The 3D viewer uses a stylized Three.js placeholder car model, so the site remains self-contained while still delivering the requested rotating automotive scene. Remote car imagery is loaded from Unsplash URLs seeded by `server/seed.js`.
