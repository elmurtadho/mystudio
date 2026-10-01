```markdown
# 🎨 Novasco Taste & Code Guidelines (Anti-Islop Standard)

Panduan wajib ini memastikan seluruh kode dan antarmuka Novasco terasa profesional, elegan, berkarakter, dan jauh dari kesan kaku AI (*aislop*).

### 1. Prinsip Desain Visual (UI/UX)
* **Palet Warna "Deep Studio":** Gunakan warna dasar gelap yang dalam (`bg-slate-950` atau `bg-zinc-950`). Hindari hitam pekat (`#000000`). Gunakan kartu transparan (`bg-white/5` atau `bg-slate-900/50`) dengan border sangat tipis (`border-white/10`).
* **Aksen Subtle (Halus):** Hindari warna primer terang benderang. Gunakan *glow* tipis dari warna indigo, violet, atau emerald (`shadow-[0_0_15px_rgba(99,102,241,0.1)]`) hanya pada elemen interaktif yang sedang aktif.
* **Tipografi Terukur:** 
  * Judul harus rapat (`tracking-tight`) dan tebal (font-semibold/bold).
  * Paragraf menggunakan warna *muted* (`text-slate-400`) dengan *line-height* lega (`leading-relaxed`).

### 2. Micro-Interactions & State
* **Transisi Halus:** Semua hover state pada tombol dan link wajib memiliki transisi (`transition-all duration-200 ease-in-out`).
* **Kenyamanan Loading:** Jangan pernah membiarkan layar *freeze*. Selalu tampilkan *Loading Skeleton* yang halus (pulse) atau indikator *spinner* minimalis saat mengambil data dari Supabase atau menunggu AI memproses prompt.
* **Empty States yang Humanis:** Jika tabel admin kosong atau workspace belum ada chat, berikan ilustrasi ikon sederhana dan teks ajakan yang ramah (misal: "Belum ada tools di sini. Tambahkan tool pertamamu.").

### 3. Arsitektur Kode (Clean Code)
* **Modularitas Ketat:** Jangan biarkan file `page.tsx` mencapai 500 baris. Pecah form, tabel, dan area chat menjadi komponen terpisah di folder `/components`.
* **Strict TypeScript:** Tidak ada toleransi untuk tipe `any`. Definisikan `interface` atau `type` untuk tabel Supabase dan balikan (response) AI.
* **Error Handling Asli:** Jangan gunakan standard `console.log` untuk user. Tangkap error database atau limit AI dan tampilkan *Toast/Snackbar* notifikasi elegan di pojok layar.