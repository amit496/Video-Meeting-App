# Frontend File and Folder Structure

Frontend path: `D:\video-meeting-app\frontend`

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── auth/ (currently empty)
│   │   ├── chat/ (currently empty)
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx
│   │   └── meeting/ (currently empty)
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Chat/ (currently empty)
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   └── Meeting/ (currently empty)
│   ├── services/
│   │   ├── auth/
│   │   │   └── auth.service.js
│   │   ├── chat/ (currently empty)
│   │   └── meeting/ (currently empty)
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── FRONTEND_STRUCTURE.md
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Main entries

- `src/main.jsx` — React entry point; mounts `App` into the page.
- `src/App.jsx` — React Router configuration for login, registration and dashboard routes. The root and unknown routes redirect to `/login`; dashboard is protected by `ProtectedRoute`.
- `src/App.css`, `src/index.css` — component and global styles.
- `src/assets/` — images and logos, including the Vite starter assets.
- `src/components/` — reusable UI grouped into auth, chat, common and meeting folders. `ProtectedRoute.jsx` checks for a token in local storage before rendering protected routes.
- `src/pages/` — login, registration and dashboard pages are implemented and connected to the routes. Chat and meeting folders are currently empty.
- `src/services/` — API/service modules for auth, chat and meetings. The auth service is implemented; chat and meeting folders are currently empty.
- `public/` — static icons served as-is.
- `index.html` — Vite HTML entry document.
- `vite.config.js` — Vite configuration and React plugin.
- `eslint.config.js` — ESLint configuration.
- `package.json` / `package-lock.json` — scripts and locked npm dependencies.
- `README.md` — frontend setup notes.

## Excluded generated/installed folders

`node_modules/` contains installed npm packages and `dist/` contains generated build output. Both exist in this checkout but are omitted from the tree because they are generated or machine-specific rather than maintained source structure.
