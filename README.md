# Expense Tracker — Frontend

A clean, minimal React frontend for the Expense Tracker API. Built with Vite, React Router, and Axios. Deployed as a static site on Render.

**Live Demo:** https://expense-tracker-frontend-b7ru.onrender.com  
**Backend Repo:** https://github.com/rishabburman2/expense-tracker-api

---

## Screenshots

### Login
Clean auth flow with validation and error handling.

### Dashboard
Spending overview with stats, recent expenses, and category breakdown.

### Expenses
Full CRUD — add, edit, delete expenses with a modal form.

### Reports
Monthly spending timeline and category breakdown with percentages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 8 |
| Routing | React Router v6 |
| HTTP client | Axios |
| State management | React Context API |
| Styling | Plain CSS (no UI library) |
| Deployment | Render Static Site |

---

## Architecture

```
App.jsx
├── AuthProvider (Context API)
│   └── token + user stored in localStorage
│       persists across page refreshes
│
├── BrowserRouter
│   ├── /login        → Login.jsx     (public)
│   ├── /register     → Register.jsx  (public)
│   ├── /             → Dashboard.jsx (protected)
│   ├── /expenses     → Expenses.jsx  (protected)
│   └── /reports      → Reports.jsx   (protected)
│
└── ProtectedRoute
    └── redirects to /login if no token
```

### Axios Interceptors

```
Every API request
      ↓
Request interceptor
      reads token from localStorage
      attaches Authorization: Bearer <token>
      ↓
Backend API
      ↓
Response interceptor
      if 401 → clear localStorage → redirect to /login
      (handles token expiry automatically)
```

---

## Project Structure

```
src/
├── api/
│   └── axios.js            # Axios instance + interceptors
├── context/
│   └── AuthContext.jsx     # JWT token + user, login(), logout()
├── components/
│   └── Sidebar.jsx         # NavLink nav + CATEGORY_ICONS map
├── pages/
│   ├── Login.jsx           # POST /api/auth/login
│   ├── Register.jsx        # POST /api/auth/register
│   ├── Dashboard.jsx       # GET expenses + reports (parallel)
│   ├── Expenses.jsx        # Full CRUD + modal form
│   └── Reports.jsx         # Monthly + category breakdown
├── App.jsx                 # Routing + ProtectedRoute
├── main.jsx                # Entry point
└── index.css               # All styles (no CSS modules)
```

---

## Running Locally

### Prerequisites
- Node 20+
- Backend API running (see [expense-tracker-api](https://github.com/rishabburman2/expense-tracker-api))

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/rishabburman2/expense-tracker-frontend.git
cd expense-tracker-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```
VITE_API_URL=http://localhost:8080
```

Point to `https://expense-tracker-api-qcdw.onrender.com` to use the live backend instead.

**4. Start dev server**
```bash
npm run dev
```

App starts on `http://localhost:5173`

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

Set this in Render's Static Site environment variables for production.

---

## Key Design Decisions

**No UI library** — styles written from scratch. Linear/Notion aesthetic: minimal borders, subtle backgrounds, clean typography. Keeps the bundle small and the design distinctive.

**Context API over Redux** — app state is simple (just auth). Context + localStorage is sufficient and keeps the codebase lean.

**Axios interceptors** — auth header and 401 handling are centralised in one place. No component needs to think about tokens.

**ProtectedRoute** — wraps all authenticated pages. Token check happens at the routing level, not scattered across components.

**Parallel API calls on Dashboard** — `Promise.all([expenses, monthly, category])` fetches all three in parallel instead of sequentially, cutting load time by ~2/3.

---

## Future Enhancements

- [ ] Bar chart visualizations on Reports page (Recharts)
- [ ] Filter expenses by category and date range
- [ ] Export expenses as CSV
- [ ] Dark mode
- [ ] Mobile responsive layout
