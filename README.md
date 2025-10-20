# Vineyards Map App

An interactive Leaflet map that showcases notable vineyards across Sonoma and Napa counties. Users can browse marker locations, open popups, and view rich detail cards including descriptions, highlights, photo galleries, and contact information to help plan wine tourism adventures.

## Getting Started

This project is a static site with no build step. To view it locally:

1. Open `index.html` directly in your browser, or
2. Serve the folder with a simple HTTP server (for example, `python -m http.server`) and navigate to `http://localhost:8000`.

## Features

- Leaflet-powered interactive map with custom popups
- Detail panel with vineyard descriptions, highlights, and contact info
- Responsive layout with curated image galleries
- Quick navigation list to jump between vineyard profiles
- Built-in admin panel to add, edit, or delete vineyard entries stored in your browser
- Protected administration workspace that requires an authorized sign-in before changes can be made

## Admin panel

- Select **Manage vineyards**. If you have not signed in during this browser session you'll be prompted for credentials before the admin workspace opens.
- The sample credentials bundled with the demo are:
  - Username: `admin`
  - Password: `vineyard2024`
  - (Alternate account) Username: `manager`, Password: `cellarpass`
- Once signed in, choose an existing entry on the left to edit, or use **Add new vineyard** to start from scratch.
- Fields accept multiple highlights and image URLs entered one per line.
- Use the **Log out** button in the admin header to end your session. Authentication status is stored in `sessionStorage`, so closing the browser tab will also sign you out.
- Changes are saved to `localStorage` in your browser so they persist between visits. Use your browser's storage tools to reset to the default dataset if needed.

### Customizing vineyard data

- The default dataset is defined near the top of `assets/app.js` in the `defaultVineyards` array. Update these entries to ship your own properties with the application bundle.
- Edits made through the admin UI are written to `localStorage` under the key `vineyardData`. Clearing that key reverts the app to the static defaults bundled with the codebase.
- To seed additional entries for first-time visitors, duplicate an object in the array and provide a unique `id`, coordinates, and optional gallery and highlight data.

### Managing admin accounts

- Authentication is handled by the `authorizedUsers` map in `assets/app.js`. Update or extend this map to distribute new credentials to authorized staff.
- Passwords are stored in plain text for demonstration purposes. For a production deployment you should replace this logic with a secure, server-backed authentication flow and transport layer security.
- `sessionStorage` tracks login status for the current tab only. Clearing browser session data or refreshing after logging out returns the UI to the signed-out state.

## Credits

Map tiles courtesy of [OpenStreetMap](https://www.openstreetmap.org/) contributors.
