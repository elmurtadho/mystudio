# 📄 MEGA PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Novasco Digital Studio Platform

### 1. Ringkasan Eksekutif & Visi Produk
* **Nama Produk:** Novasco
* **Deskripsi:** Platform Digital Studio modular berbasis web yang menyediakan berbagai AI-powered tools kreatif (seperti PRD Maker, UI/UX Vibe Design Maker, dll.), dilengkapi dengan **Admin Dashboard (Full CRUD)** untuk mengelola daftar tools, ikon, dan tautan secara dinamis.
* **Standar Kualitas:** Mengusung desain humanis elegan dan kode terstruktur (merujuk pada `taste.md`) untuk menghindari kesan generik buatan AI (*aislop*).

### 2. Arsitektur & Struktur Modul Utama
1. **Public Tools Directory / Hub (`/`):**
   * Halaman utama bergaya etalase untuk menampilkan daftar tools AI yang aktif (diambil secara dinamis dari database Turso).
2. **Workspace Tools AI (`/tools/[slug]`):**
   * **PRD Maker:** Generator dokumen spesifikasi produk dari prompt sederhana.
   * **Vibe Design UI/UX Maker:** Chat AI dengan input link referensi visual, live preview, export struktur JSON (Figma-ready), dan task breakdown.
3. **Admin Panel CRUD (`/admin`):**
   * Halaman manajemen privat untuk **Create, Read, Update, Delete** data tools.
   * Fitur **File Upload** ikon/thumbnail (menggunakan Vercel Blob atau Cloud Storage).
   * Toggle status publikasi (Draft / Published).

### 3. Tech Stack & Infrastruktur
* **Frontend/Backend:** Next.js (App Router, TypeScript, Server Actions)
* **Styling:** Tailwind CSS + Shadcn UI
* **AI Orchestration:** Vercel AI SDK (`ai` & `@ai-sdk/openai`)
* **Database & ORM:** Turso (Edge SQLite) dikelola dengan Drizzle ORM.
* **Deployment:** Vercel

### 4. Struktur Direktori Project
```text
novasco/
├── app/
│   ├── admin/               # Halaman Manajemen CRUD Tools & Upload
│   ├── api/                 # Backend AI Route & Webhooks
│   ├── tools/               # Halaman Dynamic Routing untuk Workspace AI
│   ├── layout.tsx           # Root Layout (Global Providers & Fonts)
│   └── page.tsx             # Public Hub / Landing Page
├── lib/
│   ├── schema.ts            # Skema tabel database Drizzle (tabel: tools)
│   ├── db.ts                # Koneksi ke Turso (libsql/client)
│   └── ai-prompt.ts         # System prompts untuk berbagai tools
├── PRD.md                   # Dokumen Spesifikasi Produk (File Ini)
├── taste.md                 # Panduan Estetika & Clean Code (Anti-Islop)
└── package.json