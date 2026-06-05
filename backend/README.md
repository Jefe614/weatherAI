# AgroSky — Weather Intelligence Platform

A full-stack weather dashboard built on the [Weather-AI API](https://weather-ai.co/docs), combining real-time weather data, AI-powered agronomic summaries, and computer-vision tree canopy analysis.

**Stack:** Django 5 + Django REST Framework (backend) · React 19 + Vite (frontend)

---

## Features

| Feature | Details |
|---|---|
| 🌤 **Weather Dashboard** | Current conditions, 7-day forecast, WMO weather codes |
| 🤖 **AI Summaries** | Gemini-powered agronomic insights per location |
| 🌳 **Forestry Analysis** | Upload drone/satellite images → tree count, canopy health, CV overlay |
| 🔐 **Secure Proxy** | API key stays server-side; frontend never sees `wai_` credentials |
| 📍 **Quick Presets** | One-click Kenyan locations: Nairobi, Bomet, Kisumu, Mombasa, Nakuru |

---

## Project Structure

```
weather-ai-app/
├── core/               # Django project (settings, urls)
├── weather/            # /api/weather/* endpoints
├── trees/              # /api/trees/* endpoints
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── api/        # axios client
│   │   ├── components/ # WeatherCard, ForecastGrid, AiSummary, SearchBar
│   │   └── pages/      # WeatherPage, TreesPage
│   └── dist/           # built static files (git-ignored)
├── manage.py
├── requirements.txt
└── .env.example
```

---

## Local Setup

### 1. Clone & configure

```bash
git clone https://github.com/YOUR_USERNAME/weather-ai-agrosky.git
cd weather-ai-agrosky

cp .env.example .env
# Edit .env and set WEATHER_AI_KEY=wai_your_key_here
```

### 2. Python backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py check          # should print "no issues"
```

### 3. React frontend

```bash
cd frontend
npm install
npm run build       # builds into frontend/dist/
cd ..
```

### 4. Run

```bash
# Terminal 1 — Django
python manage.py runserver

# Terminal 2 — Vite dev server (hot reload, proxies /api → Django)
cd frontend && npm run dev
```

Open **http://localhost:5173** for dev, or **http://localhost:8000** for the Django-served production build.

---

## API Proxy Routes

All routes are prefixed `/api/` and require no client-side auth.

| Method | Django Route | Weather-AI Endpoint |
|---|---|---|
| GET | `/api/weather/?lat=&lon=&days=` | `GET /v1/weather` |
| GET | `/api/weather/hourly/?lat=&lon=` | `GET /v1/hourly` |
| GET | `/api/weather/usage/` | `GET /v1/usage` |
| POST | `/api/trees/analyze/` | `POST /v1/trees/analyze` |
| GET | `/api/trees/history/` | `GET /v1/trees/history` |
| GET | `/api/trees/quota/` | `GET /v1/trees/quota` |

---

## Deployment (Render)

### Backend (Web Service)

| Setting | Value |
|---|---|
| **Environment** | Python |
| **Build command** | `pip install -r requirements.txt && cd frontend && npm install && npm run build` |
| **Start command** | `gunicorn core.wsgi:application` |
| **Env vars** | `WEATHER_AI_KEY`, `DJANGO_SECRET_KEY`, `DEBUG=False` |

Add `gunicorn` to `requirements.txt` for production.

### Frontend (Static Site — optional split deploy)

```bash
cd frontend && npm run build
# Deploy frontend/dist/ to Netlify or Vercel
# Set VITE_API_BASE= to your Render backend URL
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WEATHER_AI_KEY` | ✅ | Your `wai_` API key from weather-ai.co dashboard |
| `DJANGO_SECRET_KEY` | ✅ | Any long random string for production |
| `DEBUG` | optional | `True` for dev, `False` for production |

---

## Architecture Notes

- **Why Django as a proxy?** Keeps the `wai_` API key out of the browser bundle entirely. The React app only ever calls `/api/*` on the same origin.
- **httpx** is used instead of `requests` for its async-ready, type-annotated API and native timeout support.
- **CORS** is fully open in `DEBUG=True` mode and locked to specified origins in production.
- **Vite proxy** in dev mode forwards all `/api` calls to Django on port 8000, so there's no CORS friction during development.
