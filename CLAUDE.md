# MULTI Research Group Website - Development Context

## Project Overview

Single-page website for the MULTI research group at SCI Institute, University of Utah. Displays group introduction, team member carousel, and filterable publication list.

## Core Principle: Data-Interface Separation

All content lives in data files (`data/`). Maintainers update content without touching code.

- `data/group.json` - Group description
- `data/team.json` - Team members with `authorVariants` for publication matching
- `data/publications.bib` - Publications in BibTeX format (parsed client-side)

## Technology Constraints

**Allowed:**
- HTML5, CSS3, jQuery 3.7+ (CDN)
- JSON for structured data, BibTeX for publications
- Google Fonts (Montserrat, Source Sans Pro)

**Not Allowed:**
- JavaScript frameworks (React, Vue, Angular)
- CSS preprocessors (Sass, Less)
- Build tools (Webpack, Vite, npm)
- Server-side code

## File Structure

```
index.html              # Single page
css/variables.css       # CSS custom properties (colors, fonts, spacing)
css/main.css            # All styles
js/main.js              # All JavaScript (includes BibTeX parser)
data/group.json         # Group info
data/team.json          # Team members
data/publications.bib   # Publications (BibTeX format)
images/team/            # Member photos (400x400 JPEG)
images/logos/           # University and SCI logos
docs/                   # Documentation
```

## Code Style

**CSS:**
- BEM naming: `.block__element--modifier`
- Use CSS variables from `variables.css`
- Mobile-first with `min-width` media queries

**JavaScript:**
- camelCase for variables/functions
- UPPER_SNAKE_CASE for constants
- `$` prefix for jQuery elements
- Module pattern (single `MULTI` object)

## Key Features

1. **Team Carousel:** Horizontal scrolling cards, clickable to filter publications
2. **Publication Filtering:** Matches `authorVariants` from team.json against publication authors
3. **Search:** Debounced (300ms), searches title/authors/venue

## Brand Requirements

- Primary color: Utah Red `#BE0000`
- Hover: Red Rocks `#890000`
- Background: Salt Flat Grey `#E2E6E6`
- Headings: Montserrat Bold
- Body: Source Sans Pro

## Documentation

- `docs/DESIGN.md` - Architecture and data schemas
- `docs/REQUIREMENTS.md` - Functional requirements and constraints
- `docs/IMPLEMENTATION.md` - Code patterns and examples
- `docs/CONTENT-UPDATE.md` - Guide for content maintainers
- `docs/STYLE-GUIDE.md` - CSS and layout modifications
