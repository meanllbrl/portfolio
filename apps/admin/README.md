# Admin (CMS)

Private Content Management System for the portfolio. Built with Next.js 14, Server Actions, and Firebase Admin SDK.

> 📖 **Part of a monorepo** - See the [root README](../../README.md) for full project overview.

> ⚠️ **Security Warning**: This app has full database write access. Never deploy publicly without authentication!

---

## ✨ Features

- 📝 **Full CRUD** - Projects, experience, education, blog posts
- 🔗 **Smart Relations** - Two-way sync between documents
- 🗑️ **Safe Delete** - Cleans up references
- 📤 **Media Upload** - Firebase Storage

---

## 🛠️ Installation

### 1. Environment Variables

```bash
cp env.example .env.local
```

### 2. Firebase Client SDK

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Service Account Key (Required!)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Project Settings** → **Service Accounts**
3. Click **"Generate New Private Key"**
4. Copy the entire JSON content
5. Paste as `FIREBASE_ADMIN_SDK_KEY`:

```bash
FIREBASE_ADMIN_SDK_KEY='{"type":"service_account","project_id":"...","private_key":"..."}'
```

> The entire JSON must be on ONE line, wrapped in single quotes.

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## 📁 Structure

```
admin/
├── app/
│   ├── actions.ts      # Server Actions (CRUD + sync)
│   ├── projects/       # Project pages
│   ├── experience/     # Experience pages
│   └── ...
├── components/
│   ├── ProjectForm.tsx
│   ├── RelationSelector.tsx
│   └── ui/             # shadcn/ui
└── lib/
    └── admin.ts        # Firebase Admin SDK
```

---

## 🔐 Security Model

```
Firestore Rules: allow write: false (except /recommendations create)
         ↓
    BUT Admin SDK BYPASSES rules
         ↓
    Full read/write access
```
**Best Practices:**
- ✅ Run locally
- ✅ Add auth for production
- ❌ Don't deploy publicly
- ❌ Don't share Service Account key

---

## 📚 Related

- [Website](../website/README.md)
- [Data Structures](../../docs/DATA_STRUCTURES.md)

