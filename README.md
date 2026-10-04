# store-rating-platform

A full-stack Store Rating application with an Express + MySQL backend and a React frontend.

## Features

- User authentication (register/login) using JWT
- Store listing and search by name/address
- Rating & review submission with 1-5 stars
- Average rating display per store
- Responsive frontend UI

## Project Structure

- `/backend` - Express REST API, Sequelize models, MySQL integration
- `/frontend` - React + Vite client app

## Backend Setup

1. Navigate to backend:
   ```bash
   cd /home/runner/work/store-rating-platform/store-rating-platform/backend
   ```
2. Copy env template and configure values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start server:
   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` by default.

### API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/stores?search=`
- `GET /api/stores/:id`
- `POST /api/stores` (admin only)
- `GET /api/ratings/store/:storeId`
- `POST /api/ratings` (authenticated user)

## Frontend Setup

1. Navigate to frontend:
   ```bash
   cd /home/runner/work/store-rating-platform/store-rating-platform/frontend
   ```
2. Copy env template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173` by default and calls backend via `VITE_API_URL`.
