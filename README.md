# Vehicle Selector Application

A simple web application that lets you select your vehicle and upload maintenance records.

---

## What Does This App Do?

- Select your vehicle (Make → Model → Badge)
- Upload a maintenance logbook file (optional, .txt format)
- Get instant confirmation of your submission

---

## Quick Setup (2 Minutes)

### 1. Install
```bash
npm install
```

### 2. Start (Open 2 Terminal Windows)

**Terminal 1:**
```bash
npm run dev-frontend
```
Then open: http://localhost:5173

**Terminal 2:**
```bash
npm run dev-backend
```

Done! Use Terminal 1 URL to open the app in your browser.

---

## How to Test

```bash
npm test
```

All tests should pass.

---

## Deploy to Production

```bash
npm run build-frontend
npm start
```

App will be at: http://localhost:3000

---

## Run Backend with PM2

From the workspace root, start the backend under PM2 with:

```bash
npm run pm2-start
```

Stop the PM2 backend process:

```bash
npm run pm2-stop
```

Restart the backend process:

```bash
npm run pm2-restart
```

View logs for the backend:

```bash
npm run pm2-logs
```

---

## Available Vehicles

**Ford**: Ranger, Falcon, Fiesta  
**BMW**: 130d, 240i, 320e  
**Tesla**: Model 3, Model S, Model X

---

## Troubleshooting

**Port 3000 already in use?**
```bash
# Stop it or change port in backend/server.ts
```

**"Cannot find module" error?**
```bash
npm install
```

**Tests failing?**
```bash
npm install
npm test
```

---

## Requirements

- Node.js v18+
- npm v9+

Check:
```bash
node --version
npm --version
```

---

## Folders

- `frontend/` - Website (React)
- `backend/` - Server (Express)
- `package.json` - Settings

---

## Commands Reference

| Command | What it does |
|---------|------------|
| `npm install` | Install dependencies |
| `npm run dev-frontend` | Start website (port 5173) |
| `npm run dev-backend` | Start server (port 3000) |
| `npm run build-frontend` | Build for production |
| `npm start` | Run production app |
| `npm test` | Run all tests |
| `npm run test-frontend` | Test website only |
| `npm run test-backend` | Test server only |
