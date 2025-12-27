# Website (Public Portfolio)

The public-facing portfolio website. Built with Next.js 14, featuring server-side rendering, i18n support, and a custom design system.

> 📖 **Part of a monorepo** - See the [root README](../../README.md) for full project overview.

---

## ✨ Features

- 🌍 **Bilingual Support** - Full i18n (English/Turkish)
- 🎨 **Custom Design System** - "Polished Authenticity" aesthetic
- ⚡ **Server Components** - Fast initial loads
- 📊 **Analytics** - Mixpanel integration
- 🔍 **SEO Optimized** - Meta tags, Open Graph
- 🌙 **Dark Mode** - System preference + toggle

---

## 🛠️ Installation

### 1. Environment Variables

```bash
cp env.example .env.local
```

Edit `.env.local`:

```bash
# Firebase (from Firebase Console → Project Settings → Your Apps)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Mixpanel (optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
NEXT_PUBLIC_MIXPANEL_HOST=https://api-eu.mixpanel.com
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure

```
website/
├── app/              # Next.js App Router
│   └── [locale]/     # i18n routes
├── components/       # React components
├── lib/              # Firebase, utilities
├── messages/         # i18n translations (en.json, tr.json)
└── content/          # Blog markdown files
```

---

## 🔒 Security

This app is **read-only**. It cannot modify the database.

- ✅ Public read access via Firestore rules
- ❌ Write access blocked
- ✅ Content managed via [Admin CMS](../admin/README.md)

---

## 📚 Related

- [Admin CMS](../admin/README.md)
- [Data Structures](../../docs/DATA_STRUCTURES.md)
- [Style Guide](../../docs/STYLE_GUIDE.md)
