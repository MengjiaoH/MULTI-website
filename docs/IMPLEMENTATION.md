# MULTI Research Group Website - Implementation Guidelines

## Technology Stack

### Core Technologies

| Technology | Version | Purpose | CDN |
|------------|---------|---------|-----|
| HTML5 | - | Page structure | - |
| CSS3 | - | Styling | - |
| jQuery | 3.7.1 | DOM manipulation, AJAX | cdnjs |
| Google Fonts | - | Typography | fonts.googleapis.com |

### CDN Links

```html
<!-- jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
```

### Explicitly Excluded

Do not introduce:
- JavaScript frameworks (React, Vue, Angular, Svelte)
- CSS preprocessors (Sass, Less)
- Build tools (Webpack, Vite, Parcel)
- Package managers (npm, yarn)
- Server-side code (PHP, Node.js, Python)

## File Organization

```
/multi-website/
├── index.html           # Development shell (loads content.html)
├── content.html         # Main content for WordPress embedding
├── /css/
│   ├── variables.css    # CSS custom properties only
│   └── multi.css        # All other styles (multi- prefixed)
├── /js/
│   └── multi.js         # All JavaScript
├── /data/
│   ├── group.json       # Group info
│   ├── team.json        # Team members
│   └── publications.bib # Publications in BibTeX format
└── /images/
    ├── /team/           # Member photos
    ├── /research/       # Research banners
    └── /logos/          # Institution logos
```

## Code Style

### HTML

```html
<!-- Use semantic elements with multi- prefix -->
<header class="multi-site-header" role="banner">
<main id="multi-main" class="multi-main" role="main">
<section class="multi-section" aria-label="Team Members">
<article class="multi-publication-item">

<!-- Include accessibility attributes -->
<button class="multi-btn" aria-label="Filter by author" aria-pressed="false">
<img alt="Dr. Jane Doe, Associate Professor">

<!-- Data attributes for JS hooks -->
<div class="multi-team-card" data-member-id="chris-johnson">
```

### CSS

**File: variables.css**
```css
:root {
  /* Colors - University of Utah Brand */
  --color-primary: #BE0000;
  --color-primary-dark: #890000;
  --color-background: #E2E6E6;
  --color-secondary: #708E99;

  /* Typography */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Source Sans Pro', sans-serif;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Layout */
  --max-width: 1200px;
  --header-height: 80px;
}
```

**File: multi.css**
```css
/* Section comment format */
/* ========================================
   COMPONENT NAME
   ======================================== */

/* BEM naming with multi- prefix for namespace isolation */
/* This prevents conflicts when embedded in WordPress */
.multi-team-card { }
.multi-team-card__photo { }
.multi-team-card__name { }
.multi-team-card--selected { }

/* All IDs also use multi- prefix */
#multi-main { }
#multi-team-carousel { }
#multi-publications-list { }

/* Utility classes with multi- prefix */
.multi-sr-only { }      /* Screen reader only */
.multi-container { }    /* Max-width container */
```

### JavaScript

**Naming Conventions:**
```javascript
// Variables and functions: camelCase
const currentFilter = null;
function filterPublications() { }

// Constants: UPPER_SNAKE_CASE
const DEBOUNCE_DELAY = 300;
const SCROLL_OFFSET = 100;

// jQuery elements: $ prefix with multi- IDs
const $teamContainer = $('#multi-team-carousel');
const $publicationsList = $('#multi-publications-list');

// Event handlers: handle + Event + Target
function handleClickTeamCard(e) { }
function handleInputSearch(e) { }

// CSS class selectors use multi- prefix
$('.multi-team-card').on('click', ...);
$('.multi-publication-item').each(...);
```

**Module Pattern:**
```javascript
const MULTI = {
  // State
  state: {
    team: [],
    publications: [],
    filteredPublications: [],
    selectedMember: null
  },

  // Initialization
  init: function() {
    this.loadData();
    this.bindEvents();
  },

  // Data loading (BibTeX for publications)
  loadData: function() {
    $.when(
      $.getJSON('data/group.json'),
      $.getJSON('data/team.json'),
      $.get('data/publications.bib')
    ).done((groupData, teamData, bibData) => {
      this.renderGroup(groupData[0]);
      this.state.team = teamData[0].team;
      this.state.publications = this.parseBibtex(bibData);
      this.renderTeam();
      this.renderPublications();
    });
  },

  // Event binding (use multi- prefix for selectors)
  bindEvents: function() {
    $(document).on('click', '.multi-team-card', (e) => {
      this.handleClickTeamCard(e);
    });
  }
};

// Initialization is called after content.html is loaded (see index.html)
```

## Data Loading Pattern

```javascript
/**
 * Load all data files and initialize the page
 * Note: publications.bib is loaded as text, then parsed
 */
loadData: function() {
  $.when(
    $.getJSON('data/group.json'),
    $.getJSON('data/team.json'),
    $.get('data/publications.bib')
  ).done((groupResp, teamResp, bibResp) => {
    // Extract data (jQuery wraps JSON in array)
    const group = groupResp[0];
    const team = teamResp[0].team;
    const publications = this.parseBibtex(bibResp);

    // Store in state
    this.state.team = team;
    this.state.publications = publications;
    this.state.filteredPublications = [...publications];

    // Render
    this.renderGroup(group);
    this.renderTeam();
    this.renderTeamList();
    this.renderPublications();
  }).fail((error) => {
    console.error('Failed to load data:', error);
    this.showError('Unable to load page data. Please refresh.');
  });
}
```

## Rendering Pattern

```javascript
/**
 * Render team member cards (carousel view)
 */
renderTeam: function() {
  const $container = $('#multi-team-carousel');

  const html = this.state.team.map(member => `
    <article class="multi-team-card"
             data-member-id="${member.id}"
             tabindex="0"
             role="button"
             aria-label="View publications by ${member.name}">
      <img class="multi-team-card__photo"
           src="${member.photo || 'images/team/placeholder.jpg'}"
           alt="${member.name}, ${member.position}"
           loading="lazy"
           onerror="this.src='images/team/placeholder.jpg'">
      <h3 class="multi-team-card__name">${member.name}</h3>
      <p class="multi-team-card__position">${member.position}</p>
      <p class="multi-team-card__affiliation">${member.affiliation}</p>
    </article>
  `).join('');

  $container.html(html);
}
```

## Filtering Implementation

```javascript
/**
 * Filter publications by team member
 * @param {string} memberId - Team member ID or null for all
 */
filterByMember: function(memberId) {
  if (!memberId) {
    // Clear filter
    this.state.filteredPublications = [...this.state.publications];
    this.state.selectedMember = null;
  } else {
    // Find member and their author variants
    const member = this.state.team.find(m => m.id === memberId);
    if (!member) return;

    const variants = member.authorVariants || [member.name];

    // Filter publications
    this.state.filteredPublications = this.state.publications.filter(pub => {
      return pub.authors.some(author =>
        variants.some(variant =>
          author.toLowerCase().includes(variant.toLowerCase())
        )
      );
    });

    this.state.selectedMember = memberId;
  }

  this.updateUI();
  this.renderPublications();
}
```

## Event Handling

```javascript
/**
 * Bind all event handlers (all selectors use multi- prefix)
 */
bindEvents: function() {
  // Team card click (carousel)
  $(document).on('click', '.multi-team-card', (e) => {
    const memberId = $(e.currentTarget).data('member-id');
    this.filterByMember(memberId);
  });

  // Team list item click
  $(document).on('click', '.multi-team-list-item', (e) => {
    const memberId = $(e.currentTarget).data('member-id');
    this.filterByMember(memberId);
  });

  // Team card keyboard
  $(document).on('keydown', '.multi-team-card, .multi-team-list-item', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(e.currentTarget).trigger('click');
    }
  });

  // Search input (debounced)
  let searchTimeout;
  $('#multi-search-input').on('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      this.handleSearch(e.target.value);
    }, DEBOUNCE_DELAY);
  });

  // Clear filter
  $(document).on('click', '#multi-clear-filter', () => {
    this.filterByMember(null);
  });
}
```

## Error Handling

```javascript
/**
 * Display error message to user
 * @param {string} message - Error message
 */
showError: function(message) {
  const $error = $(`
    <div class="multi-error-message" role="alert">
      <p>${message}</p>
    </div>
  `);

  $('.multi-main').prepend($error);
}
```

## Accessibility Implementation

```javascript
/**
 * Announce filter changes to screen readers
 * @param {string} message - Announcement text
 */
announce: function(message) {
  $('#multi-aria-announcer').text(message);
}
```

The announcer element is defined in content.html:
```html
<div id="multi-aria-announcer" class="multi-sr-only" aria-live="polite" aria-atomic="true"></div>
```

## Testing Checklist

Before committing changes:

- [ ] Page loads without console errors
- [ ] All team members render
- [ ] All publications render
- [ ] Clicking team card filters publications
- [ ] Search filters results
- [ ] Clear filter works
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Mobile responsive layout works
- [ ] JSON files validate at jsonlint.com
