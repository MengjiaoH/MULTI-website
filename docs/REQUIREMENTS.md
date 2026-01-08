# MULTI Research Group Website - Requirements & Constraints

## Functional Requirements

### FR-1: Single Page Application
- The entire website is contained in one HTML page
- No page navigation or routing required
- All sections accessible via scrolling

### FR-2: Group Introduction
- Display group name and acronym expansion
- Show introductory paragraph about research focus
- Content must be editable via JSON file

### FR-3: Team Member Display
- Show all 7 team members in a horizontal carousel/slider
- Each card displays: photo, name, position
- Cards are clickable to trigger publication filtering
- Visual feedback on hover and selection

### FR-4: Publication List
- Display ~300 publications
- Default sort: newest first (by year)
- Show: title, authors, venue, year
- Include links to PDF and DOI when available

### FR-5: Publication Filtering
- Filter by clicking a team member card
- Show filter indicator when active
- Provide "clear filter" option
- Smooth transition when filter changes

### FR-6: Search Functionality
- Search across title, authors, venue
- Real-time results as user types
- Compatible with author filter (AND logic)

## Non-Functional Requirements

### NFR-1: Maintainability
**Priority: Critical**

- Content updates require only JSON file edits
- No knowledge of HTML/CSS/JS needed for content changes
- Adding a team member: edit team.json, add photo
- Adding publications: edit publications.json
- Changing descriptions: edit group.json or team.json

### NFR-2: No Build Step
**Priority: Critical**

- No npm, webpack, or any build tools
- Files served directly as-is
- No preprocessing or compilation
- Drag-and-drop deployment to any web server

### NFR-3: Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome for Android (latest)

### NFR-4: Performance
- Initial page load < 3 seconds on broadband
- Publication filtering < 100ms response
- Smooth scrolling (60fps)
- Lazy load team member photos

### NFR-5: Accessibility (WCAG 2.1 AA)
- Color contrast ratio ≥ 4.5:1 for text
- All interactive elements keyboard accessible
- Screen reader compatible
- Focus indicators visible

## Design Constraints

### DC-1: University of Utah Brand Compliance

**Required Colors:**

| Name | Hex | Usage |
|------|-----|-------|
| Utah Red | #BE0000 | Primary accent, links, buttons |
| Red Rocks | #890000 | Hover states |
| Salt Flat Grey | #E2E6E6 | Backgrounds |
| Granite Peak | #708E99 | Secondary text |

**Required Typography:**
- Headings: Montserrat Bold
- Body: Source Sans Pro

**Logo Requirements:**
- University of Utah logo must link to utah.edu
- SCI Institute logo must link to sci.utah.edu
- Maintain proper clearance space around logos

### DC-2: Technology Constraints

| Allowed | Not Allowed |
|---------|-------------|
| HTML5 | React, Vue, Angular |
| CSS3 | Sass, Less, PostCSS |
| jQuery 3.7+ | Other JS frameworks |
| JSON | Databases, APIs |
| CDN-hosted libraries | npm packages |

### DC-3: Data Format Constraints

- All data in JSON format
- UTF-8 encoding
- Publications derived from BibTeX (converted to JSON)
- Author names must match between team.json variants and publications.json

## Content Requirements

### Team Member Data

Each team member entry must include:

| Field | Required | Description |
|-------|----------|-------------|
| id | Yes | Unique identifier (lowercase, hyphenated) |
| name | Yes | Display name |
| position | Yes | Title/role in group |
| email | Yes | Contact email |
| photo | Yes | Path to headshot image |
| background | Yes | 1-2 sentence background |
| researchInterests | Yes | Array of interest areas |
| authorVariants | Yes | Name variations used in publications |

### Publication Data

Each publication entry must include:

| Field | Required | Description |
|-------|----------|-------------|
| id | Yes | Unique identifier (from BibTeX key) |
| title | Yes | Full title |
| authors | Yes | Array of author names |
| year | Yes | Publication year (number) |
| venue | Yes | Journal/conference name |
| type | No | journal, conference, book, thesis, preprint |
| url | No | Link to PDF |
| doi | No | DOI identifier |

### Image Requirements

**Team Photos:**
- Format: JPEG or WebP
- Dimensions: 400x400px minimum
- Aspect ratio: 1:1 (square)
- File size: < 100KB
- Naming: `firstname-lastname.jpg`

**Logos:**
- Format: SVG preferred, PNG acceptable
- University logo: Official version from brand guidelines
- SCI logo: Official version from SCI website

## Interaction Requirements

### IR-1: Team Card Interaction

```
User Action          → System Response
─────────────────────────────────────────────────
Hover on card        → Subtle elevation/shadow increase
Click card           → 1. Highlight card (selected state)
                       2. Scroll to publications
                       3. Filter publications
                       4. Show filter indicator
Click selected card  → Deselect and clear filter
```

### IR-2: Publication List Interaction

```
User Action          → System Response
─────────────────────────────────────────────────
Type in search       → Filter results (300ms debounce)
Click author name    → Filter by that author
Click "Clear"        → Remove all filters
Click PDF link       → Open PDF in new tab
Click DOI link       → Open DOI page in new tab
```

### IR-3: Scroll Behavior

- Smooth scroll when navigating to publications
- Header remains fixed during scroll
- Back-to-top button appears after scrolling down

## Validation Checklist

Before deployment, verify:

- [ ] All team members display correctly
- [ ] All publications load and display
- [ ] Clicking each team member filters correctly
- [ ] Search returns expected results
- [ ] All PDF/DOI links work
- [ ] Page loads in < 3 seconds
- [ ] Mobile layout functions properly
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] JSON files validate (use jsonlint.com)
