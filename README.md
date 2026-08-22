# همزا (Homeza) — فروشگاه اینترنتی لوازم خانگی

Persian/RTL home-appliance storefront — a portfolio demo built with React and Vite.
This is a **frontend-only demo**: no backend, no real payment gateway, no
authentication, no database. Cart data persists locally in the browser via
`localStorage`; nothing is sent anywhere.

## Tech stack

- React 18 + Vite 5
- Tailwind CSS 3
- lucide-react (icons)
- Plain React state + Context for navigation and cart — no router, no state
  library, no backend

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Other scripts

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## What's implemented

- Home, Products (search/filter/sort), Product Details, related products
- Shopping cart (add/increase/decrease/remove/clear) shared via React Context,
  persisted to `localStorage`
- Demo checkout with client-side Persian-aware form validation, delivery/payment
  method selection, order review, and a demo success screen
- Full RTL/Persian UI throughout

## Project structure

```
├── index.html          # HTML shell, RTL/Persian meta, Vazirmatn font
├── src/
│   ├── main.jsx         # React entry point
│   ├── HomezaHome.jsx   # Application (all components, data, cart/checkout logic)
│   └── index.css        # Tailwind directives + small global CSS
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```
