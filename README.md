# Portfolio

A modern, bilingual portfolio website with a dedicated admin panel for content management. Built with Next.js 14, TypeScript, Firebase, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)

---

## ️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Firebase                              │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │  Firestore  │  │   Storage   │                           │
│  └──────┬──────┘  └──────┬──────┘                           │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
    ┌─────┴────────────────┴─────┐
    │                            │
    ▼ READ ONLY                  ▼ FULL ACCESS (Admin SDK)
┌──────────────┐          ┌──────────────────┐
│   Website    │          │      Admin       │
│ apps/website │          │   apps/admin     │
│              │          │                  │
│  - Public    │          │  - Private CMS   │
│  - i18n      │          │  - Full CRUD     │
│  - Mixpanel  │          │  - Service Acct  │
└──────────────┘          └──────────────────┘
     :3000                      :3001
```

---

## � Project Structure

```
portfolio/
├── apps/
│   ├── website/           # Public portfolio website
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── lib/           # Firebase, utilities
│   │   ├── messages/      # i18n translations
│   │   └── README.md      # Website setup guide
│   │
│   └── admin/             # Private CMS
│       ├── app/           # Next.js + Server Actions
│       ├── components/    # Form components, UI
│       ├── lib/           # Firebase Admin SDK
│       └── README.md      # Admin setup guide
│
├── docs/                  # Documentation
│   ├── DATA_STRUCTURES.md # Firestore schema
│   ├── PRD.md             # Product requirements
│   └── STYLE_GUIDE.md     # Design system
│
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
└── README.md              # This file
```

---

## ✨ Features

### Website (Public)
- 🌍 **Bilingual** - Full i18n support (English/Turkish)
- 🎨 **Custom Design System** - "Polished Authenticity" aesthetic
- ⚡ **Performance** - Server Components + optimized images
- 📊 **Analytics** - Mixpanel integration
- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data

### Admin (CMS)
- 📝 **Full CRUD** - Manage projects, experience, education, blog posts
- 🔗 **Smart Relations** - Two-way relationship sync between documents
- 🗑️ **Safe Delete** - Cleans up references before deletion
- 📤 **Media Upload** - Firebase Storage integration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **Firebase Project** with Firestore and Storage enabled
- **Mixpanel Account** (optional, for analytics)

### 1. Clone the Repository

```bash
git clone https://github.com/meanllbrl/portfolio.git
cd portfolio
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**
4. Enable **Storage**

### 3. Configure Security Rules

**Firestore Rules** (Firebase Console → Firestore → Rules):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Storage Rules** (Firebase Console → Storage → Rules):

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

> ⚠️ The Admin CMS uses a Service Account to bypass these rules.

### 4. Set Up Each App

#### Website
```bash
cd apps/website
cp env.example .env.local
# Edit .env.local with Firebase config
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

#### Admin
```bash
cd apps/admin
cp env.example .env.local
# Edit .env.local with Firebase config + Service Account key
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001)

> 📖 See each app's README for detailed setup instructions.

---

## �️ Required Services

| Service | Required | Purpose |
|---------|----------|---------|
| Firebase Firestore | ✅ Yes | Database |
| Firebase Storage | ✅ Yes | Image uploads |
| Mixpanel | ⚪ Optional | Analytics |

---

## � Documentation

| Document | Description |
|----------|-------------|
| [Website README](./apps/website/README.md) | Public website setup |
| [Admin README](./apps/admin/README.md) | CMS setup with Service Account |
| [Data Structures](./docs/DATA_STRUCTURES.md) | Firestore schema |
| [Style Guide](./docs/STYLE_GUIDE.md) | Design system |
| [PRD](./docs/PRD.md) | Product requirements |

---

## � Security

| Component | Access Level | How |
|-----------|--------------|-----|
| Website | Read-only | Firestore rules + Client SDK |
| Admin | Full access | Firebase Admin SDK (Service Account) |

> ⚠️ **Never deploy the Admin app publicly without authentication!**

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

[MIT](./LICENSE)
