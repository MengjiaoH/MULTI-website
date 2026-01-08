// ABOUTME: Main JavaScript for MULTI research group website.
// ABOUTME: Handles data loading, rendering, and user interactions.

const MULTI = {
  // ========================================
  // STATE
  // ========================================
  state: {
    group: null,
    team: [],
    publications: [],
    filteredPublications: [],
    selectedMember: null,
    searchQuery: ''
  },

  // ========================================
  // CONSTANTS
  // ========================================
  DEBOUNCE_DELAY: 300,

  // ========================================
  // INITIALIZATION
  // ========================================
  init: function() {
    this.loadData();
    this.bindEvents();
  },

  // ========================================
  // DATA LOADING
  // ========================================
  loadData: function() {
    const self = this;

    $.when(
      $.getJSON('data/group.json'),
      $.getJSON('data/team.json'),
      $.get('data/publications.bib')
    ).done(function(groupResp, teamResp, bibResp) {
      self.state.group = groupResp[0];
      self.state.team = teamResp[0].team;
      self.state.publications = self.parseBibtex(bibResp);
      self.state.filteredPublications = [...self.state.publications];

      self.renderGroup();
      self.renderTeam();
      self.renderPublications();
    }).fail(function(error) {
      console.error('Failed to load data:', error);
      self.showError('Unable to load page data. Please refresh.');
    });
  },

  // ========================================
  // BIBTEX PARSER
  // ========================================
  parseBibtex: function(bibContent) {
    const publications = [];

    // Match BibTeX entries: @Type{key, ... }
    const entryRegex = /@(\w+)\{([^,]+),([^@]+)\}/g;
    let match;

    while ((match = entryRegex.exec(bibContent)) !== null) {
      const type = match[1].toLowerCase();
      const id = match[2].trim();
      const fieldsStr = match[3];

      // Parse fields
      const fields = this.parseBibtexFields(fieldsStr);

      // Build publication object
      const pub = {
        id: id,
        type: type,
        title: fields.title || '',
        authors: this.parseAuthors(fields.author || ''),
        year: parseInt(fields.year) || 0,
        venue: fields.journal || fields.booktitle || fields.howpublished || '',
        subtitle: fields.subtitle || '',
        url: fields.url || '',
        doi: fields.doi || '',
        bibtex: match[0]
      };

      publications.push(pub);
    }

    // Sort by year descending
    publications.sort(function(a, b) {
      return b.year - a.year;
    });

    return publications;
  },

  parseBibtexFields: function(fieldsStr) {
    const fields = {};

    // Match field = "value" or field = {value}
    const fieldRegex = /(\w+)\s*=\s*["{]([^"{}]+(?:\{[^{}]*\}[^"{}]*)*)["}]/gi;
    let match;

    while ((match = fieldRegex.exec(fieldsStr)) !== null) {
      const key = match[1].toLowerCase();
      let value = match[2];
      // Normalize whitespace
      value = value.replace(/\s+/g, ' ').trim();
      fields[key] = value;
    }

    return fields;
  },

  parseAuthors: function(authorStr) {
    if (!authorStr) return [];

    // Split by " and " (BibTeX author separator)
    return authorStr.split(/\s+and\s+/i).map(function(author) {
      return author.replace(/\s+/g, ' ').trim();
    }).filter(function(author) {
      return author.length > 0;
    });
  },

  // ========================================
  // EVENT BINDING
  // ========================================
  bindEvents: function() {
    const self = this;

    // Team card click
    $(document).on('click', '.team-card', function(e) {
      const memberId = $(this).data('member-id');
      self.handleTeamCardClick(memberId);
    });

    // Team card keyboard
    $(document).on('keydown', '.team-card', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Search input
    let searchTimeout;
    $('#search-input').on('input', function(e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        self.handleSearch(e.target.value);
      }, self.DEBOUNCE_DELAY);
    });

    // Clear filter
    $('#clear-filter').on('click', function() {
      self.clearFilter();
    });

    // Copy BibTeX
    $(document).on('click', '.copy-bibtex', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $btn = $(this);
      var index = parseInt($btn.attr('data-pub-index'), 10);
      var pub = self.state.filteredPublications[index];
      if (pub && pub.bibtex) {
        self.copyToClipboard(pub.bibtex);
        $btn.text('Copied!');
        setTimeout(function() {
          $btn.text('Copy BibTeX');
        }, 1500);
      }
    });
  },

  // ========================================
  // EVENT HANDLERS
  // ========================================
  handleTeamCardClick: function(memberId) {
    if (this.state.selectedMember === memberId) {
      this.clearFilter();
    } else {
      this.filterByMember(memberId);
    }
  },

  handleSearch: function(query) {
    this.state.searchQuery = query.toLowerCase().trim();
    this.applyFilters();
  },

  // ========================================
  // FILTERING
  // ========================================
  filterByMember: function(memberId) {
    this.state.selectedMember = memberId;
    this.applyFilters();
    this.updateTeamCardStates();
    this.renderMemberDetail();
    this.showFilterIndicator();
    this.scrollToMemberDetail();
  },

  clearFilter: function() {
    this.state.selectedMember = null;
    this.state.searchQuery = '';
    $('#search-input').val('');
    this.applyFilters();
    this.updateTeamCardStates();
    this.hideMemberDetail();
    this.hideFilterIndicator();
  },

  applyFilters: function() {
    const self = this;
    let filtered = [...this.state.publications];

    // Filter by member
    if (this.state.selectedMember) {
      const member = this.state.team.find(m => m.id === this.state.selectedMember);
      if (member) {
        const variants = member.authorVariants || [member.name];
        filtered = filtered.filter(function(pub) {
          return pub.authors.some(function(author) {
            return variants.some(function(variant) {
              return author.toLowerCase().includes(variant.toLowerCase());
            });
          });
        });
      }
    }

    // Filter by search
    if (this.state.searchQuery) {
      filtered = filtered.filter(function(pub) {
        const searchText = [
          pub.title,
          pub.authors.join(' '),
          pub.venue || '',
          pub.year.toString()
        ].join(' ').toLowerCase();
        return searchText.includes(self.state.searchQuery);
      });
    }

    this.state.filteredPublications = filtered;
    this.renderPublications();
  },

  // ========================================
  // RENDERING
  // ========================================
  renderGroup: function() {
    const group = this.state.group;
    $('#group-name').text(group.name);
    $('#group-intro').text(group.introduction);
  },

  renderTeam: function() {
    const self = this;
    const $container = $('#team-carousel');

    const html = this.state.team.map(function(member) {
      return '<article class="team-card" data-member-id="' + member.id + '" tabindex="0" role="button" aria-label="View publications by ' + member.name + '">' +
        '<img class="team-card__photo" src="' + member.photo + '" alt="' + member.name + ', ' + member.position + '" loading="lazy">' +
        '<h3 class="team-card__name">' + member.name + '</h3>' +
        '<p class="team-card__position">' + member.position + '</p>' +
        '<p class="team-card__affiliation">' + member.affiliation + '</p>' +
      '</article>';
    }).join('');

    $container.html(html);
  },

  renderPublications: function() {
    const $container = $('#publications-list');
    const $count = $('#results-count');
    const publications = this.state.filteredPublications;

    $count.text(publications.length + ' publication' + (publications.length !== 1 ? 's' : ''));

    if (publications.length === 0) {
      $container.html('<p class="no-results">No publications found.</p>');
      return;
    }

    const html = publications.map(function(pub, index) {
      let links = '';
      if (pub.url) {
        links += '<a href="' + pub.url + '" target="_blank" rel="noopener">PDF</a>';
      }
      links += '<button type="button" class="btn--text copy-bibtex" data-pub-index="' + index + '">Copy BibTeX</button>';
      if (pub.doi) {
        links += '<a href="https://doi.org/' + pub.doi + '" target="_blank" rel="noopener">DOI</a>';
      }

      // For @misc entries, show subtitle and year; otherwise show venue and year
      let venueText;
      if (pub.type === 'misc' && pub.subtitle) {
        venueText = pub.subtitle + ', ' + pub.year;
      } else {
        venueText = pub.venue + ', ' + pub.year;
      }

      return '<article class="publication-item">' +
        '<h3 class="publication-item__title">' + pub.title + '</h3>' +
        '<p class="publication-item__authors">' + pub.authors.join(', ') + '</p>' +
        '<p class="publication-item__venue">' + venueText + '</p>' +
        '<div class="publication-item__links">' + links + '</div>' +
      '</article>';
    }).join('');

    $container.html(html);
  },

  // ========================================
  // UI UPDATES
  // ========================================
  updateTeamCardStates: function() {
    const selectedId = this.state.selectedMember;
    $('.team-card').each(function() {
      const $card = $(this);
      const isSelected = $card.data('member-id') === selectedId;
      $card.toggleClass('team-card--selected', isSelected);
      $card.attr('aria-pressed', isSelected);
    });
  },

  showFilterIndicator: function() {
    const member = this.state.team.find(m => m.id === this.state.selectedMember);
    if (member) {
      $('#filter-text').text('Showing publications by ' + member.name);
      $('#filter-indicator').removeAttr('hidden');
      this.announce('Filtered to publications by ' + member.name);
    }
  },

  hideFilterIndicator: function() {
    $('#filter-indicator').attr('hidden', true);
    this.announce('Filter cleared, showing all publications');
  },

  renderMemberDetail: function() {
    const member = this.state.team.find(m => m.id === this.state.selectedMember);
    if (!member) return;

    // Research banner
    $('#member-banner').attr('src', member.researchBanner || '').attr('alt', member.name + ' research visualization');

    // Photo
    $('#member-photo').attr('src', member.photo).attr('alt', member.name);

    // Name
    $('#member-name').text(member.name);

    // Titles
    const titlesHtml = (member.titles || []).map(function(title) {
      return '<li>' + title + '</li>';
    }).join('');
    $('#member-titles').html(titlesHtml);

    // Contact
    let contactHtml = '';
    if (member.email) {
      contactHtml += '<a href="mailto:' + member.email + '">' + member.email + '</a>';
    }
    if (member.website) {
      contactHtml += '<a href="' + member.website + '" target="_blank" rel="noopener">Personal website</a>';
    }
    $('#member-contact').html(contactHtml);

    // Background (supports HTML)
    $('#member-background').html(member.background || '');

    // Research interests
    const interestsHtml = (member.researchInterests || []).map(function(interest) {
      return '<li>' + interest + '</li>';
    }).join('');
    $('#member-interests').html(interestsHtml);

    // Show section
    $('#member-detail').removeAttr('hidden');
  },

  hideMemberDetail: function() {
    $('#member-detail').attr('hidden', true);
  },

  scrollToMemberDetail: function() {
    $('html, body').animate({
      scrollTop: $('#member-detail').offset().top - 100
    }, 300);
  },

  // ========================================
  // ACCESSIBILITY
  // ========================================
  announce: function(message) {
    $('#aria-announcer').text(message);
  },

  // ========================================
  // CLIPBOARD
  // ========================================
  copyToClipboard: function(text) {
    const self = this;

    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        self.announce('BibTeX copied to clipboard');
      }).catch(function() {
        self.copyToClipboardFallback(text);
      });
    } else {
      self.copyToClipboardFallback(text);
    }
  },

  copyToClipboardFallback: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      document.execCommand('copy');
      this.announce('BibTeX copied to clipboard');
    } catch (err) {
      this.announce('Failed to copy BibTeX');
    }

    document.body.removeChild(textarea);
  },

  // ========================================
  // ERROR HANDLING
  // ========================================
  showError: function(message) {
    const $error = $('<div class="error-message" role="alert"><p>' + message + '</p></div>');
    $('main').prepend($error);
  }
};

// Initialization is called after content.html is loaded (see index.html)
