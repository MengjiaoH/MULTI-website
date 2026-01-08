# MULTI Research Group Website - Style & Layout Guide

This guide explains how to modify the visual appearance and layout of the website.

## File Overview

| File | Purpose |
|------|---------|
| `css/variables.css` | Design tokens (colors, fonts, spacing) |
| `css/main.css` | All component and layout styles |
| `index.html` | Page structure (rarely needs changes) |

## Quick Style Changes

### Changing Colors

**File:** `css/variables.css`

All colors are defined as CSS custom properties. To change a color, modify the value:

```css
:root {
  /* Primary brand color */
  --color-primary: #BE0000;      /* Utah Red - change this */
  --color-primary-dark: #890000; /* Hover state */

  /* Background colors */
  --color-background: #E2E6E6;   /* Page background */
  --color-surface: #FFFFFF;      /* Card backgrounds */

  /* Text colors */
  --color-text: #1a1a1a;         /* Main text */
  --color-text-light: #4a4a4a;   /* Secondary text */
}
```

**Note:** Maintain University of Utah brand compliance. Utah Red (#BE0000) must remain the primary color.

### Changing Fonts

**File:** `css/variables.css`

```css
:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Source Sans Pro', sans-serif;

  /* Font sizes */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-2xl: 2rem;      /* 32px */
  --font-size-3xl: 2.5rem;    /* 40px */
}
```

If changing fonts, update the Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

### Changing Spacing

**File:** `css/variables.css`

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 4rem;      /* 64px */
}
```

---

## Layout Modifications

### Header Height

**File:** `css/variables.css`

```css
:root {
  --header-height: 80px;
}
```

**File:** `css/main.css`

```css
.site-header {
  height: var(--header-height);
}

/* Offset for fixed header */
main {
  padding-top: var(--header-height);
}
```

### Content Width

**File:** `css/variables.css`

```css
:root {
  --max-width: 1200px;
  --container-padding: 1rem;
}
```

### Section Spacing

**File:** `css/main.css`

```css
.section {
  padding: var(--space-xl) 0;
}

.section--intro {
  padding: var(--space-lg) 0;
}

.section--team {
  padding: var(--space-xl) 0;
}

.section--publications {
  padding: var(--space-xl) 0;
}
```

---

## Component Styles

### Team Cards

**File:** `css/main.css`

```css
/* Card container */
.team-card {
  width: 280px;
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

/* Hover state */
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* Selected state */
.team-card--selected {
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-lg);
}

/* Photo */
.team-card__photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

/* Name */
.team-card__name {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  margin-top: var(--space-md);
}

/* Position */
.team-card__position {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}
```

### Team Carousel

**File:** `css/main.css`

```css
.team-carousel {
  display: flex;
  gap: var(--space-lg);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: var(--space-md) 0;

  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.team-carousel::-webkit-scrollbar {
  display: none;
}

.team-card {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

### Publication List

**File:** `css/main.css`

```css
.publication-item {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.publication-item:last-child {
  border-bottom: none;
}

.publication-item__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.publication-item__title a {
  color: inherit;
  text-decoration: none;
}

.publication-item__title a:hover {
  color: var(--color-primary);
}

.publication-item__authors {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.publication-item__venue {
  font-style: italic;
  color: var(--color-text-light);
}

.publication-item__year {
  font-weight: 600;
}

.publication-item__links {
  margin-top: var(--space-sm);
}

.publication-item__links a {
  margin-right: var(--space-sm);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}
```

---

## Responsive Breakpoints

**File:** `css/main.css`

```css
/* Mobile first - base styles apply to all sizes */

/* Small devices (phones, 576px and up) */
@media (min-width: 576px) {
  .team-card {
    width: 240px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  :root {
    --container-padding: 2rem;
  }

  .team-card {
    width: 280px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

/* Extra large devices (1200px and up) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

### Mobile-Specific Styles

```css
/* Stack team cards vertically on mobile */
@media (max-width: 575px) {
  .team-carousel {
    flex-direction: column;
    align-items: center;
  }

  .team-card {
    width: 100%;
    max-width: 320px;
  }
}
```

---

## Adding New Sections

### HTML Structure

**File:** `index.html`

```html
<section class="section section--newsection" aria-label="New Section">
  <div class="container">
    <h2 class="section__title">Section Title</h2>
    <div class="section__content">
      <!-- Content here -->
    </div>
  </div>
</section>
```

### CSS

**File:** `css/main.css`

```css
/* ========================================
   NEW SECTION
   ======================================== */
.section--newsection {
  background: var(--color-background);
}

.section--newsection .section__title {
  /* Custom title styles */
}

.section--newsection .section__content {
  /* Content layout */
}
```

---

## Animations & Transitions

**File:** `css/variables.css`

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

**File:** `css/main.css`

```css
/* Smooth hover transitions */
.team-card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

/* Filter animation */
.publication-item {
  transition: opacity var(--transition-fast);
}

.publication-item--hidden {
  opacity: 0;
  height: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
```

---

## Shadows

**File:** `css/variables.css`

```css
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
}
```

---

## Focus States (Accessibility)

**File:** `css/main.css`

```css
/* Global focus style */
a:focus,
button:focus,
input:focus,
.team-card:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Focus visible only for keyboard users */
.team-card:focus:not(:focus-visible) {
  outline: none;
}

.team-card:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## Testing Style Changes

After modifying styles:

1. **Check all breakpoints:**
   - Resize browser from 320px to 1400px
   - Or use Chrome DevTools device toolbar

2. **Test interactive states:**
   - Hover on cards and links
   - Click team cards
   - Tab through with keyboard

3. **Verify contrast:**
   - Use Chrome DevTools Accessibility panel
   - Or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

4. **Cross-browser check:**
   - Chrome, Firefox, Safari, Edge
   - Mobile Safari, Chrome for Android

---

## Common Style Tasks

### Make team cards larger
```css
.team-card {
  width: 320px;  /* was 280px */
}

.team-card__photo {
  width: 150px;  /* was 120px */
  height: 150px;
}
```

### Change publication list to cards
```css
.publications-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.publication-item {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border-bottom: none;
}
```

### Add more space between sections
```css
.section {
  padding: var(--space-xl) 0;  /* was space-lg */
  margin-bottom: var(--space-lg);
}
```

### Make header sticky with shadow on scroll
```css
.site-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: box-shadow var(--transition-base);
}

.site-header--scrolled {
  box-shadow: var(--shadow-md);
}
```

(Requires JS to add `.site-header--scrolled` class on scroll)
