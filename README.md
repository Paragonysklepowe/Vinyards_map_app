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

## Credits

Map tiles courtesy of [OpenStreetMap](https://www.openstreetmap.org/) contributors.
