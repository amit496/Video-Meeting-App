# Frontend File and Folder Structure

Frontend path: `D:\\video-meeting-app\\frontend`

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
│   │   ├── common/ (currently empty)
│   │   └── meeting/ (currently empty)
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx (empty)
│   │   │   └── Register.jsx (empty)
│   │   ├── Chat/ (currently empty)
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx (empty)
│   │   └── Meeting/ (currently empty)
│   ├── services/
│   │   ├── auth/
│   │   │   └── auth.service.js (empty)
│   │   ├── chat/ (currently empty)
│   │   └── meeting/ (currently empty)
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Main entries

- `src/main.jsx` — React entry point; mounts `App` into the page.
- `src/App.jsx` — current application screen; still the Vite/React starter template.
- `src/App.css`, `src/index.css` — component and global styles.
- `src/assets/` — images and logos used by the starter screen.
- `src/components/` — planned reusable UI grouped into auth, chat, common and meeting folders; currently empty.
- `src/pages/` — planned auth, chat, dashboard and meeting screens. `Login.jsx`, `Register.jsx` and `Dashboard.jsx` exist but are empty and are not connected to the app.
- `src/services/` — planned API/service modules for auth, chat and meetings. `auth.service.js` exists but is empty; chat and meeting folders are empty.
- `public/` — static icons served as-is.
- `index.html` — Vite HTML entry document.
- `vite.config.js` — Vite configuration and React plugin.
- `eslint.config.js` — ESLint configuration.
- `package.json` / `package-lock.json` — scripts and locked npm dependencies.
- `README.md` — frontend setup notes (currently template documentation).

## Excluded generated/installed folders

`node_modules/` contains installed npm packages and `dist/` contains generated build output. Both exist in this checkout but are omitted from the tree because they are generated or machine-specific rather than maintained source structure.
