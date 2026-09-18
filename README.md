# PractiScale Preview Lab (PreviewLab)

A web-based social media preview and collaborative review platform built according to the approved **PRD v1.1**, **Software Architecture Document (SAD v1.1)**, **Development Document v1.1**, and **UI/UX Design Specification v2.4 (Figma reference nodes 72:496 and 82:6)**.

---

## Architecture Overview

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS with the complete 16-color user-supplied design system.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), Multer, Zod validation.
- **Image Storage**: Cloudinary integration with automatic local static storage fallback.
- **Database**: MongoDB Atlas or local MongoDB server.

---

## 16-Color Design Palette

| Token                | Hex       | Role                                              |
| -------------------- | --------- | ------------------------------------------------- |
| `brand-primary`      | `#0ABAB5` | Primary action, active tab pill, thumbnail border |
| `brand-primary-dark` | `#078F8B` | Hover/pressed state, dark teal accents            |
| `brand-primary-soft` | `#E7F9F8` | Selected/active backgrounds, soft badges          |
| `brand-text-primary` | `#202628` | Primary text, headings, icons                     |
| `brand-gray`         | `#697477` | Secondary text, muted labels                      |
| `brand-muted`        | `#9AA2A4` | Metadata, disabled text                           |
| `brand-surface`      | `#F5F7F8` | App background, workspace canvas                  |
| `brand-white`        | `#FFFFFF` | Cards, surfaces, dropdowns                        |
| `brand-border`       | `#DFE5E6` | Dividers, card borders, outlines                  |
| `brand-neutral-soft` | `#EEF1F2` | Neutral surfaces, hover fills                     |
| `brand-success`      | `#2C9A69` | Success status, "Saved just now"                  |
| `brand-success-soft` | `#DDECEA` | Soft success backgrounds                          |
| `brand-danger`       | `#B83A3A` | Revoke action, error states                       |
| `brand-danger-soft`  | `#E7B8B8` | Soft error/warning backgrounds                    |
| `brand-info-soft`    | `#D8E7FA` | Informational badges                              |
| `brand-error-soft`   | `#F3D9CB` | Secondary warning surface                         |

---

## Core Capabilities

1. **Start / Upload Surface (`/`)**:
   - Figma node `72:496` faithful implementation.
   - Drag & drop dropzone (PNG, JPG, WebP up to 10MB).
   - "Try a sample" one-click test button.
   - Platform pre-selection pills (YouTube, Instagram, Facebook, TikTok, LinkedIn).
   - Primary dominant CTA button: "Test My Thumbnail".

2. **Project Workspace (`/project/:id/:platform`)**:
   - Figma node `82:6` canonical desktop workspace.
   - 56px Top Navigation (project title inline rename, save status, Share button, Maya Chen avatar).
   - 48px Platform Context Bar (5 platform tabs, active image indicator, Change Image, Last tested, Re-test, Desktop/Mobile switch).
   - 5 Realistic Platform Simulators:
     - **YouTube**: 56px top bar, 240px sidebar, banner with `↑ Banner`, channel header with logo + `↑ Logo` + Subscribe, videos grid with 2px teal border + `↑ Thumbnail` badge + duration `14:01`, competitor video cards, Shorts row with `↑ Short` badge.
     - **Instagram**: Feed post card & mobile phone frame with profile header, high-res creative, action icons, likes, caption.
     - **Facebook**: Feed post card & mobile phone frame with page header, post text, media, reactions, action row.
     - **TikTok**: Vertical mobile-first short-video feed with user handle, caption, trending audio, right-side action stack.
     - **LinkedIn**: Professional feed post with author header, copy, image canvas, reactions, action row.
   - 280px Right Sidebar:
     - **Asset Tracker**: Live status of Thumbnail, Channel Logo, Channel Banner, Short Frame.
     - **Thumbnail Insights**: 80px circular score gauge (92/100), Text Legibility, Color Contrast, Face Prominence, Mobile Scaling.
     - **Creative Variants Manager**: Switch between variants, add new variants, rename, delete.

3. **Time-Limited Share Links & Guest Reviews (`/share/:token`)**:
   - High-entropy cryptographic tokens hashed with SHA-256 in MongoDB.
   - 24-hour default expiration (with manual options: 1h, 12h, 24h, 3d, 7d, 30d).
   - Owner can revoke links at any time.
   - Public review page accessible without an account.
   - Chronological comments thread and guest composer.
   - Expired / Revoked error screen with return button.

---

## Getting Started

### Prerequisites

- Node.js LTS (v18+)
- MongoDB (local or Atlas connection string)

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.
