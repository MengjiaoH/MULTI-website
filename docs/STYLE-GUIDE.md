# MULTI Research Group Website - Style & Layout Guide

This guide explains how to modify the visual appearance and layout of the website.

## File Overview

| File | Purpose |
|------|---------|
| `css/variables.css` | Design tokens (colors, fonts, spacing) |
| `css/multi.css` | All component and layout styles (multi- prefixed) |
| `index.html` | Development shell (loads content.html) |
| `content.html` | Main content for WordPress embedding |

## Naming Convention

All CSS classes and IDs use the `multi-` prefix for namespace isolation when embedded in WordPress:

```css
/* Classes */
.multi-container { }
.multi-team-card { }
.multi-team-card__photo { }
.multi-team-card--selected { }

/* IDs */
#multi-main { }
#multi-team-carousel { }
#multi-publications-list { }
```

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
  --color-background: #F5F5F5;   /* Page background */
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

**File:** `css/multi.css`

```css
.multi-site-header {
  height: var(--header-height);
}

/* Offset for fixed header */
.multi-main {
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

**File:** `css/multi.css`

```css
.multi-section {
  padding: var(--space-lg) 0;
}

.multi-section--intro {
  padding: var(--space-lg) 0;
}

.multi-section--team {
  padding: var(--space-lg) 0;
}

.multi-section--publications {
  padding: var(--space-lg) 0;
}
```

---

## Component Styles

### Team Cards

**File:** `css/multi.css`

```css
/* Card container */
.multi-team-card {
  width: 280px;
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

/* Hover state */
.multi-team-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* Selected state */
.multi-team-card--selected {
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-lg);
}

/* Photo */
.multi-team-card__photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

/* Name */
.multi-team-card__name {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  margin-top: var(--space-md);
}

/* Position */
.multi-team-card__position {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

/* Affiliation */
.multi-team-card__affiliation {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  font-style: italic;
}
```

### Team Carousel

**File:** `css/multi.css`

```css
.multi-team-carousel {
  display: flex;
  gap: var(--space-lg);
  overflow-x: auto;
  padding: var(--space-md) 0;

  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.multi-team-carousel::-webkit-scrollbar {
  display: none;
}

.multi-team-card {
  flex-shrink: 0;
}
```

### Team List View

**File:** `css/multi.css`

```css
.multi-team-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.multi-team-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.multi-team-list-item--selected {
  background: var(--color-background);
  border-left: 3px solid var(--color-primary);
}
```

### Publication List

**File:** `css/multi.css`

```css
.multi-publication-item {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.multi-publication-item:last-child {
  border-bottom: none;
}

.multi-publication-item__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.multi-publication-item__authors {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.multi-publication-item__venue {
  font-style: italic;
  color: var(--color-text-light);
}

.multi-publication-item__links {
  margin-top: var(--space-sm);
}

.multi-publication-item__links a,
.multi-publication-item__links button {
  margin-right: var(--space-md);
  font-size: var(--font-size-sm);
}
```

---

## Responsive Breakpoints

**File:** `css/multi.css`

```css
/* Mobile first - base styles apply to all sizes */

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  :root {
    --container-padding: 2rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .multi-container {
    max-width: 960px;
  }
}

/* Extra large devices (1200px and up) */
@media (min-width: 1200px) {
  .multi-container {
    max-width: 1140px;
  }
}
```

### Mobile-Specific Styles

```css
/* Stack team cards vertically on mobile */
@media (max-width: 575px) {
  .multi-team-carousel {
    flex-direction: column;
    align-items: center;
  }

  .multi-team-card {
    width: 100%;
    max-width: 320px;
  }

  .multi-team-list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
}
```

---

## Adding New Sections

### HTML Structure

**File:** `content.html`

```html
<section class="multi-section multi-section--newsection" aria-label="New Section">
  <div class="multi-container">
    <h2>Section Title</h2>
    <div class="multi-section__content">
      <!-- Content here -->
    </div>
  </div>
</section>
```

### CSS

**File:** `css/multi.css`

```css
/* ========================================
   NEW SECTION
   ======================================== */
.multi-section--newsection {
  background: var(--color-background);
}

.multi-section--newsection h2 {
  /* Custom title styles */
}

.multi-section__content {
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

**File:** `css/multi.css`

```css
/* Smooth hover transitions */
.multi-team-card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

/* Filter animation */
.multi-publication-item {
  transition: opacity var(--transition-fast);
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

**File:** `css/multi.css`

```css
/* Global focus style */
a:focus,
button:focus,
input:focus,
.multi-team-card:focus {
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
.multi-team-card {
  width: 320px;  /* was 280px */
}

.multi-team-card__photo {
  width: 150px;  /* was 120px */
  height: 150px;
}
```

### Change publication list to cards
```css
.multi-publications-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.multi-publication-item {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border-bottom: none;
}
```

### Add more space between sections
```css
.multi-section {
  padding: var(--space-xl) 0;  /* was space-lg */
  margin-bottom: var(--space-lg);
}
```

### Make header sticky with shadow on scroll
```css
.multi-site-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: box-shadow var(--transition-base);
}

.multi-site-header--scrolled {
  box-shadow: var(--shadow-md);
}
```

(Requires JS to add `.multi-site-header--scrolled` class on scroll)
