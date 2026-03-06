# PCWorld-style Website

A full-stack tech news site similar to [PCWorld](https://www.pcworld.com/), with **Next.js** frontend, **NestJS** backend, **MySQL**, **MongoDB**, **Redis**, and an **admin dashboard**.

## Stack

- **Frontend**: React, Next.js 14 (App Router)
- **Backend**: NestJS (REST API)
- **Databases**: MySQL (articles, categories, users), MongoDB (activity logs), Redis (caching)
- **Admin**: Dashboard at `/admin` for articles and categories

## Quick start

### 1. Start databases (Docker)

```bash
docker-compose up -d
```
> CREATE DATABASE cpworld CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Then set env (see below). For MySQL use:
- Host: `localhost`, Port: `3306`
- User: `pcworld`, Password: `pcworld`, Database: `pcworld`
- Or root: `MYSQL_USER=root`, `MYSQL_PASSWORD=root`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL/Mongo/Redis URLs
npm install
npm run start:dev
```

Seed admin user and categories (after DB is up):

```bash
npm run seed
# Login: admin@pcworld.com / admin123
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

- **Site**: http://localhost:3001  
- **Admin**: http://localhost:3001/admin (login: admin@pcworld.com / admin123)  
- **API**: http://localhost:4000  

## Environment

**Backend** (`backend/.env`):

- `PORT` – API port (default 4000)
- `FRONTEND_URL` – CORS origin (e.g. http://localhost:3001)
- `MYSQL_*` – MySQL connection
- `MONGODB_URI` – MongoDB connection
- `REDIS_URL` – Redis connection
- `JWT_SECRET` – Secret for JWT (change in production)

**Frontend** (`frontend/.env.local`):

- `NEXT_PUBLIC_API_URL` – Backend API URL (e.g. http://localhost:4000)

## Features

- **Public site**: Home with latest stories, category pages, article detail with view count
- **Categories**: News, Best Picks, Reviews, How-To, Deals, Laptops, Gaming, Windows, Security (seed creates defaults)
- **Articles**: Title, slug, excerpt, body, image URL, type (news/review/how-to/deal/best-pick), category, publish toggle
- **Admin**: Login (JWT), articles CRUD, categories CRUD
- **Caching**: Article list and single-article responses cached in Redis
- **Activity**: MongoDB used for activity logging (schema in place for future use)

## Project structure

```
pcweb_template/
├── backend/          # NestJS API
│   └── src/
│       ├── modules/  # auth, users, articles, categories, activity
│       └── common/    # Redis
├── frontend/         # Next.js app
│   └── src/
│       ├── app/      # pages: /, /category/[slug], /article/[slug], /admin/*
│       ├── components/
│       └── lib/
├── docker-compose.yml
└── README.md
```

## License

MIT
