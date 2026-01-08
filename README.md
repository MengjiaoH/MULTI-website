# MULTI Research Group Website

Website for the MULTI (Machine learning, Uncertainty visualization, Large-scale visualization, Tensor visualization, and Inverse problem) research group at the SCI Institute, University of Utah.

## Quick Start

1. Open `index.html` in a browser
2. No build step required

## Project Structure

```
/multi-website/
├── index.html          # Single-page website
├── css/                # Stylesheets
├── js/                 # JavaScript
├── data/               # JSON content files (edit these to update content)
├── images/             # Team photos and logos
└── docs/               # Documentation
```

## Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [DESIGN.md](docs/DESIGN.md) | Architecture, data schemas, page sections | Developers |
| [REQUIREMENTS.md](docs/REQUIREMENTS.md) | Functional requirements, brand constraints | Developers, Stakeholders |
| [IMPLEMENTATION.md](docs/IMPLEMENTATION.md) | Tech stack, code patterns, JavaScript structure | Developers |
| [CONTENT-UPDATE.md](docs/CONTENT-UPDATE.md) | How to add/edit team members and publications | Content Maintainers |
| [STYLE-GUIDE.md](docs/STYLE-GUIDE.md) | CSS variables, layout changes, visual customization | Developers, Designers |

## Common Tasks

| Task | Guide |
|------|-------|
| Add a team member | [CONTENT-UPDATE.md](docs/CONTENT-UPDATE.md#adding-a-team-member) |
| Add publications | [CONTENT-UPDATE.md](docs/CONTENT-UPDATE.md#adding-publications) |
| Change colors/fonts | [STYLE-GUIDE.md](docs/STYLE-GUIDE.md#quick-style-changes) |
| Understand the architecture | [DESIGN.md](docs/DESIGN.md#design-philosophy) |

## Tech Stack

- HTML5, CSS3, jQuery 3.7+
- No build tools, no frameworks
- See [IMPLEMENTATION.md](docs/IMPLEMENTATION.md) for details

## Data Files

Content is separated from code. Edit these files to update the website:

| File | Content |
|------|---------|
| `data/group.json` | Group name and introduction |
| `data/team.json` | Team member profiles |
| `data/publications.bib` | Publications (BibTeX format) |

See [CONTENT-UPDATE.md](docs/CONTENT-UPDATE.md) for editing instructions.
