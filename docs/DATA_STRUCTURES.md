# Data Structures (Firestore Schema)

The application uses Google Cloud Firestore (NoSQL). Below are the primary collections and their document structures.

---

## Collections Overview

| Collection | Purpose |
|------------|---------|
| `projects` | Portfolio projects |
| `experiences` | Work history |
| `educations` | Academic history |
| `posts` | Blog posts |
| `settings/hero` | Global profile data |

---

## 1. `projects`

Stores portfolio projects.

```typescript
interface Project {
  id: string;              // Auto-generated ID
  title: string;
  subtitle: string;
  description: string;     // Markdown supported
  tags: string[];          // e.g., ["React", "Firebase"]
  image: string;           // Cover image URL
  smallImage?: string;     // Icon URL for related links (1:1 ratio)
  link: string;            // External or internal link
  featured: number;        // 0=Hidden, 1=Standard, 2+=Featured on homepage
  status: string;          // e.g., "Ongoing", "Completed"
  
  // Relations (managed by Admin, read-only on Website)
  relatedPosts: RelatedItemStub[];
  relatedExperience: RelatedItemStub[];
  relatedEducation: RelatedItemStub[];
}
```

---

## 2. `experiences`

Stores work history.

```typescript
interface Experience {
  id: string;
  title: string;           // Company Name
  workTitle: string;       // Role/Position
  description: string;     // Markdown description
  years: string;           // "2020 - Present"
  image?: string;          // Company Logo
  
  urls: Link[];            // External links
  
  // Relations
  relatedProjects: RelatedItemStub[];
  relatedPosts: RelatedItemStub[];
}
```

---

## 3. `educations`

Stores academic history.

```typescript
interface Education {
  id: string;
  title: string;           // School Name
  department: string;      // Degree
  years: string;
  gpa: string;
  
  urls: Link[];
  relatedProjects: RelatedItemStub[];
  relatedPosts: RelatedItemStub[];
}
```

---

## 4. `posts`

Stores blog posts.

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;            // URL friendly slug
  excerpt: string;
  content: string;         // Full Markdown content
  date: string;            // ISO Date
  coverImage: string;
  status: 'Draft' | 'Published';
  tags: string[];

  // Relations
  relatedProjects: RelatedItemStub[];
}
```

---

## 5. `settings/hero`

A single document storing global profile data.

```typescript
interface HeroData {
  greeting: string;        // "hi [name] here. 👋"
  role: string;            // "Technical Product Manager"
  description: string;
  logoText: string;        // Initials for logo (e.g., "MN.")
  imageUrl?: string;
  resumeUrl?: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
}
```

---

## Shared Types

### `RelatedItemStub`

Lightweight reference stored on documents to avoid N+1 queries.

```typescript
interface RelatedItemStub {
  id: string;
  title: string;
  url: string;             // Computed URL (e.g., /projects/rovo)
  smallImage?: string;     // Icon for UI display
  featured?: number;       // Used for filtering in UI
  type: 'project' | 'experience' | 'education' | 'post';
}
```

### `Link`

Simple external link structure.

```typescript
interface Link {
  title: string;
  url: string;
  icon?: string;           // Icon URL or icon name
}
```

---

## Two-Way Sync

When a Project is linked to an Experience:
1. The Project stores the Experience as a `RelatedItemStub`
2. The Experience stores the Project as a `RelatedItemStub`

This denormalization optimizes read performance (O(1) lookups) at the cost of write complexity (handled by Admin CMS).
