# Data Structures (Firestore Schema)

The application uses Google Cloud Firestore (NoSQL). Below are the primary collections and their document structures, formatted as TypeScript interfaces for clarity.

---

## Collections Overview

| Collection | Purpose |
|------------|---------|
| `projects` | Portfolio projects & case studies |
| `experiences` | Professional work history |
| `educations` | Academic background |
| `achievements` | Awards, certifications, and honors |
| `posts` | Blog posts and articles |
| `recommendations` | User-submitted testimonials & thoughts |
| `settings/hero` | Global profile and landing page data |

---

## 1. `projects`

Stores detailed information about projects, including media galleries and relations.

```typescript
interface Project {
  id: string;              // Unique identifier (e.g., "rovo")
  title: string;
  subtitle: string;
  description: string;     // Detailed Markdown content
  image: string;           // Main cover image URL
  smallImage: string;      // Thumbnail/Icon URL
  featured: number;        // 0=Hidden, 1=Standard, 2+=High Priority
  status: string;          // e.g., "Completed", "Ongoing", "Closed"
  sortOrder: number;       // Manual sorting index
  githubUrl: string;       // Repository link
  link: string;            // Live demo link
  tags: string[];          // e.g., ["Flutter", "Firebase", "AI"]
  
  gallery: GalleryItem[];  // Array of images/videos
  changelog: any[];        // Future: Array of update logs
  roadmap: any[];          // Future: Array of planned features
  urls: Link[];            // Array of additional external links

  // Relations (managed via Admin)
  relatedExperience: RelatedItemStub[];
  relatedEducation: RelatedItemStub[];
  relatedPosts: RelatedItemStub[];
}

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
}
```

---

## 2. `experiences`

Stores professional work history and impact.

```typescript
interface Experience {
  id: string;
  title: string;           // Company Name (e.g., "Rovo")
  workTitle: string;       // Role (e.g., "Founder & TPM")
  description: string;     // Bullet points in Markdown
  years: string;           // Duration (e.g., "2023 - 2025")
  image: string;           // Company logo URL
  urls: Link[];            // e.g., Website, App Store links
  
  // Relations
  relatedProjects: RelatedItemStub[];
}
```

---

## 3. `educations`

Stores academic history and school-related projects.

```typescript
interface Education {
  id: string;
  title: string;           // Institution Name
  department: string;      // Field of study
  years: string;           // e.g., "2019 - 2023"
  gpa: string;             // Grade point average
  sortOrder: number;
  urls: Link[];            // School website or project links
  
  // Relations
  relatedProjects: RelatedItemStub[];
  relatedPosts: RelatedItemStub[];
}
```

---

## 4. `achievements`

Stores awards, honors, and specific professional milestones.

```typescript
interface Achievement {
  id: string;
  title: string;           // Name of the award
  description: string;     // Brief context
  date: string;            // Year or month/year
  icon: string;            // Icon identifier or emoji
  sortOrder: number;
}
```

---

## 5. `posts`

Stores blog content and article metadata.

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;            // URL-friendly path (e.g., "hello-world")
  excerpt: string;         // Short summary for cards
  content: string;         // Full Markdown body
  date: string;            // ISO Date string
  coverImage: string;      // Hero image
  smallImage: string;      // Thumbnail
  status: 'Draft' | 'Published';
  tags: string[];
  
  // Relations
  relatedProjects: RelatedItemStub[];
  relatedExperience: RelatedItemStub[];
  relatedEducation: RelatedItemStub[];
}
```

---

## 6. `recommendations`

Stores user-submitted testimonials and professional recommendations.

```typescript
interface Recommendation {
  id: string;
  name: string;            // Submitter's name
  thought: string;         // The testimonial content
  status: 'draft' | 'published';
  createdAt: Timestamp;    // Firestore Server Timestamp
  photoUrl?: string;       // Admin-assigned profile photo
  linkedinUrl?: string;    // Admin-assigned LinkedIn link
}
```

---

## 7. `settings/hero`

A singleton document for global site configuration and profile data.

```typescript
interface HeroData {
  fullName: string;        // "Mehmet Nuraydın"
  greeting: string;        // "hi mehmet here. 👋"
  role: string;            // Professional tagline
  description: string;     // Short bio
  logoText: string;        // Navigation logo (e.g., "MN.")
  imageUrl: string;        // Profile picture
  resumeUrl: string;       // Link to PDF
  socials: {
    email: string;
    github: string;
    linkedin: string;
  };
}
```

---

## Shared Types

### `RelatedItemStub`

Lightweight snapshots of related entities stored directly on documents to enable high-performance, single-query page loads.

```typescript
interface RelatedItemStub {
  id: string;
  title: string;
  url: string;             // Computed path
  type: 'project' | 'experience' | 'education' | 'post';
  featured: number;
  sortOrder: number;
  coverImage: string;
  smallImage: string;
  date: string;
  excerpt: string;
}
```

### `Link`

Standard structure for external URLs with optional icons.

```typescript
interface Link {
  title: string;
  url: string;
  icon?: string;           // Icon URL or Lucide icon name
}
```

---

## Data Management Strategy

1.  **Denormalization**: We store `RelatedItemStub` on both sides of a relationship (e.g., Project ↔ Experience). This ensures the **Website** can render related items instantly without complex joins or multiple database roundtrips.
2.  **Admin Sync**: The **Admin CMS** is responsible for maintaining referential integrity. When a Project's title is updated, all `RelatedItemStub` references in other collections are updated automatically.
3.  **Markdown First**: All long-form text (descriptions, content) is stored as Markdown to remain platform-agnostic.
