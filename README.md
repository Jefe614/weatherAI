# AgroSky — Weather Intelligence Platform

Weather + AI + Forestry — all in one full-stack application.

A weather dashboard built on the [Weather-AI API](https://weather-ai.co/docs), combining real-time weather data, AI-powered agronomic summaries, and computer-vision tree canopy analysis from drone/satellite imagery.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/Django-5-092E20?logo=django)
![Tech Stack](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Tech Stack](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

---

## Features

| Feature | Screenshot | Details |
|---|---|---|
| 🌤 **Weather Dashboard** | — | Current conditions, 7-day forecast, WMO weather codes |
| 🤖 **AI Summaries** | — | Gemini-powered agronomic insights per location |
| 🌳 **Forestry Analysis** | — | Upload drone/satellite images → tree count, canopy health, CV overlay |
| 📱 **Fully Responsive** | — | Works on mobile, tablet, and desktop |
| 🔐 **Secure Proxy** | — | API key stays server-side; frontend never sees `wai_` credentials |
| 📍 **Quick Presets** | — | One-click Kenyan locations: Nairobi, Bomet, Kisumu, Mombasa, Nakuru |

---

## Project Structure

```
weatherAI/
├── backend/                  # Django 5 + DRF
│   ├── core/                 # Project settings, URLs, WSGI
│   ├── weather/              # /api/weather/* endpoints
│   ├── trees/                # /api/trees/* endpoints
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React 19 + Vite
│   ├── src/
│   │   ├── api/              # Axios HTTP client
│   │   ├── components/       # WeatherCard, ForecastGrid, AiSummary, SearchBar, Sidebar, Toast
│   │   └── pages/            # WeatherPage, TreesPage
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Weather-AI API key (`wai_...`) from [weather-ai.co/docs](https://weather-ai.co/docs)

### 1. Clone & configure

```bash
git clone https://github.com/Jefe614/weatherAI.git
cd weatherAI
```

Create a `.env` file in `backend/`:

```bash
cp backend/.env.example backend/.env  # or create it manually
```

Edit `backend/.env` with your keys:

```env
WEATHER_AI_KEY=wai_your_key_here
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 2. Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py check   # should print "0 issues"
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run build
```

### 4. Run

```bash
# Terminal 1 — Django (serves API + production frontend)
cd backend && python manage.py runserver

# Terminal 2 — Vite dev server (hot reload, proxies /api → Django)
cd frontend && npm run dev
```

Open **http://localhost:5173** (dev with hot reload) or **http://localhost:8000** (production build).

---

## API Routes

All routes are prefixed with `/api/` and proxied through Django to keep the API key server-side.

| Method | Route | Description |
|---|---|---|
| GET | `/api/weather/?lat=&lon=&days=` | Current weather + 7-day forecast |
| GET | `/api/weather/hourly/?lat=&lon=` | Hourly forecast data |
| GET | `/api/weather/usage/` | API usage stats |
| POST | `/api/trees/analyze/` | Upload image for tree analysis |
| GET | `/api/trees/history/` | Past analysis history |
| GET | `/api/trees/quota/` | Remaining analysis quota |

---

## Deployment

### Option A — Combined (Render)

| Setting | Value |
|---|---|
| **Runtime** | Python |
| **Build command** | `pip install -r requirements.txt && cd frontend && npm install && npm run build` |
| **Start command** | `gunicorn core.wsgi:application` |
| **Env vars** | `WEATHER_AI_KEY`, `DJANGO_SECRET_KEY`, `DEBUG=False` |

### Option B — Split (Backend on Render, Frontend on Netlify)

**Frontend:**

```bash
cd frontend
npm run build
# Deploy frontend/dist/ to Netlify or Vercel
```

Set `VITE_API_BASE` to your Render backend URL if deploying separately.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WEATHER_AI_KEY` | ✅ | Your `wai_` API key from weather-ai.co |
| `DJANGO_SECRET_KEY` | ✅ | Random string for production |
| `DEBUG` | ❌ | Defaults to `True` for development |

---

## Built With

- **Frontend:** React 19, Vite 6, Tailwind CSS 4, Axios
- **Backend:** Django 5, Django REST Framework, httpx
- **API:** [Weather-AI](https://weather-ai.co/docs)

---

## License

MIT