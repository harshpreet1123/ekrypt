# 🔐 Ekrypt – Secure Link Sharing with Privacy and Analytics

Ekrypt is a privacy-focused link shortener built using **Next.js (TypeScript)** and **Supabase**. It supports secure, customizable links with advanced options like password protection, expiry controls, and real-time analytics — all wrapped in a clean, minimal dashboard.

Built as a showcase project for job interviews to highlight full-stack skills and product thinking.

[🌐 Live Demo](https://ekrypt.vercel.app)

---

## ✨ Features

### 🔗 Link Management
- Create shortened links with:
  - 🔑 Password protection
  - 🕒 Expiry date
  - 💥 Burn-after-read
  - 🔢 Click limit

### 📊 Analytics
- Per-link analytics (IP, browser, device, timestamp)
- Visual dashboard with total clicks per link

### 👤 Auth & User Features
- Login / Signup (Supabase Auth)
- Forgot password flow
- View & edit profile
- Sign-out with confirmation

### 📱 Share & Extras
- Generate and download QR code for each link
- Share URL directly via native share dialog
- Open Graph (OG) tags for better social previews

---

## 🧱 Tech Stack

| Layer           | Tech Used                         |
|----------------|-----------------------------------|
| **Frontend**    | Next.js + TypeScript |
| **Styling**     | Tailwind CSS                      |
| **Database**    | Supabase (PostgreSQL)             |
| **Auth**        | Supabase Auth                     |
| **Hosting**     | Vercel                            |
