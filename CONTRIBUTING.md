# Contributing to Portfolio & Admin CMS

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

---

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_FORK.git
   ```
3. **Set up the development environment**
   - Follow the [Quick Start](./README.md#-quick-start) guide
   - Ensure both `portfolio` and `portfolio_admin` run locally

---

## 📋 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add dark mode toggle to navbar
fix: resolve image loading issue on project cards
docs: update installation instructions
refactor: extract ProjectCard component
```

---

## 🏗️ Project Structure

```
├── portfolio/          # Public website (read-only)
└── portfolio_admin/    # Admin CMS (full CRUD)
```

### Key Directories

| Path | Purpose |
|------|---------|
| `portfolio/components/` | UI components for public site |
| `portfolio/lib/` | Firebase client, utilities |
| `portfolio_admin/app/actions.ts` | Server Actions for CRUD |
| `portfolio_admin/components/` | Form components, UI |

---

## 🔧 Code Guidelines

### TypeScript

- Use strict TypeScript
- Define interfaces for all data structures
- Avoid `any` type

### Styling

- Follow the [Style Guide](./portfolio/STYLE_GUIDE.md)
- Use Tailwind CSS utility classes
- Use CSS variables for colors (defined in `globals.css`)

### Components

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use Server Components by default, Client Components only when needed

---

## 🧪 Testing Changes

Before submitting:

1. **Build both projects**
   ```bash
   cd portfolio && npm run build
   cd portfolio_admin && npm run build
   ```

2. **Test locally**
   - Verify the public site displays correctly
   - Verify admin CRUD operations work

3. **Check for lint errors**
   ```bash
   npm run lint
   ```

---

## 📝 Pull Request Process

1. **Create a descriptive PR title**
2. **Fill out the PR template** (if available)
3. **Link related issues**
4. **Wait for review**

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated documentation if needed
- [ ] Tested changes locally
- [ ] No breaking changes (or documented if intentional)

---

## 🐛 Reporting Issues

When reporting bugs, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/environment details

---

## 💡 Feature Requests

Feature requests are welcome! Please:

1. Check existing issues first
2. Describe the use case
3. Explain why it would be valuable

---

## 📚 Documentation

Help improve documentation:

- Fix typos and unclear explanations
- Add examples
- Update outdated information
- Translate to other languages

---

## 🙏 Thank You!

Your contributions help make this project better for everyone.
