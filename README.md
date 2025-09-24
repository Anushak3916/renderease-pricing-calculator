RenderEase Free Trial (Static Demo)

Overview

This is a small, self-contained demo that simulates a RenderEase free trial experience:
- Basic login/register form (client-side only)
- Route-guarded dashboard using your provided hero image
- Two mini experiences:
  - Virtual Photography: place a product image onto preset backgrounds and download
  - 3D Model Viewer: interact with a sample GLB model using `<model-viewer>`

Folder Structure

```
/workspace
  ├─ index.html             # Login/Register
  ├─ dashboard.html         # Trial Dashboard (guarded)
  ├─ virtual.html           # Virtual Photography demo (guarded)
  ├─ model.html             # 3D model demo (guarded)
  ├─ styles.css             # Global styles
  ├─ js/
  │   ├─ auth.js            # Auth + form handling
  │   ├─ guard.js           # Simple route guard using localStorage
  │   └─ ui.js              # Shared UI helpers
  └─ public/
      └─ hero.png           # Place your provided image here (see below)
```

Using Your Image

- Save the screenshot/image you shared as `hero.png` into `public/` so it becomes `/public/hero.png`.
- All pages reference this path. A placeholder will appear if the file is missing.

Run Locally

Option A: Use a quick static server (recommended)

```
npx --yes http-server -p 5173 -c-1 .
```

Then open `http://localhost:5173/`.

Option B: Any other static server (NGINX, Python http.server, etc.)

```
python3 -m http.server 5173
```

Notes

- This demo does not have a backend. It uses `localStorage` for a temporary session key.
- To sign out, use the avatar menu on the top-right of the dashboard and mini pages.
- Replace theme colors, copy, and assets to match brand needs.

