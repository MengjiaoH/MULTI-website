// ABOUTME: JavaScript for MULTI research group website.
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
    searchQuery: '',
    carouselTimer: null,
    carouselIndex: 0,
    carouselStep: 0,
    carouselSetWidth: 0,
    carouselAutoScrolling: false,
    teamView: 'carousel'  // 'carousel' or 'list'
  },

  // ========================================
  // CONSTANTS
  // ========================================
  DEBOUNCE_DELAY: 300,
  CAROUSEL_PAUSE: 2000,       // Pause per person (ms)
  CAROUSEL_TRANSITION: 1000,  // Transition duration (ms)

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
      self.renderTeamList();
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
    $(document).on('click', '.multi-team-card', function(e) {
      const memberId = $(this).data('member-id');
      self.handleTeamCardClick(memberId);
    });

    // Team card keyboard
    $(document).on('keydown', '.multi-team-card', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Search input
    let searchTimeout;
    $('#multi-search-input').on('input', function(e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        self.handleSearch(e.target.value);
      }, self.DEBOUNCE_DELAY);
    });

    // Clear filter
    $('#multi-clear-filter').on('click', function() {
      self.clearFilter();
    });

    // Team view toggle
    $('#multi-view-carousel').on('click', function() {
      self.setTeamView('carousel');
    });
    $('#multi-view-list').on('click', function() {
      self.setTeamView('list');
    });

    // Team list item click
    $(document).on('click', '.multi-team-list-item', function() {
      const memberId = $(this).data('member-id');
      self.handleTeamCardClick(memberId);
    });

    // Team list item keyboard
    $(document).on('keydown', '.multi-team-list-item', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Copy BibTeX
    $(document).on('click', '.multi-copy-bibtex', function(e) {
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
    this.stopCarousel();
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
    $('#multi-search-input').val('');
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
    $('#multi-group-name').text(group.name);
    $('#multi-group-intro').text(group.introduction);
  },

  renderTeam: function() {
    const self = this;
    const $container = $('#multi-team-carousel');

    const html = this.state.team.map(function(member) {
      return '<article class="multi-team-card" data-member-id="' + member.id + '" tabindex="0" role="button" aria-label="View publications by ' + member.name + '">' +
        '<img class="multi-team-card__photo" src="' + (member.photo || 'images/team/placeholder.jpg') + '" alt="' + member.name + ', ' + member.position + '" loading="lazy" onerror="this.src=\'images/team/placeholder.jpg\'">' +
        '<h3 class="multi-team-card__name">' + member.name + '</h3>' +
        '<p class="multi-team-card__position">' + member.position + '</p>' +
        '<p class="multi-team-card__affiliation">' + member.affiliation + '</p>' +
      '</article>';
    }).join('');

    $container.html(html);
    this.setupCarousel();
    this.startCarousel();
  },

  renderTeamList: function() {
    const $container = $('#multi-team-list');

    const html = this.state.team.map(function(member) {
      return '<li class="multi-team-list-item" data-member-id="' + member.id + '" tabindex="0" role="button" aria-label="View details for ' + member.name + '">' +
        '<span class="multi-team-list-item__name">' + member.name + '</span>' +
        '<span class="multi-team-list-item__position">' + member.position + '</span>' +
        '<span class="multi-team-list-item__affiliation">' + member.affiliation + '</span>' +
      '</li>';
    }).join('');

    $container.html(html);
  },

  setTeamView: function(view) {
    this.state.teamView = view;

    // Update toggle buttons
    $('#multi-view-carousel')
      .toggleClass('multi-view-btn--active', view === 'carousel')
      .attr('aria-pressed', view === 'carousel');
    $('#multi-view-list')
      .toggleClass('multi-view-btn--active', view === 'list')
      .attr('aria-pressed', view === 'list');

    // Show/hide views
    if (view === 'carousel') {
      $('#multi-team-carousel').removeAttr('hidden');
      $('#multi-team-list').attr('hidden', true);
      this.startCarousel();
    } else {
      $('#multi-team-carousel').attr('hidden', true);
      $('#multi-team-list').removeAttr('hidden');
      this.stopCarousel();
      this.updateTeamListStates();
    }
  },

  // ========================================
  // CAROUSEL AUTO-SCROLL
  // ========================================
  setupCarousel: function() {
    const self = this;
    const $container = $('#multi-team-carousel');
    const $cards = $container.find('.multi-team-card:not(.multi-team-card--clone)');

    if ($cards.length === 0) return;

    // Calculate dimensions
    const $firstCard = $cards.first();
    const cardWidth = $firstCard.outerWidth(true);
    const gap = parseInt($container.css('gap')) || 32;
    const step = cardWidth + gap;
    const setWidth = $cards.length * step;

    // Store for later use
    this.state.carouselStep = step;
    this.state.carouselSetWidth = setWidth;

    // Clone all cards and prepend (for backward scrolling)
    $($cards.get().reverse()).each(function() {
      const $clone = $(this).clone();
      $clone.addClass('multi-team-card--clone');
      $container.prepend($clone);
    });

    // Clone all cards and append (for forward scrolling)
    $cards.each(function() {
      const $clone = $(this).clone();
      $clone.addClass('multi-team-card--clone');
      $container.append($clone);
    });

    // Note: Click events on clones are handled by the delegated handler
    // in bindEvents() which matches all .multi-team-card elements

    // Start at the first original card (after prepended clones)
    $container.scrollLeft(setWidth);
    this.state.carouselIndex = 0;

    // Handle manual scroll for infinite looping
    let scrollTimeout;
    $container.off('scroll.carousel').on('scroll.carousel', function() {
      // Skip if auto-scrolling is in progress
      if (self.state.carouselAutoScrolling) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        const scrollLeft = $container.scrollLeft();

        // If scrolled into prepended clones, jump to end of originals
        if (scrollLeft < step / 2) {
          $container.scrollLeft(scrollLeft + setWidth);
        }
        // If scrolled into appended clones, jump to start of originals
        else if (scrollLeft > setWidth + setWidth - step / 2) {
          $container.scrollLeft(scrollLeft - setWidth);
        }
      }, 50);
    });
  },

  startCarousel: function() {
    const self = this;
    const $container = $('#multi-team-carousel');
    const originalCount = this.state.team.length;

    if (originalCount === 0) return;

    // Stop any existing timer
    this.stopCarousel();

    const step = this.state.carouselStep;
    const setWidth = this.state.carouselSetWidth;

    function scrollNext() {
      self.state.carouselIndex++;
      // Target is offset by setWidth because of prepended clones
      const targetScroll = setWidth + (self.state.carouselIndex * step);

      // Mark auto-scrolling in progress
      self.state.carouselAutoScrolling = true;

      // Smooth animate to next card
      $container.stop(true).animate({ scrollLeft: targetScroll }, self.CAROUSEL_TRANSITION, 'swing', function() {
        // When we've scrolled past all original cards, reset instantly
        if (self.state.carouselIndex >= originalCount) {
          self.state.carouselIndex = 0;
          // Use longer delay for Safari - ensures scroll events have settled
          setTimeout(function() {
            $container.scrollLeft(setWidth);
            // Keep auto-scrolling flag true a bit longer to block any pending scroll events
            setTimeout(function() {
              self.state.carouselAutoScrolling = false;
            }, 100);
            // Schedule next scroll after pause
            self.state.carouselTimer = setTimeout(scrollNext, self.CAROUSEL_PAUSE);
          }, 20);
        } else {
          // Mark auto-scrolling complete
          self.state.carouselAutoScrolling = false;
          // Schedule next scroll after pause
          self.state.carouselTimer = setTimeout(scrollNext, self.CAROUSEL_PAUSE);
        }
      });
    }

    // Start first scroll after initial pause
    this.state.carouselTimer = setTimeout(scrollNext, this.CAROUSEL_PAUSE);

    // Pause on hover
    $container.off('mouseenter.carousel mouseleave.carousel');
    $container.on('mouseenter.carousel', function() {
      self.stopCarousel();
      $container.stop(true);
    });
    $container.on('mouseleave.carousel', function() {
      // Reset index to current visible card position (accounting for prepended clones)
      const currentScroll = $container.scrollLeft() - setWidth;
      self.state.carouselIndex = Math.round(currentScroll / step);
      if (self.state.carouselIndex < 0) self.state.carouselIndex = 0;
      if (self.state.carouselIndex >= originalCount) self.state.carouselIndex = 0;
      self.startCarousel();
    });
  },

  stopCarousel: function() {
    if (this.state.carouselTimer) {
      clearTimeout(this.state.carouselTimer);
      this.state.carouselTimer = null;
    }
    this.state.carouselAutoScrolling = false;
  },

  renderPublications: function() {
    const $container = $('#multi-publications-list');
    const $count = $('#multi-results-count');
    const publications = this.state.filteredPublications;

    $count.text(publications.length + ' publication' + (publications.length !== 1 ? 's' : ''));

    if (publications.length === 0) {
      $container.html('<p class="multi-no-results">No publications found.</p>');
      return;
    }

    const html = publications.map(function(pub, index) {
      let links = '';
      if (pub.url) {
        links += '<a href="' + pub.url + '" target="_blank" rel="noopener">PDF</a>';
      }
      links += '<button type="button" class="multi-btn--text multi-copy-bibtex" data-pub-index="' + index + '">Copy BibTeX</button>';
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

      return '<article class="multi-publication-item">' +
        '<h3 class="multi-publication-item__title">' + pub.title + '</h3>' +
        '<p class="multi-publication-item__authors">' + pub.authors.join(', ') + '</p>' +
        '<p class="multi-publication-item__venue">' + venueText + '</p>' +
        '<div class="multi-publication-item__links">' + links + '</div>' +
      '</article>';
    }).join('');

    $container.html(html);
  },

  // ========================================
  // UI UPDATES
  // ========================================
  updateTeamCardStates: function() {
    const selectedId = this.state.selectedMember;
    $('.multi-team-card').each(function() {
      const $card = $(this);
      const isSelected = $card.data('member-id') === selectedId;
      $card.toggleClass('multi-team-card--selected', isSelected);
      $card.attr('aria-pressed', isSelected);
    });
    this.updateTeamListStates();
  },

  updateTeamListStates: function() {
    const selectedId = this.state.selectedMember;
    $('.multi-team-list-item').each(function() {
      const $item = $(this);
      const isSelected = $item.data('member-id') === selectedId;
      $item.toggleClass('multi-team-list-item--selected', isSelected);
      $item.attr('aria-pressed', isSelected);
    });
  },

  showFilterIndicator: function() {
    const member = this.state.team.find(m => m.id === this.state.selectedMember);
    if (member) {
      $('#multi-filter-text').text('Showing publications by ' + member.name);
      $('#multi-filter-indicator').removeAttr('hidden');
      this.announce('Filtered to publications by ' + member.name);
    }
  },

  hideFilterIndicator: function() {
    $('#multi-filter-indicator').attr('hidden', true);
    this.announce('Filter cleared, showing all publications');
  },

  renderMemberDetail: function() {
    const member = this.state.team.find(m => m.id === this.state.selectedMember);
    if (!member) return;

    // Research banner (with fallback)
    var $banner = $('#multi-member-banner');
    $banner.off('error').on('error', function() {
      $(this).attr('src', 'images/research/multi-banner.png');
    });
    $banner.attr('src', member.researchBanner || 'images/research/multi-banner.png').attr('alt', member.name + ' research visualization');

    // Photo (with fallback)
    var $photo = $('#multi-member-photo');
    $photo.off('error').on('error', function() {
      $(this).attr('src', 'images/team/placeholder.jpg');
    });
    $photo.attr('src', member.photo || 'images/team/placeholder.jpg').attr('alt', member.name);

    // Name
    $('#multi-member-name').text(member.name);

    // Titles
    const titlesHtml = (member.titles || []).map(function(title) {
      return '<li>' + title + '</li>';
    }).join('');
    $('#multi-member-titles').html(titlesHtml);

    // Contact
    let contactHtml = '';
    if (member.email) {
      contactHtml += '<a href="mailto:' + member.email + '">' + member.email + '</a>';
    }
    if (member.website) {
      contactHtml += '<a href="' + member.website + '" target="_blank" rel="noopener">Personal website</a>';
    }
    $('#multi-member-contact').html(contactHtml);

    // Background (supports HTML)
    $('#multi-member-background').html(member.background || '');

    // Research interests
    const interestsHtml = (member.researchInterests || []).map(function(interest) {
      return '<li>' + interest + '</li>';
    }).join('');
    $('#multi-member-interests').html(interestsHtml);

    // Show section
    $('#multi-member-detail').removeAttr('hidden');
  },

  hideMemberDetail: function() {
    $('#multi-member-detail').attr('hidden', true);
  },

  scrollToMemberDetail: function() {
    $('html, body').animate({
      scrollTop: $('#multi-member-detail').offset().top - 100
    }, 300);
  },

  // ========================================
  // ACCESSIBILITY
  // ========================================
  announce: function(message) {
    $('#multi-aria-announcer').text(message);
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
    const $error = $('<div class="multi-error-message" role="alert"><p>' + message + '</p></div>');
    $('.multi-main').prepend($error);
  }
};

// Initialization is called after content.html is loaded (see index.html)
