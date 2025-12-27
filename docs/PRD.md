# Product Requirements Document (PRD)
## Portfolio Website

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Target Role:** Technical Product Manager  
**Status:** Planning

---

## 1. Executive Summary

### 1.1 Product Vision
A modern, bilingual (Turkish/English) portfolio website showcasing expertise as a Technical Product Manager. The site emphasizes AI-native product strategy, scaling products, and technical leadership through a bold, playful design system inspired by Ryan Trahan's aesthetic.

### 1.2 Key Objectives
- **Professional Positioning:** Establish Technical Product Manager identity
- **Content Showcase:** Display projects, blogs, work experience, and achievements
- **International Reach:** Support Turkish and English languages
- **Design Excellence:** Implement "Polished Authenticity" design philosophy
- **Technical Foundation:** Prepare for future database migration

### 1.3 Success Metrics
- Clean, maintainable codebase with zero hard-coded values
- Seamless language switching based on device preferences
- Fast load times (< 2s)
- Mobile-responsive (100% mobile compatibility)
- Accessible (WCAG AA compliance)


---

## 2. Validation & Strategy

### 2.1 Timing Assessment (The 42% Rule)
**Score: 9/10 (Excellent)**
- **Infrastructure:** AI/Agentic tools are rapidly maturing, but widespread "Product Manager" adoption of these tools is still early.
- **Economic Conditions:** High demand for PMs who can actually *build* and leverage AI (Technical PMs). The market is shifting from "Idea Guys" to "Builders".
- **Consumer Behavior:** Recruiters and clients are flooded with generic resumes. a "Show, Don't Tell" portfolio that demonstrates AI-native capabilities is a massive differentiator.
- **Why Now?** The "Agentic AI" wave is just breaking. Positioning as an expert *now* captures the early adopter advantage before it becomes standard.

### 2.2 Unfair Advantage (Moat)
1.  **Technical Depth:** Unlike generalist PMs, I can code, deploy, and architect solutions (Next.js, Firebase, AI Agents).
2.  **Proven Scale:** Track record of scaling tangible products (Rovo, VanGo) to 100k+ users—not just theoretical management.
3.  **Agentic Workflow:** early mastery of cursor-based agentic workflows allows for shipping velocity 10x faster than peers.

### 2.3 Risk Mitigation Protocols
- **Stranger Signal:** Design portfolio for the "Cold Recruiter" (6-second scan test), not for friends.
- **Complexity Audit:** Maintain ruthlessly simple UI. If a feature confuses a user within 3 seconds, kill it.
- **Feature Fallacy:** improving the content (projects/case studies) is higher leverage than adding fancy UI animations.

### 2.4 Feature Prioritization (RICE Score)
| Feature | Reach (1-10) | Impact (3=XS, 0.5=Low) | Confidence (%) | Effort (Months) | Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Bilingual Support (i18n)** | 10 (All users) | 2.0 (High) | 100% | 0.5 | **400** |
| **Project Showcase** | 10 (All users) | 3.0 (Massive) | 100% | 0.5 | **600** |
| **Blog System** | 6 (Peers) | 1.0 (Medium) | 80% | 0.8 | **60** |
| **Complex Animations** | 10 (All users) | 0.5 (Low) | 50% | 1.0 | **25** |
| **Contact Form** | 5 (Leads) | 2.0 (High) | 100% | 0.2 | **500** |
*Decision: Prioritize Project Showcase > Contact Form > i18n > Blog.*

---

## 3. User Personas

### 2.1 Primary Persona: Recruiters & Hiring Managers
- **Goal:** Understand technical background and product management experience
- **Needs:** Quick overview of skills, projects, and achievements
- **Language:** English (primary), Turkish (secondary)

### 2.2 Secondary Persona: Potential Clients/Partners
- **Goal:** Evaluate technical capabilities and past work
- **Needs:** Detailed project information and case studies
- **Language:** English (primary), Turkish (secondary)

### 2.3 Tertiary Persona: Peers & Network
- **Goal:** Stay updated on work and insights
- **Needs:** Blog posts, technical articles, thought leadership
- **Language:** English (primary), Turkish (secondary)

---

## 3. Functional Requirements

### 3.1 Core Pages

#### 3.1.1 Homepage (`/`)
**Layout:** Minimal hero (Ted-style), projects showcase, work timeline, achievements, about section

**Sections:**
1. **Hero Section** (Minimal, left-aligned)
   - Greeting: "hi [name] here. 👋"
   - Role: "Technical Product Manager"
   - Description: AI-Native Product Strategist positioning
   - Social links: Resume, LinkedIn, GitHub, Email

2. **Featured Projects** (3-4 projects)
   - Alternating left/right layout
   - Project number, tags, description, CTA

3. **Work & Education Timeline**
   - Card-based layout
   - Company/role, period, achievements

4. **Achievements Section**
   - Showcase non-existent achievements (placeholder for future)
   - Card-based grid layout

5. **About Section**
   - Brief personal/professional summary
   - CTA to contact

#### 3.1.2 Projects Page (`/projects`)
**Layout:** Grid of all projects with filters/tags

**Features:**
- Project cards with image, title, tags, description
- Filter by technology/tag
- Link to detailed project pages (future)

#### 3.1.3 Blog Page (`/blog`)
**Layout:** List of blog posts with preview cards

**Features:**
- Blog post cards (title, excerpt, date, read time, tags)
- Pagination or infinite scroll
- Markdown content support
- Support for `.canvas` and `.excalidraw` files

#### 3.1.4 Blog Post Page (`/blog/[slug]`)
**Layout:** Full-width content with sidebar (optional)

**Features:**
- Markdown rendering (Obsidian-style)
- Syntax highlighting for code blocks
- Support for embedded `.canvas` files
- Support for embedded `.excalidraw` files
- Table of contents (auto-generated)
- Reading time estimate
- Social sharing buttons
- Related posts section

#### 3.1.5 Contact Page (`/contact`)
**Layout:** Simple contact form + social links

**Features:**
- Contact form (name, email, message)
- Social media links
- Email: [your-email@example.com]
- LinkedIn: [your-linkedin-url]
- GitHub: [your-github-url]

---

### 3.2 Internationalization (i18n)

#### 3.2.1 Language Detection
- **Auto-detect:** Use browser/device language preference
- **Default:** Turkish if device language is Turkish, English otherwise
- **Manual Override:** Language switcher in navigation

#### 3.2.2 Translation Structure
```
translations/
├── en/
│   ├── common.json       # Navigation, buttons, common phrases
│   ├── home.json         # Homepage content
│   ├── projects.json     # Projects page content
│   ├── blog.json         # Blog page content
│   ├── contact.json      # Contact page content
│   └── work.json         # Work experience content
└── tr/
    ├── common.json
    ├── home.json
    ├── projects.json
    ├── blog.json
    ├── contact.json
    └── work.json
```

#### 3.2.3 Translation Keys Structure
```json
{
  "nav": {
    "home": "Home",
    "projects": "Projects",
    "blog": "Blog",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "hi [name] here.",
    "role": "Technical Product Manager",
    "description": "AI-Native Product Strategist by trade..."
  }
}
```

#### 3.2.4 Implementation
- Use Next.js i18n routing (`/en`, `/tr` or subdomain)
- Store current language in cookie/localStorage
- All text from translation files (zero hard-coded text)

---

### 3.3 Data Management (Firestore)

#### 3.3.1 Database Choice
**System:** Google Cloud Firestore (NoSQL)
**Reasoning:** Real-time updates, scalable, easy integration with other Google services (Analytics), and supports the specific "Document" structure needed for bilingual content.

#### 3.3.2 Schema Design

**Collection: `projects`**
- `id` (string): e.g., "rovo"
- `title` (Map): `{ en: "Rovo", tr: "Rovo" }`
- `subtitle` (Map): `{ en: "The AI Experience Management Agent", tr: "AI Deneyim Yönetim Asistanı" }`
- `slug` (string): "rovo"
- `summary` (Map):
  - `en`: `{ situation: "...", action: "...", result: "..." }`
  - `tr`: `{ situation: "...", action: "...", result: "..." }`
- `tech_stack` (Array): `["Agentic AI", "Flutter", "Firebase", "Pinecone"]`
- `metrics` (Array of Maps): `[{ label: "Users", value: "100k" }, { label: "Retention", value: "20%" }]`
- `featured` (Boolean): `true`
- `order` (Number): `1`
- `links` (Map): `{ website: "...", app_store: "..." }`

**Collection: `work_experience`**
- `id` (string): e.g., "5by5-2024"
- `company` (string): "5by5 Startups"
- `role` (Map): `{ en: "Product Manager", tr: "Ürün Yöneticisi" }`
- `period` (Map): `{ start: "Nov 2024", end: "Present" }`
- `description` (Map<en/tr, Array>): Bullet points of duties/achievements.

**Collection: `achievements`**
- `id` (string)
- `title` (Map): `{ en: "TUBITAK 1812 Seal of Excellence", tr: "TÜBİTAK 1812 Mükemmeliyet Mührü" }`
- `description` (Map): Context about the award.
- `date` (Timestamp)
- `icon` (string): Emoji or Icon name

**Collection: `blog_posts`**
- `slug` (string)
- `title` (Map)
- `content` (Map): Markdown string for each language.
- `tags` (Array)
- `published_at` (Timestamp)

#### 3.3.3 Migration Note
Transitioning from local JSON to Cloud Firestore allows for dynamic content updates without redeploying the application.

---

### 3.4 Blog System

#### 3.4.1 Content Format
- **Primary:** Markdown files (`.md`)
- **Support:** `.canvas` files (JSON Canvas format)
- **Support:** `.excalidraw` files (Excalidraw format)

#### 3.4.2 File Structure
```
content/
├── blog/
│   ├── 2025-01-15-my-first-post.md
│   ├── 2025-01-15-my-first-post.canvas
│   └── 2025-01-15-my-first-post.excalidraw
```

#### 3.4.3 Markdown Frontmatter
```yaml
---
title: "My First Post"
slug: "my-first-post"
date: "2025-01-15"
tags: ["AI", "Product Management"]
readTime: 5
excerpt: "This is a brief excerpt..."
language: "en" # or "tr" for Turkish posts
---
```

#### 3.4.4 Rendering Requirements
- Markdown to HTML conversion
- Syntax highlighting (Prism.js or similar)
- Obsidian-style rendering (wikilinks, tags, etc.)
- Canvas file rendering (visual diagram)
- Excalidraw file rendering (drawing/diagram)

---

### 3.5 Theme System (Dark/Light Mode)

#### 3.5.1 Auto-Detection
- Detect system preference: `prefers-color-scheme: dark`
- Store preference in localStorage
- Manual toggle available

#### 3.5.2 Theme Variables
**Location:** `app/globals.css` (CSS variables)

```css
:root {
  /* Light mode (default) */
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --text-primary: #121212;
  --text-secondary: #666666;
  --border-color: #121212;
  /* ... */
}

[data-theme="dark"] {
  /* Dark mode */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #ededed;
  --text-secondary: #999999;
  --border-color: #333333;
  /* ... */
}
```

#### 3.5.3 Implementation
- Theme toggle in navigation
- Smooth transition between themes
- All colors from CSS variables (zero hard-coded colors)

---

## 4. Design Requirements

### 4.1 Design System
**Reference:** `STYLE_GUIDE.md`

**Core Principles:**
- "Polished Authenticity" - Bold, playful, minimalist
- High-contrast colors (Electric Blue, Gen-Z Yellow, Candy Red)
- Thick borders (3px), hard shadows (5px offset)
- Bold typography (Montserrat for headlines, Inter for body)

### 4.2 Layout Structure
**Reference:** Ted's website (tedawf.com) layout patterns

**Key Layout Rules:**
- Row-based structure (one idea per row)
- Max content width: 1100px (like Ted's)
- Alternating backgrounds for visual distinction
- Vertical padding: 50-80px per section
- Spacing divisible by 4 (4px grid system)

### 4.3 Component Library

#### 4.3.1 Button Components
**Classes:** `.btn-primary`, `.btn-secondary`, `.btn-yellow`, `.btn-black`
- All styles from utility classes
- No inline styles
- Hover effects via classes

#### 4.3.2 Card Components
**Classes:** `.card`, `.card-project`, `.card-work`, `.card-achievement`
- Consistent border, shadow, padding
- Hover effects via classes

#### 4.3.3 Typography Classes
**Classes:** `.heading-hero`, `.heading-section`, `.text-body`, `.text-small`
- All typography from classes
- No inline font sizes/weights

### 4.4 Icon System
**Library:** Lucide React or React Icons
- Consistent icon size and style
- Accessible (ARIA labels)
- All icons from library (no custom SVGs in components)

### 4.5 Emoji Usage
- Match Ryan Trahan style (playful, authentic)
- Use sparingly for personality
- Consistent emoji usage across translations

---

## 5. Technical Requirements

### 5.1 Technology Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **i18n:** next-intl or next-i18next
- **Markdown:** remark, rehype plugins
- **Icons:** Lucide React
- **Theme:** CSS variables + localStorage

### 5.2 File Structure
```
portfolio/
├── app/
│   ├── [locale]/              # i18n routing
│   │   ├── page.tsx          # Homepage
│   │   ├── projects/
│   │   ├── blog/
│   │   └── contact/
│   ├── globals.css           # Global styles, CSS variables, Dark Mode
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Icon.tsx
│   ├── sections/              # Page sections
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   └── WorkTimeline.tsx
│   └── blog/                  # Blog-specific components
│       ├── MarkdownRenderer.tsx
│       ├── CanvasViewer.tsx
│       └── ExcalidrawViewer.tsx
├── data/                      # JSON data files
│   ├── personal.json
│   ├── work-experience.json
│   ├── projects.json
│   └── achievements.json
├── translations/              # i18n files
│   ├── en/
│   └── tr/
├── content/                   # Blog content
│   └── blog/
├── lib/                       # Utilities
│   ├── i18n.ts
│   ├── theme.ts
│   ├── firebase.ts          # Firebase Init & Helpers
│   └── markdown.ts
└── styles/                    # Additional styles
    └── components.css        # Component-specific styles
```

### 5.3 Code Quality Standards

#### 5.3.1 No Hard-Coding Rules
- ❌ **NO** hard-coded text (use translations)
- ❌ **NO** hard-coded colors (use CSS variables)
- ❌ **NO** hard-coded styles (use utility classes)
- ❌ **NO** inline styles (except dynamic values)
- ✅ **ALL** text from translation files
- ✅ **ALL** colors from CSS variables
- ✅ **ALL** styles from Tailwind classes or CSS classes

#### 5.3.2 File Organization
- **Short Files:** Max 200-300 lines per file
- **Task-Oriented:** One component/utility per file
- **Separation of Concerns:** Data, UI, logic separated
- **Reusability:** Shared components in `components/ui/`

#### 5.3.3 Component Structure
```tsx
// Example: components/sections/Hero.tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { personalData } from '@/lib/data-loader';

export function Hero() {
  const t = useTranslations('home');
  const personal = personalData();
  
  return (
    <section className="hero-section">
      <h1 className="heading-hero">{t('hero.greeting')}</h1>
      {/* ... */}
    </section>
  );
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Lighthouse Score:** > 90 (Performance)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic via Next.js

### 6.2 Accessibility
- **WCAG AA Compliance:** Minimum
- **Keyboard Navigation:** Full support
- **Screen Reader:** Proper ARIA labels
- **Color Contrast:** Meet WCAG standards
- **Focus States:** Visible on all interactive elements

### 6.3 SEO
- **Meta Tags:** Dynamic per page
- **Open Graph:** Social sharing support
- **Structured Data:** JSON-LD for work experience, projects
- **Sitemap:** Auto-generated
- **Robots.txt:** Proper configuration

### 6.4 Browser Support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari, Chrome Mobile
- **Progressive Enhancement:** Graceful degradation

---

## 7. Content Requirements

### 7.1 Initial Content

#### 7.1.1 Personal Information
- Name: [Your Name]
- Role: Technical Product Manager
- Email: [your-email@example.com]
- LinkedIn: [your-linkedin-url]
- GitHub: [your-github-url]
- Location: Turkey
- Age: 28

#### 7.1.2 Work Experience
- 5by5 Startups (Nov 2024 - Present)
- Rovo/VanGo (Jan 2022 - Present)
- Freelance (Apr 2021 - Dec 2022)
- Noxarc (Jul 2022 - Aug 2022)

#### 7.1.3 Education
- Ege University: Computer Engineering (GPA: 3.3)
- YTU: English Preparatory

#### 7.1.4 Projects (Confirmed Stories)
1. **Rovo (AI Experience Agent)**
   - **Situation:** Users faced decision fatigue with fragmented travel tools.
   - **Action:** Orchestrated an end-to-end Agentic AI layer to create a "zero-interface" experience.
   - **Result:** Scaled to 100k users, +6% conversion, 20% retention.

2. **VanGo (Travel Platform)**
   - **Situation:** Travel planning was disconnected and solitary.
   - **Action:** Built a unified platform for planning and sharing trips.
   - **Result:** 50,000 users in 8 months.

3. **Kidvo (Parenting Tech)**
   - **Situation:** Parents lacked specialized growth tracking tools.
   - **Action:** Developed full-stack solution with Flutter/Firebase.
   - **Result:** Successfully launched on App Store.

4. **Tüccarım (B2B)**
   - **Story:** Digital marketplace connecting farmers directly to B2B buyers.

#### 7.1.5 Achievements
- **TUBITAK 1812:** Seal of Excellence for high-potential innovation.
- **Scale:** Successfully scaled startup products to 100k+ users.
- **Leadership:** Leading AI/AR/XR lifecycles at 5by5 Startups.

### 7.2 Blog Content Strategy
- **Focus:** "Experiments, Thoughts, & Business Experiences"
- **Style:** Technical yet accessible, focusing on the "Why" and "How" of product building.
- **Format:** Markdown + Canvas diagrams.

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (Next.js, TypeScript, Tailwind)
- [ ] i18n configuration
- [ ] Theme system (dark/light mode)
- [ ] Basic layout structure
- [ ] Translation files structure
- [ ] Data JSON files structure

### Phase 2: Core Pages (Week 2)
- [ ] Homepage (hero, projects, work, achievements)
- [ ] Projects page
- [ ] Contact page
- [ ] Navigation component
- [ ] Footer component

### Phase 3: Blog System (Week 3)
- [ ] Blog listing page
- [ ] Blog post page
- [ ] Markdown rendering
- [ ] Canvas/Excalidraw support
- [ ] Blog data structure

### Phase 4: Polish & Optimization (Week 4)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] SEO implementation
- [ ] Responsive testing
- [ ] Content population

---

## 9. Success Criteria

### 9.1 Technical
- ✅ Zero hard-coded text, colors, or styles
- ✅ All content from JSON/translation files
- ✅ Bilingual support (TR/EN) with auto-detection
- ✅ Dark/light mode with auto-detection
- ✅ Responsive on all devices
- ✅ Fast load times (< 2s)

### 9.2 Design
- ✅ Consistent with style guide
- ✅ Ted's website layout patterns
- ✅ Ryan Trahan aesthetic (colors, emojis, bold)
- ✅ Accessible and WCAG compliant

### 9.3 Content
- ✅ All personal/professional info accurate
- ✅ Projects showcased effectively
- ✅ Blog system functional
- ✅ Achievements section ready for future content

---

## 10. Future Enhancements

### 10.1 Database Migration
- Migrate JSON files to database (PostgreSQL/Supabase)
- Admin panel for content management
- API endpoints for CRUD operations

### 10.2 Additional Features
- Project detail pages
- Search functionality
- Newsletter subscription
- Analytics integration
- Contact form backend

### 10.3 Content Expansion
- More blog posts
- Case studies
- Video content
- Podcast episodes

---

## 11. Dependencies

### 11.1 External Libraries
- `next-intl` or `next-i18next` (i18n)
- `remark` + `rehype` (Markdown processing)
- `prismjs` or `highlight.js` (Code highlighting)
- `lucide-react` (Icons)
- `next-themes` (Theme management)

### 11.2 Internal Dependencies
- Design system (STYLE_GUIDE.md)
- Layout principles (layout-fundamentals.mdc)
- Coding standards (coding-general.mdc, coding-frontend.mdc)

---

## 12. Open Questions & Assumptions

### 12.1 Assumptions
- User prefers bilingual (TR/EN) over English-only
- Blog content will be primarily in English
- Achievements section can start empty
- No immediate need for admin panel

### 12.2 Open Questions
- Preferred i18n library? (next-intl vs next-i18next)
- Blog post frequency? (affects pagination strategy)
- Need for project detail pages initially?
- Contact form backend solution?

---

## 13. References

### 13.1 Design References
- **Style Guide:** `portfolio/STYLE_GUIDE.md`
- **Layout Principles:** `.cursor/rules/23-layout-fundamentals.mdc`
- **Ted's Website:** https://tedawf.com/
- **Ryan Trahan Aesthetic:** Design guide provided

### 13.2 Technical References
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

**Document Owner:** Planning Agent  
**Next Review:** After Phase 1 completion  
**Status:** Ready for Implementation








