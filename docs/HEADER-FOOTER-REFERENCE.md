# Header & Footer Reference

Reverse-engineered from sci.utah.edu and university brand guidelines.

## SCI Institute Header

**Logo:** `https://sci.utah.edu/wp-content/uploads/2025/05/sci2024-wt.png`

**Navigation Links:**
- About the Institute → https://sci.utah.edu/about
- Components of SCI (dropdown)
  - Transdisciplinary R&D
  - Large-Scale Systems
  - Fundamental Algorithms/Applied Math
  - Visualization
  - Computational X
  - Imaging
- News → https://sci.utah.edu/news
- Events → https://sci.utah.edu/events
- Centers, Labs and Research Groups → https://sci.utah.edu/centers
- People → https://sci.utah.edu/people
- Publications → https://sci.utah.edu/publications
- Software/Data → https://sci.utah.edu/software
- Contact → https://sci.utah.edu/contact

## Search Implementation

University of Utah uses Google Custom Search Engine (GCSE).

**Search Engine ID:** `008932147021757332745:56t7vy9cw9w`

```html
<!-- Google Custom Search -->
<script async src="https://cse.google.com/cse.js?cx=008932147021757332745:56t7vy9cw9w"></script>
<div class="gcse-search"></div>
```

For a simpler search box that redirects to Google:
```html
<form action="https://www.google.com/search" method="get" target="_blank">
  <input type="hidden" name="sitesearch" value="sci.utah.edu">
  <input type="text" name="q" placeholder="Search SCI...">
  <button type="submit">Search</button>
</form>
```

## Footer

**SCI Address:**
```
72 So. Central Campus Drive
Room 3750
Salt Lake City, UT 84112
Phone: 801-585-1867
```

**Required Legal Links:**
- Nondiscrimination & Accessibility → https://www.utah.edu/nondiscrimination/
- Disclaimer → https://www.utah.edu/disclaimer/
- Privacy → https://www.utah.edu/privacy/
- Media Contacts → https://unews.utah.edu/media-contacts/

**Social Media:**
- Twitter/X: https://twitter.com/UofU
- Facebook: https://www.facebook.com/universityofutah
- Instagram: https://www.instagram.com/universityofutah/
- YouTube: https://www.youtube.com/universityofutah

**Copyright:** © 2026 THE UNIVERSITY OF UTAH

## Brand Colors (from brand.utah.edu)

| Color | Hex | Usage |
|-------|-----|-------|
| Utah Red | #BE0000 | Primary |
| Red Rocks | #890000 | Hover |
| Blue accent | #2E669E | Links (some contexts) |

## Simplified Header HTML

```html
<header class="site-header">
  <div class="header-top">
    <a href="https://www.utah.edu" class="u-logo">
      <img src="images/logos/university-of-utah-logo.svg" alt="University of Utah">
    </a>
    <div class="header-search">
      <form action="https://www.google.com/search" method="get" target="_blank">
        <input type="hidden" name="sitesearch" value="sci.utah.edu">
        <input type="search" name="q" placeholder="Search..." aria-label="Search">
        <button type="submit" aria-label="Submit search">
          <svg><!-- search icon --></svg>
        </button>
      </form>
    </div>
  </div>
  <div class="header-main">
    <a href="https://sci.utah.edu" class="sci-logo">
      <img src="images/logos/sci-logo.png" alt="Scientific Computing and Imaging Institute">
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Research</a></li>
        <li><a href="#">People</a></li>
        <li><a href="#">Publications</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
```

## Simplified Footer HTML

```html
<footer class="site-footer">
  <div class="footer-main">
    <div class="footer-brand">
      <img src="images/logos/sci-logo.png" alt="SCI Institute">
      <address>
        72 So. Central Campus Drive, Room 3750<br>
        Salt Lake City, UT 84112<br>
        <a href="tel:801-585-1867">801-585-1867</a>
      </address>
    </div>
    <div class="footer-links">
      <a href="https://www.utah.edu/nondiscrimination/">Nondiscrimination & Accessibility</a>
      <a href="https://www.utah.edu/disclaimer/">Disclaimer</a>
      <a href="https://www.utah.edu/privacy/">Privacy</a>
    </div>
    <div class="footer-social">
      <a href="https://twitter.com/UofU" aria-label="Twitter">X</a>
      <a href="https://www.facebook.com/universityofutah" aria-label="Facebook">FB</a>
      <a href="https://www.instagram.com/universityofutah/" aria-label="Instagram">IG</a>
      <a href="https://www.youtube.com/universityofutah" aria-label="YouTube">YT</a>
    </div>
  </div>
  <div class="footer-legal">
    <p>© 2026 THE UNIVERSITY OF UTAH</p>
  </div>
</footer>
```

## Notes

1. **SCI WordPress Theme**: The sci.utah.edu site uses a custom WordPress theme. The header/footer are rendered server-side via PHP templates, not available as static HTML files.

2. **University Template System**: There's a centralized template at `templates.utah.edu/_main-v3-1/` but it requires authentication/authorization.

3. **For Full Compliance**: Contact University Marketing & Communications (UMC) at brand.utah.edu for official template access, or use the simplified versions above that follow brand guidelines.
