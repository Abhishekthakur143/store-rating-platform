# Store Rating Platform (Express + PostgreSQL + React)

## Setup
1. Create DB: `createdb store_rating`
2. Backend: `cd backend && cp .env.example .env` (edit DATABASE_URL), then
   `npm i && npm run db && npm run seed && npm start`
3. Frontend: `cd frontend && npm i && npm run dev` (http://localhost:5173)


## Roles
- Admin: dashboard, add users/stores, filter + sortable lists, user details
- Normal user: sign up, search stores, rate 1-5, modify rating, change password
- Store owner (created by admin): average rating + list of raters
