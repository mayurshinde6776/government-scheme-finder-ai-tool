# Government Scheme Finder AI Tool

A monorepo for an AI-powered government scheme finder. Express + TypeScript backend with Postgres/pgvector, React + Vite + Tailwind frontend.

## Project structure

```
.
├── backend/           Express + TypeScript API (pg, pgvector, dotenv)
├── frontend/          React + Vite + TypeScript + Tailwind CSS v3
├── db/                Postgres init scripts (enables pgvector)
├── docker-compose.yml Postgres + backend dev stack
├── render.yaml        Render deployment manifest
└── README.md
```

## Quick start

```bash
# 1. Clone the repo
git clone <your-repo-url> government-scheme-finder-ai-tool
cd government-scheme-finder-ai-tool

# 2. Configure environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start Postgres + backend in Docker
docker compose up --build

# 4. In another terminal, start the frontend dev server
cd frontend
npm install
npm run dev
```

Backend will be available at http://localhost:4000 and the frontend dev server at http://localhost:5173. The Vite dev server proxies `/api/*` requests to the backend.

## Deployment

- **Backend**: `render.yaml` defines a Render web service that builds and runs from `/backend`.
- **Frontend**: `frontend/vercel.json` rewrites `/api/*` to the Render backend URL — set this URL before deploying to Vercel.

## Required environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
