# Portfolio Style Guide

> **Design Philosophy:** "Polished Authenticity" - High-end production with a raw, relatable feel. Minimalist, bold, and playful.

**Last Updated:** January 2025  
**Version:** 1.0.0

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [UI Patterns](#ui-patterns)
7. [Animations & Interactions](#animations--interactions)
8. [Responsive Design](#responsive-design)

---

## Design Philosophy

### Core Principles

1.  **Good Design is Minimal:** "As little design as possible." Start with the absolute essentials (Content + CTA) and only add elements if they serve a distinct functional or crucial aesthetic purpose.
2.  **Law of Similarity & Proximity:** Group related elements (e.g., project tags) visually through spacing and style. If elements look different, they should function functionally different.
3.  **Depth (Layers + Shadows):** Use "Hard Depth" to create hierarchy:
    -   **Base Layer:** `off-white` background.
    -   **Layer 1 (Cards):** White background + 3px border + 5px hard shadow.
    -   **Layer 2 (Actions):** Buttons with `bouncy` state + increasing shadow on hover (5px -> 8px).
4.  **Polished Authenticity:** High-end production (consistent spacing, typography) with a raw, relatable feel (playful voice, nostalgic colors).
5.  **Bold & Playful:** High-contrast colors, thick borders, and hard shadows.

### Keywords

Optimistic, Sincere, Minimalist, Nostalgic, Bold, "Perfectly Imperfect"

---

## Color System

### Primary Colors

```css
--electric-blue: #2E5BFF    /* Primary actions, links, highlights */
--gen-z-yellow: #FFD700      /* Highlights, callouts, accents */
--candy-red: #FF4B4B         /* Urgency, high emotion, warnings */
--off-white: #FFFFFF         /* Primary backgrounds */
--ink-black: #121212         /* Text, borders, shadows */
```

### Usage Rules

- **High Contrast:** Always ensure sufficient contrast between text and background
- **Solid Blocks:** Use solid block colors for backgrounds, avoid complex gradients
- **Accent Sparingly:** Use accent colors (yellow, red) for highlights and CTAs only
- **Background:** Primary background is `#FAFAFA` (off-white with slight gray)

### Color Combinations

**Primary Button:**
- Background: `#2E5BFF` (Electric Blue)
- Text: `#FFFFFF` (White)
- Border: `#121212` (Ink Black, 3px)

**Secondary Button:**
- Background: `#FFD700` (Gen-Z Yellow)
- Text: `#121212` (Ink Black)
- Border: `#121212` (Ink Black, 3px)

**Dark Button:**
- Background: `#121212` (Ink Black)
- Text: `#FFFFFF` (White)
- Border: `#121212` (Ink Black, 3px)

### Dark Mode Colors
```css
/* Dark Mode Overrides */
[data-theme='dark'] {
  --bg-primary: #121212;       /* Ink Black */
  --bg-secondary: #000000;     /* Pure Black for contrast */
  --text-primary: #FAFAFA;     /* Off-white */
  --text-secondary: #A0A0A0;   /* Light Gray */
  --border-color: #FAFAFA;     /* White borders for visibility */
  --card-bg: #1E1E1E;          /* Dark gray for cards */
  
  /* Accents */
  --accent-primary: #FFD700;   /* Yellow pops best on black */
  --accent-secondary: #2E5BFF; /* Electric Blue */
}
```

### Image & Media Guidelines
**Project Thumbnails:**
- Aspect Ratio: 16:9 or 4:3
- Style: "Polished" screenshots or mockups on solid colored backgrounds (Electric Blue or Yellow)
- Fallback: If no image exists, use a pattern-generated placeholder using the project's initials.

**Loading States:**
- **Skeleton:** Use a "shimmer" effect with a gray background (`#E0E0E0` light, `#333` dark).
- **Empty States:** When no lists are present, show a playful emoji and a short message (e.g., "Nothing here yet! 🕸️").


## Typography

### Font Families

**Headlines (Montserrat):**
- Font: `'Montserrat', sans-serif`
- Weights: 800 (Extra Bold), 900 (Black)
- Usage: All headings (h1, h2, h3)
- Style: Uppercase, tight kerning (-1px letter-spacing)

**Body Text (Inter):**
- Font: `'Inter', sans-serif`
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Usage: Paragraphs, descriptions, body content

### Type Scale

```css
/* Headlines */
h1: 3rem - 4rem (48px - 64px)     /* Hero headlines */
h2: 2.5rem - 3rem (40px - 48px)   /* Section titles */
h3: 1.5rem - 2rem (24px - 32px)    /* Card titles */

/* Body */
Large: 1.25rem (20px)              /* Hero descriptions */
Base: 1rem (16px)                  /* Body text */
Small: 0.875rem (14px)             /* Captions, tags */
```

### Typography Rules

- **Headlines:** Always uppercase, use Montserrat Black (900)
- **Line Height:** 1.1 for headlines, 1.6 for body text
- **Letter Spacing:** -1px for headlines, normal for body
- **Text Transform:** Uppercase for all headings
- **Font Weight:** Bold (700) for emphasis in body text

---

## Spacing & Layout

### Container Widths

- **Max Content Width:** `1100px` (max-w-[1100px])
- **Padding:** `20px` (px-5) on mobile, `40px` on desktop
- **Section Spacing:** `100px` vertical padding (py-[100px])

### Grid System

- **Columns:** Use CSS Grid for layouts
- **Gap:** `40px` (gap-10) between grid items
- **Responsive:** Single column on mobile, 2 columns on desktop

### Spacing Scale

```css
/* Tailwind spacing scale */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

---

## Components

### Buttons

**Primary Button (`.btn-ryan`):**
```css
- Background: var(--electric-blue)
- Color: white
- Padding: 15px 30px
- Border-radius: 50px (pill shape)
- Border: 3px solid var(--ink-black)
- Box-shadow: 5px 5px 0px var(--ink-black)
- Font: Montserrat, uppercase, bold
- Transition: bouncy (cubic-bezier(0.175, 0.885, 0.32, 1.275))
```

**Hover State:**
```css
- Transform: translate(-2px, -2px) scale(1.02)
- Box-shadow: 8px 8px 0px var(--ink-black)
```

**Variants:**
- `.btn-yellow`: Yellow background, black text
- `.btn-black`: Black background, white text

### Cards

**Project Card:**
```css
- Background: white
- Border: 3px solid var(--ink-black)
- Border-radius: 24px
- Box-shadow: 5px 5px 0px var(--ink-black)
- Padding: 0 (content has padding)
- Hover: translateY(-5px), shadow increases
```

**Work Timeline Card:**
```css
- Same as project card
- Padding: 2rem (p-8)
- Icon: 64px circle with gradient background
```

### Navigation

**Fixed Navbar:**
```css
- Position: fixed, top: 20px
- Width: 90%, max-width: 600px
- Background: rgba(255, 255, 255, 0.95) with backdrop-blur
- Border: 3px solid var(--ink-black)
- Border-radius: 50px (pill shape)
- Padding: 10px 20px
- Box-shadow: 5px 5px 0px var(--ink-black)
- Z-index: 1000
```

### Tags/Badges

```css
- Background: #eee (light gray)
- Padding: 5px 10px
- Border-radius: 5px
- Font-size: 0.8rem
- Font-weight: 700
- Border: 2px solid black
- Text-transform: uppercase
```

---

## UI Patterns

### Hero Section

**Structure:**
- Minimal, left-aligned text
- No large images or gradients
- Short, punchy headline
- Brief description
- Social links row

**Example:**
```
hi [name] here. 👋
Technical Product Manager
[Description paragraph]
[Social links: Resume, LinkedIn, GitHub, Email]
```

### Project Showcase

**Layout:**
- Alternating left/right image placement
- Large project number (01, 02, etc.)
- Tags above title
- Description paragraph
- CTA button

**Roadmap Line:**
- Vertical dashed line on desktop
- Hidden on mobile
- Position: absolute, centered

### Work Timeline

**Card Structure:**
- Icon circle (64px) with gradient
- Company name (uppercase, bold)
- Role (semibold)
- Period badge (colored background)
- Bullet points with arrow (→)

---

## Animations & Interactions

### Hover Effects

**Buttons:**
- Transform: translate(-2px, -2px) scale(1.02)
- Shadow increases: 5px → 8px
- Transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)

**Cards:**
- Transform: translateY(-5px)
- Shadow increases: 5px → 8px
- Transition: 0.2s ease

### Animations

**Star Spin:**
```css
@keyframes spin {
  100% { transform: rotate(360deg); }
}
- Duration: 10s
- Timing: linear
- Infinite
```

### Micro-interactions

- **Bouncy:** Use cubic-bezier for playful feel
- **Squishy:** Scale effects on hover (1.02x)
- **Smooth:** 0.2s transitions for most elements

---

## Responsive Design

### Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations

**Navigation:**
- Hide nav links on mobile
- Keep logo and CTA button
- Full width (95%)

**Hero:**
- Single column layout
- Reduced font sizes
- Stacked social links

**Projects:**
- Single column cards
- Image above content
- Hide roadmap line

**Grids:**
- 1 column on mobile
- 2 columns on desktop

### Typography Scale

**Mobile:**
- h1: 3rem (48px)
- h2: 2rem (32px)
- Body: 1rem (16px)

**Desktop:**
- h1: 4rem - 6rem (64px - 96px)
- h2: 3rem - 4rem (48px - 64px)
- Body: 1.125rem (18px)

---

## Code Examples

### Button Usage

```tsx
// Primary button
<Link href="/contact" className="btn-ryan">
  Say Hi
</Link>

// Yellow button
<Link href="/project" className="btn-ryan btn-yellow">
  View Project
</Link>

// Black button
<Link href="/contact" className="btn-ryan btn-black">
  Email Me
</Link>
```

### Card Structure

```tsx
<div className="bg-white border-[3px] border-[#121212] rounded-[24px] shadow-[5px_5px_0px_#121212] p-8 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#121212]">
  {/* Card content */}
</div>
```

### Typography

```tsx
// Headline
<h1 className="text-5xl md:text-6xl font-montserrat font-black uppercase">
  hi [name] here. 👋
</h1>

// Body text
<p className="text-lg md:text-xl font-medium">
  Description text here.
</p>
```

---

## Accessibility

### Color Contrast

- **Text on White:** Ink Black (#121212) - WCAG AAA
- **Text on Blue:** White (#FFFFFF) - WCAG AAA
- **Text on Yellow:** Ink Black (#121212) - WCAG AAA

### Focus States

- All interactive elements should have visible focus states
- Use outline or border changes for focus indication

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic HTML elements (nav, header, section, footer)
- Include ARIA labels for icon-only buttons

---

## Best Practices

### Do's ✅

- Use bold, uppercase headlines
- Maintain high contrast
- Keep spacing generous
- Use thick borders (3px)
- Apply hard shadows (5px offset)
- Keep content concise
- Use emojis sparingly for personality

### Don'ts ❌

- Don't use thin borders (< 3px)
- Don't use soft shadows
- Don't use lowercase headlines
- Don't overcrowd with elements
- Don't use complex gradients
- Don't break the color system
- Don't use more than 2-3 accent colors per section

---

## File Structure

```
portfolio/
├── app/
│   ├── globals.css          # Global styles, CSS variables
│   └── ...
├── components/
│   └── ...
└── STYLE_GUIDE.md          # This file
```

---

## Resources

### Fonts
- **Montserrat:** [Google Fonts](https://fonts.google.com/specimen/Montserrat)
- **Inter:** [Google Fonts](https://fonts.google.com/specimen/Inter)

### Color Tools
- **Color Contrast Checker:** [WebAIM](https://webaim.org/resources/contrastchecker/)
- **Color Palette Generator:** [Coolors](https://coolors.co/)

---

**Note:** This style guide is a living document. Update as the design system evolves.








