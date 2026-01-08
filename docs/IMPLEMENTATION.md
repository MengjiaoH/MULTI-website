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
├── index.html           # Single HTML file
├── /css/
│   ├── variables.css    # CSS custom properties only
│   └── main.css         # All other styles
├── /js/
│   └── main.js          # All JavaScript
├── /data/
│   ├── group.json       # Group info
│   ├── team.json        # Team members
│   └── publications.json # Publications
└── /images/
    ├── /team/           # Member photos
    └── /logos/          # Institution logos
```

## Code Style

### HTML

```html
<!-- Use semantic elements -->
<header role="banner">
<main role="main">
<section aria-label="Team Members">
<article class="publication-card">

<!-- Include accessibility attributes -->
<button aria-label="Filter by author" aria-pressed="false">
<img alt="Dr. Jane Doe, Associate Professor">

<!-- Data attributes for JS hooks -->
<div class="team-card" data-member-id="chris-johnson">
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

**File: main.css**
```css
/* Section comment format */
/* ========================================
   COMPONENT NAME
   ======================================== */

/* BEM naming convention */
.team-card { }
.team-card__photo { }
.team-card__name { }
.team-card--selected { }

/* Utility classes with u- prefix */
.u-text-center { }
.u-hidden { }
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

// jQuery elements: $ prefix
const $teamContainer = $('#team-container');
const $publicationsList = $('#publications-list');

// Event handlers: handle + Event + Target
function handleClickTeamCard(e) { }
function handleInputSearch(e) { }
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

  // Data loading
  loadData: function() {
    $.when(
      $.getJSON('data/group.json'),
      $.getJSON('data/team.json'),
      $.getJSON('data/publications.json')
    ).done((groupData, teamData, pubData) => {
      this.renderGroup(groupData[0]);
      this.state.team = teamData[0].team;
      this.state.publications = pubData[0].publications;
      this.renderTeam();
      this.renderPublications();
    });
  },

  // Event binding
  bindEvents: function() {
    $(document).on('click', '.team-card', (e) => {
      this.handleClickTeamCard(e);
    });
  }
};

$(document).ready(() => MULTI.init());
```

## Data Loading Pattern

```javascript
/**
 * Load all data files and initialize the page
 */
loadData: function() {
  const promises = [
    $.getJSON('data/group.json'),
    $.getJSON('data/team.json'),
    $.getJSON('data/publications.json')
  ];

  $.when(...promises)
    .done((groupResp, teamResp, pubResp) => {
      // Extract data (jQuery wraps in array)
      const group = groupResp[0];
      const team = teamResp[0].team;
      const publications = pubResp[0].publications;

      // Store in state
      this.state.team = team;
      this.state.publications = publications;
      this.state.filteredPublications = [...publications];

      // Render
      this.renderGroup(group);
      this.renderTeam();
      this.renderPublications();
    })
    .fail((error) => {
      console.error('Failed to load data:', error);
      this.showError('Unable to load page data. Please refresh.');
    });
}
```

## Rendering Pattern

```javascript
/**
 * Render team member cards
 */
renderTeam: function() {
  const $container = $('#team-container');

  const html = this.state.team.map(member => `
    <article class="team-card"
             data-member-id="${member.id}"
             tabindex="0"
             role="button"
             aria-label="View publications by ${member.name}">
      <img class="team-card__photo"
           src="${member.photo}"
           alt="${member.name}, ${member.position}"
           loading="lazy">
      <h3 class="team-card__name">${member.name}</h3>
      <p class="team-card__position">${member.position}</p>
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
 * Bind all event handlers
 */
bindEvents: function() {
  // Team card click
  $(document).on('click', '.team-card', (e) => {
    const memberId = $(e.currentTarget).data('member-id');
    this.filterByMember(memberId);
  });

  // Team card keyboard
  $(document).on('keydown', '.team-card', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(e.currentTarget).trigger('click');
    }
  });

  // Search input (debounced)
  let searchTimeout;
  $('#search-input').on('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      this.handleSearch(e.target.value);
    }, DEBOUNCE_DELAY);
  });

  // Clear filter
  $(document).on('click', '#clear-filter', () => {
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
    <div class="error-message" role="alert">
      <p>${message}</p>
      <button onclick="location.reload()">Refresh Page</button>
    </div>
  `);

  $('main').prepend($error);
}
```

## Accessibility Implementation

```javascript
/**
 * Announce filter changes to screen readers
 * @param {string} message - Announcement text
 */
announce: function(message) {
  let $announcer = $('#aria-announcer');

  if (!$announcer.length) {
    $announcer = $('<div id="aria-announcer" class="sr-only" aria-live="polite"></div>');
    $('body').append($announcer);
  }

  $announcer.text(message);
}
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
