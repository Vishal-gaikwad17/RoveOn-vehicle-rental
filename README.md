# RoveOn — Vehicle Rental Web Application

A full-stack MERN application for renting Cars, Bikes, and Electric Scooters on a
daily or monthly basis, with a user-facing booking flow and an admin dashboard.

## Tech Stack

- **Frontend:** React 18 (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Uploads:** Multer (local disk storage; swap for Cloudinary easily)

## Folder Structure

```
vehicle-rental-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Vehicle, Booking, Review
│   ├── controllers/              # Route handler logic
│   ├── routes/                   # Express routers
│   ├── middleware/                # auth (JWT), admin guard, upload, errors
│   ├── utils/                    # token generation, price calc, seed script
│   ├── uploads/                  # uploaded vehicle images (served statically)
│   ├── server.js                 # app entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js          # axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/           # Navbar, Footer, VehicleCard, Filters, ProtectedRoute
    │   ├── pages/                # Home, VehicleList, VehicleDetails, Login, Register, MyBookings
    │   └── pages/admin/          # AdminLayout, AdminOverview, AdminVehicles, AdminBookings, AdminUsers
    ├── index.html
    └── tailwind.config.js
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm run seed               # creates an admin user + sample vehicles (optional)
npm run dev                 # starts on http://localhost:5000
```

Seeded admin login: `admin@vehiclerental.com` / `admin123` (change this in production).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`,
so no CORS configuration is needed locally.

### 3. MongoDB

Run MongoDB locally (`mongod`) or point `MONGO_URI` in `backend/.env` to a MongoDB
Atlas cluster.

## Core API Endpoints

| Method | Endpoint                          | Access        | Description                          |
|--------|------------------------------------|---------------|---------------------------------------|
| POST   | `/api/auth/register`               | Public        | Register a new user                   |
| POST   | `/api/auth/login`                  | Public        | Log in, returns JWT                   |
| GET    | `/api/auth/me`                     | Private       | Get logged-in user profile            |
| GET    | `/api/vehicles`                    | Public        | List vehicles (filter/search/sort)    |
| GET    | `/api/vehicles/:id`                | Public        | Get vehicle details                   |
| POST   | `/api/vehicles`                    | Admin         | Create vehicle (multipart, images[])  |
| PUT    | `/api/vehicles/:id`                | Admin         | Update vehicle                        |
| DELETE | `/api/vehicles/:id`                | Admin         | Delete vehicle                        |
| PATCH  | `/api/vehicles/:id/availability`   | Admin         | Toggle/set availability               |
| POST   | `/api/bookings`                    | Private       | Create a booking                      |
| GET    | `/api/bookings/my`                 | Private       | Current user's bookings               |
| GET    | `/api/bookings`                    | Admin         | All bookings (filter by status)       |
| PATCH  | `/api/bookings/:id/status`         | Admin         | Update booking status                 |
| PATCH  | `/api/bookings/:id/cancel`         | Private       | Cancel own booking                    |
| POST   | `/api/reviews`                     | Private       | Review a completed booking            |
| GET    | `/api/reviews/vehicle/:vehicleId`  | Public        | Get reviews for a vehicle             |
| GET    | `/api/users`                       | Admin         | List all users                        |
| DELETE | `/api/users/:id`                   | Admin         | Delete a user                         |

## Query Params for `GET /api/vehicles`

`type`, `minPrice`, `maxPrice`, `available`, `search`, `city`, `sort`
(`price_asc` | `price_desc` | `newest` | `rating`), `page`, `limit`.

## Notes on Bonus Features

- **Reviews & ratings**: users may review a booking only after its status is `completed`;
  a vehicle's `ratingsAverage`/`ratingsCount` are recalculated automatically.
- **Location filtering**: vehicles store `location.city`, filterable via `?city=`.
- **E-scooter battery status**: `batteryStatus` (0–100) is shown on scooter listings.
- **Payments**: not wired up by default. To add Stripe, create a
  `POST /api/bookings/:id/create-payment-intent` route using the Stripe Node SDK
  and confirm payment client-side before marking `paymentStatus: "paid"`.

## Deployment

The app is deploy-ready as-is. Summary — see the full walkthrough further down for exact steps:

1. **Database:** create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster, get the connection string.
2. **Images:** set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in the backend env
   (free tier at [cloudinary.com](https://cloudinary.com)). Without these, uploads fall back to local disk
   storage, which most hosts wipe on every redeploy — fine for local dev, not for production.
3. **Backend:** deploy `backend/` to [Render](https://render.com) or [Railway](https://railway.app)
   (`npm install` / `npm start`), with all the env vars from `.env.example` filled in.
4. **Frontend:** set `VITE_API_URL=https://<your-backend-url>/api` in `frontend/.env.production`
   (copy from `.env.production.example`), then deploy `frontend/` to [Vercel](https://vercel.com) or
   [Netlify](https://www.netlify.com) (`npm run build`, output dir `dist`).
5. Update the backend's `CLIENT_URL` env var to the deployed frontend URL (for CORS), redeploy.

### Step-by-step deployment guide

**1. Push to GitHub**
```bash
cd vehicle-rental-app
git init && git add . && git commit -m "Initial commit"
```
Create a repo on GitHub and push — Render/Vercel deploy straight from a connected repo.

**2. MongoDB Atlas**
- Create a free cluster.
- Database Access → add a DB user + password.
- Network Access → allow `0.0.0.0/0` (Render/Railway don't have static IPs).
- Copy the connection string → this is your `MONGO_URI`.

**3. Cloudinary**
- Sign up free at cloudinary.com → dashboard shows `Cloud name`, `API Key`, `API Secret`.

**4. Backend on Render**
- New → Web Service → connect the repo → Root directory: `backend`.
- Build command: `npm install`. Start command: `npm start`.
- Add every variable from `.env.example` in the Render dashboard (Atlas URI, JWT secret,
  Cloudinary keys, email SMTP creds, `CLIENT_URL` — fill this in after step 5).
- Deploy. Then open Render's Shell tab and run `npm run seed` once to create the admin user.

**5. Frontend on Vercel**
- Copy `frontend/.env.production.example` to `frontend/.env.production` and set
  `VITE_API_URL=https://<your-render-backend>.onrender.com/api`.
- New Project on Vercel → import the repo → Root directory: `frontend` (Vite preset auto-detected).
- Add `VITE_API_URL` as an env var in Vercel's dashboard too.
- Deploy.

**6. Connect them**
- Go back to Render → update `CLIENT_URL` to your Vercel URL → redeploy the backend.

**7. Verify**
- Register a user, browse vehicles, log in as admin (seeded credentials), add a vehicle with an
  image (confirms Cloudinary works), book it (confirms the admin notification email fires).



- Set strong `JWT_SECRET`, restrict `CLIENT_URL` in CORS config, and disable the
  public seed script in production.
- Swap Multer's disk storage for `multer-storage-cloudinary` if you need
  cloud-hosted images instead of local `/uploads`.
- Add rate limiting (e.g. `express-rate-limit`) on `/api/auth` routes.
