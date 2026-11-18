# Rentora – Rental Booking Website Frontend Demo

A simple, modern, and responsive Rental Booking Web Application built with React.js, Tailwind CSS, Lucide React, and React Router DOM.

---

## 📁 Project Architecture & Components

```
rental-website/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── SearchBar.jsx          # Reusable search input with clear trigger
│   │   │   ├── StatusBadge.jsx        # Available / Unavailable indicator with arrival dates
│   │   │   └── ProductCard.jsx        # Compact horizontal product card layout
│   │   │
│   │   └── customer/
│   │       ├── TopNav.jsx             # Top bar with logo, search, filter button, & admin switch
│   │       ├── CategoryList.jsx       # Horizontally scrollable category pills
│   │       ├── FilterPanel.jsx        # Modal/drawer for availability, sorting, and price range
│   │       └── BottomNavigation.jsx   # Fixed bottom navigation bar with cart badge
│   │
│   ├── layouts/
│   │   └── CustomerLayout.jsx         # Mobile-first customer layout wrapper
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Products.jsx           # Main customer product catalog screen
│   │   │   ├── Cart.jsx               # Customer shopping cart (Screen 4)
│   │   │   ├── MyBookings.jsx         # Customer booking history (Screen 5)
│   │   │   └── Profile.jsx            # Customer profile (Screen 6)
│   │   │
│   │   └── admin/
│   │       └── Dashboard.jsx          # Owner / Admin portal placeholder (Part 2)
│   │
│   ├── data/
│   │   └── products.js                # 12 dummy rental products across 8 categories
│   │
│   ├── App.jsx                        # React Router DOM routing setup
│   ├── index.css                      # Tailwind CSS v4 styling & scrollbar utilities
│   └── main.jsx                       # React entry point
│
├── package.json
└── vite.config.js
```

---

## 🚀 Key Features Implemented (Screen 2: Customer Homepage)

1. **Top Navigation (`TopNav.jsx` & `SearchBar.jsx`):**
   - Brand logo and name: **Rentora**.
   - Live search input matching product names, categories, and specifications.
   - Quick portal switcher to switch between Customer and Owner views.
   - Profile link and filter toggle button with active state indicator.

2. **Horizontal Category Bar (`CategoryList.jsx`):**
   - Categories: *All, Cameras, Electronics, Tools & Equipment, Furniture, Vehicles, Event Equipment, Home Appliances*.
   - Responsive horizontal scrolling without bulky scrollbars.
   - Instant reactive category switching.

3. **Compact Horizontal Product Cards (`ProductCard.jsx`):**
   - Clean horizontal layout optimized for mobile screens.
   - High-resolution product image with unavailable overlay when out of stock.
   - Short specification tags (e.g. `24.1 MP · DSLR · 18-55mm`).
   - Price formatted in INR per day/hour.
   - Live availability badge.
   - `+ Add` button for available items; disabled with tooltip for unavailable items.

4. **Product Availability & Expected Arrival Dates:**
   - Products out of stock clearly state: `Unavailable · Exp: 22 November 2026`.
   - Normal Add to Cart button is deactivated for unavailable items.

5. **Filter & Sort Panel (`FilterPanel.jsx`):**
   - Filter by:
     - **Availability:** All Items, Available Now, Unavailable.
     - **Price Sorting:** Recommended, Low to High, High to Low.
     - **Max Daily Price Slider:** Dynamically limits items up to selected price.
     - **Category Quick Select.**
   - Reset All button to quickly restore defaults.

6. **Fixed Bottom Navigation Bar (`BottomNavigation.jsx`):**
   - Fixed at bottom of the viewport with active navigation indicators:
     - `Products` (Homepage)
     - `Cart` (with dynamic item count badge)
     - `My Bookings`
     - `Profile`

---

## 🛠️ How to Run Locally

```bash
# Start Vite development server
npm run dev

# Build for production
npm run build
```

