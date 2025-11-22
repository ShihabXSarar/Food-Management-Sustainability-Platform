# Food Sustainability Platform — Frontend

Professional, responsive React frontend for the Food Sustainability Platform.  
Provides inventory management, consumption logs, dashboards/charts, resources, receipt uploads and Firebase-based authentication.

---

## Table of contents
- Project overview
- Key features
- Tech stack
- Repository structure
- Getting started
  - Prerequisites
  - Install
  - Firebase setup
  - Environment variables
  - Run (dev / build / preview)
- Development notes
- Troubleshooting
- Contributing
- License

---

## Project overview
This repository contains the frontend application built with Vite + React. It is designed to integrate with a separate backend service and uses Firebase Authentication on the client. The UI is component-driven and intended to be modular and reusable.

---

## Key features
- Firebase authentication (email/password)
- Inventory management with expiry tracking
- Consumption logs (create, view, delete)
- Dashboard with visualizations (charts)
- Resources and upload pages (receipt uploads)
- Reusable UI primitives: Button, Card, InputField, Modal, chart components
- Axios-based service layer for backend integration

---

## Tech stack
- React (Vite)
- Tailwind CSS
- Framer Motion (animations)
- lucide-react (icons)
- axios (HTTP)
- Recharts (charts)
- Firebase Auth (client)

---

## Repository structure (important files)
- src/
  - components/ui/ — UI primitives (Button.jsx, Card.jsx, InputField.jsx, Modal.jsx)
  - components/ui/charts/ — CategoryChart.jsx, ConsumptionChart.jsx
  - components/ui/layout/ — Navbar.jsx, Footer.jsx
  - context/ — AuthContext.jsx, AuthProvider.jsx
  - firbase/ — firebase.init.js (Firebase initialization)  ← note spelling
  - layout/ — MainLayout.jsx
  - pages/ — DashboardPage, Home, InventoryPage, LogsPage, ProfilePage, ResourcesPage, UploadPage
  - pages/auth/ — LoginPage.jsx, RegisterPage.jsx
  - privateRoute/ — PrivateRoute.jsx
  - routes/ — Router.jsx
  - services/ — api.js (axios client & endpoints)
  - utils/ — constants.js
  - api.js — (project-level helper; review for duplication with services/api.js)
- public/
- index.css, App.css, main.jsx

---

## Getting started

### Prerequisites
- Node 16+ (recommended Node 18+)
- npm or yarn
- Firebase project (web app) for authentication

### Install
1. Clone repository
2. From project root:
   - npm install

### Firebase setup
This project expects Firebase to be initialized in `src/firbase/firebase.init.js`. There is an existing file in the repo — confirm its values match your Firebase project.

If you need to create/update it, use the template and replace values from Firebase Console → Project Settings → Your apps:

```javascript
// filepath: src/firbase/firebase.init.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'your-app.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-app.appspot.com',
  messagingSenderId: '...'
  appId: '...'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

Important: AuthContext imports must point to the correct path. If AuthContext imports `../firebase.config` or similar, update it to:
- `import { auth } from '../firbase/firebase.init';` (match the folder name/spelling in this repo)

### Environment variables
- Use Vite env vars for runtime values. Recommended in `.env` at project root:

Vite expects vars prefixed with `VITE_`:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

- Confirm `src/services/api.js` reads `import.meta.env.VITE_API_BASE_URL` (or update accordingly).

### Run
- Dev: npm run dev
- Build: npm run build
- Preview build: npm run preview

Default Vite dev URL is printed in console (usually http://localhost:5173).

---

## Development notes
- UI primitives are in `src/components/ui/` — prefer reusing them for consistency.
- Charts are located in `src/components/ui/charts/`.
- Auth provider lives under `src/context/`. It listens to Firebase auth state and stores the token (if implemented) for API requests.
- There may be two api files: `src/api.js` and `src/services/api.js`. Consolidate to a single services/api.js to avoid duplication.
- Keep Firebase secrets out of the repo. Use env vars when possible.

---

## Troubleshooting
- "Failed to resolve import ../firebase.config": ensure the firebase init file exists and the import path matches. This repo uses `src/firbase/firebase.init.js` — check spelling.
- Token not applied to requests: verify the axios interceptor reads the same localStorage key used by AuthContext (commonly `authToken`).
- CORS errors: configure backend CORS to allow frontend origin.
- Duplicate API modules: if both `src/api.js` and `src/services/api.js` exist, remove or merge duplicates to prevent inconsistent behavior.

---

## Contributing
- Fork, create a feature branch, open a PR with a clear description and related issue.
- Keep changes modular and add/update unit tests where applicable.
- Run linters and formatters before committing.

---

## License
Add your chosen license (e.g., MIT) to the repository and update this section.

---

If you want, I can:
- Create a recommended `.env.example`
- Fix AuthContext import to use the existing `src/firbase/firebase.init.js`
- Consolidate duplicate API modules into `src/services/api.js`
