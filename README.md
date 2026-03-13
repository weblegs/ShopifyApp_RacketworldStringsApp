# Weblegs Strings — App Overview

## What Does This App Do?

**Weblegs Strings** is a Shopify embedded app that lets merchants manage tennis string configurations for rackets. Each configuration (called a Strings Group) stores the string type for the mains and crosses, tension specs, stencil text, and the linked product SKU. This data is served to the storefront via a public API so the theme can display the correct stringing information on product pages.

### Core Workflow
1. Merchant opens the app inside Shopify Admin
2. Merchant creates a Strings Group by entering the vendor name, product SKU, main string type, cross string type, and stencil text
3. The configuration is saved to the database
4. The storefront theme fetches the data from the app's public API and displays it on the relevant product page

---

## App Pages

### 1. Strings Groups (Main Page)
- Table of all saved string configurations
- Columns: Vendor Name, SKU, Tennis Mains, Tennis Crosses, Stencil Text, Actions
- "Create New Vendor" button to open the entry form
- Edit and Delete actions per row

### 2. Add / Edit Form (Modal)
- Vendor Name
- Product SKU
- Tennis Mains (string type for main strings)
- Tennis Crosses (string type for cross strings)
- Stencil Text
- Save / Update / Cancel buttons

### 3. About
- Description of what the app does
- Weblegs branding

---

## Public API Endpoint

This endpoint is called by the Shopify theme — no authentication required.

| Endpoint | What It Returns |
|---------|----------------|
| `GET /api/strings-groups` | All strings group configurations as JSON |

---

## Tech Stack (For Developers)

| Component | Technology |
|----------|-----------|
| Framework | React Router v7 (Node.js) |
| Shopify Integration | Shopify Admin GraphQL API |
| Database | PostgreSQL (hosted on Railway) |
| ORM | Prisma |
| UI | Shopify Polaris Web Components |
| Build Tool | Vite |

---

## Database Tables

| Table | What It Stores |
|-------|---------------|
| Session | Shopify OAuth tokens |
| StringsGroup | Vendor name, product SKU, mains, crosses, stencil text |

---

## Key Files (For Developers)

```
app/
├── routes/
│   ├── app._index.jsx            — Main page: strings group table, create/edit/delete
│   ├── app.about.jsx             — About page
│   ├── app.jsx                   — App shell with nav (Strings Groups / About)
│   ├── api.strings-groups.jsx    — Public API: returns all string configurations
│   ├── auth.$.jsx                — Shopify OAuth handler
│   └── webhooks.*                — Webhook handlers (uninstall, scopes update)
├── shopify.server.js             — Shopify app config and auth helpers
└── db.server.js                  — Prisma client
prisma/
└── schema.prisma                 — Database schema
```

---

## Shopify Permissions Required

| Permission | Reason |
|-----------|--------|
| `write_products` | Access product data to link string configurations to SKUs |

---

## Hosting & Deployment

- **App URL:** `https://shopifyappracketworldstringsapp-production.up.railway.app`
- **Database:** PostgreSQL on Railway
- **Deploy:** Push to `main` branch on GitHub → Railway auto-deploys
- **Store:** `stagingracketworlduk.myshopify.com`
