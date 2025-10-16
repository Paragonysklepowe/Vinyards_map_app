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

## Admin panel

- Select **Manage vineyards** to open the administrative workspace.
- Choose an existing entry on the left to edit, or use **Add new vineyard** to start from scratch.
- Fields accept multiple highlights and image URLs entered one per line.
- Changes are saved to `localStorage` in your browser so they persist between visits. Use your browser's storage tools to reset to the default dataset if needed.

## Credits

Map tiles courtesy of [OpenStreetMap](https://www.openstreetmap.org/) contributors.
