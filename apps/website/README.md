# Portfolio Website (Public)

The public-facing frontend of the portfolio ecosystem. A highly optimized, bilingual (EN/TR), and accessible personal website.

> 📖 **Part of a monorepo** - See the [root README](../../README.md) for the full architecture.

---

## ✨ Features

- **🌍 Internationalization**: Native support for English and Turkish via `next-intl`.
  - Automatic language detection.
  - SEO-friendly URL structure (`/en/...`, `/tr/...`).
- **⚡ Performance**: Built on Next.js 16 App Router with Server Components.
- **🎨 Design System**: Custom "Polished Authenticity" theme using Tailwind CSS 4 variables.
- **🌑 Dark Mode**: System-aware theme switching via `next-themes`.
- **📝 Markdown Blog**: Renders blog posts from local Markdown files with `remark`/`rehype`.
- **🔍 SEO**: Dynamic metadata, Open Graph tags, and structured data.

---

## 🛠️ Setup & Installation

### 1. Environment
Create a `.env.local` file:

```bash
cp env.example .env.local
```

Fill in your Firebase Public Config (safe to expose to client):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ...
```

### 2. Run Development Server
```bash
npm run dev
# or from root: npm run dev:website
```
Access at [http://localhost:3000](http://localhost:3000).

---

## 🌍 Internationalization (i18n)

We use **`next-intl`** for translations.

### Adding Translations
1. Navigate to `messages/`.
2. Add keys to both `en.json` and `tr.json`.

**en.json:**
```json
{
  "Hero": {
    "title": "Technical Product Manager"
  }
}
```

**tr.json:**
```json
{
  "Hero": {
    "title": "Teknik Ürün Yöneticisi"
  }
}
```

### Usage in Components
```tsx
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');
  return <h1>{t('title')}</h1>;
}
```

---

## 📝 Adding Content

### Blog Posts
Blog posts are stored as Markdown files in `content/blog/`.

1. Create a new file: `content/blog/my-new-post.md`
2. Add Frontmatter:

```markdown
---
title: "Building an Agentic Portfolio"
date: "2024-03-20"
excerpt: "How I built this website using Next.js 16..."
image: "/images/blog/cover.jpg"
tags: ["Next.js", "AI"]
---

Start writing your content here...
```

### Static Data
Some data (like navigation links) is stored in `lib/constants.ts` or Translation files.
Dynamic data (Projects, Experience) is fetched from **Firestore**.

---

## 🧩 Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4 + CSS Variables
- **Content**: `react-markdown`, `rehype-raw`, `rehype-sanitize`
- **Icons**: `lucide-react`
- **Data Fetching**: Direct Firestore SDK (Client-side) or Server Actions.

---

## 📂 Folder Structure

```
website/
├── app/
│   ├── [locale]/       # Localized Routes (e.g., /en/blog)
│   ├── globals.css     # CSS Variables & Tailwind Directives
│   └── not-found.tsx   # 404 Page
│
├── components/
│   ├── sections/       # Landing Page Sections (Hero, etc.)
│   └── ui/             # Atomic Components
│
├── content/
│   └── blog/           # Markdown Files
│
├── messages/           # Translation Files (en.json, tr.json)
└── lib/                # Utilities & Firebase Logic
```

---

## 📚 Related

- [Admin CMS](../admin/README.md)
- [Data Structures](../../docs/DATA_STRUCTURES.md)
- [Style Guide](../../docs/STYLE_GUIDE.md)
