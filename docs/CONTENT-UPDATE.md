# MULTI Research Group Website - Content Update Guide

This guide explains how to update website content **without touching any code**. All content is stored in data files in the `/data/` folder.

## Quick Reference

| To Update... | Edit This File |
|--------------|----------------|
| Group description | `data/group.json` |
| Team members | `data/team.json` |
| Publications | `data/publications.bib` |
| Team photos | `images/team/` folder |

## Before You Start

1. **Always make a backup** before editing any file
2. **Use a text editor** that shows syntax errors (VS Code, Sublime Text)
3. **Validate JSON files** at [jsonlint.com](https://jsonlint.com) before saving
4. **Test locally** by opening `index.html` in a browser

## Updating Group Description

**File:** `data/group.json`

```json
{
  "name": "MULTI Research Group",
  "fullName": "Machine learning, Uncertainty visualization, Large-scale visualization, Tensor visualization, and Inverse problem",
  "institution": "Scientific Computing and Imaging (SCI) Institute",
  "university": "University of Utah",
  "introduction": "Your intro paragraph here. Can include multiple sentences."
}
```

**To change the introduction:**
1. Open `data/group.json`
2. Find the `"introduction"` field
3. Replace the text inside the quotes
4. Save the file

**Note:** Keep text on one line. For a line break, use `\n`.

---

## Adding a Team Member

**File:** `data/team.json`

### Step 1: Prepare the Photo

1. Get a square photo (same width and height)
2. Resize to 400x400 pixels
3. Save as JPEG, under 100KB
4. Name it `firstname-lastname.jpg` (all lowercase)
5. Place in `images/team/` folder

### Step 2: Add the Entry

Open `data/team.json` and add a new entry to the `team` array:

```json
{
  "team": [
    {
      "id": "jane-doe",
      "name": "Jane Doe",
      "position": "PhD Student",
      "email": "jane.doe@utah.edu",
      "photo": "images/team/jane-doe.jpg",
      "background": "Jane joined the group in 2024 after completing her MS at MIT.",
      "researchInterests": ["Machine Learning", "Visualization"],
      "authorVariants": ["J. Doe", "Jane Doe", "J. A. Doe"]
    },
    // ... other team members
  ]
}
```

### Field Descriptions

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier, lowercase with hyphens | `"jane-doe"` |
| `name` | Display name | `"Jane Doe"` |
| `position` | Role in the group | `"PhD Student"` |
| `email` | Contact email | `"jane@utah.edu"` |
| `photo` | Path to photo file | `"images/team/jane-doe.jpg"` |
| `background` | 1-2 sentence bio | `"Jane joined in 2024..."` |
| `researchInterests` | Array of research areas | `["ML", "Viz"]` |
| `authorVariants` | Name variations in publications | `["J. Doe", "Jane Doe"]` |

### Important: Author Variants

The `authorVariants` field must include **all ways** the person's name appears in publications. Check existing publications for exact spelling:

```json
"authorVariants": ["C. R. Johnson", "Chris R. Johnson", "Chris Johnson"]
```

---

## Removing a Team Member

1. Open `data/team.json`
2. Find the team member's entry (search for their name)
3. Delete the entire entry including the curly braces `{ ... }`
4. Remove the comma before or after if needed
5. Optionally delete their photo from `images/team/`

**Example - Before:**
```json
{
  "team": [
    { "id": "john", "name": "John" },
    { "id": "jane", "name": "Jane" },
    { "id": "bob", "name": "Bob" }
  ]
}
```

**Example - After removing Jane:**
```json
{
  "team": [
    { "id": "john", "name": "John" },
    { "id": "bob", "name": "Bob" }
  ]
}
```

---

## Updating Team Member Information

1. Open `data/team.json`
2. Find the team member (Ctrl+F / Cmd+F to search)
3. Change the relevant field value
4. Save the file

**Common updates:**
- Change position: Edit `"position": "New Title"`
- Update email: Edit `"email": "new@utah.edu"`
- Add research interest: Add to the array `["Interest1", "Interest2", "New Interest"]`

---

## Adding Publications

**File:** `data/publications.bib`

Publications are stored in standard BibTeX format. The website parses this file directly.

### BibTeX Entry Format

```bibtex
@Article{SCI:Doe2025a,
  author =    "J. Doe and C. R. Johnson",
  title =     "A Great Paper Title",
  journal =   "IEEE Transactions on Visualization",
  year =      "2025",
  url =       "https://publications.sci.utah.edu/...",
  doi =       "10.1109/TVCG.2025.12345",
}
```

### Adding a Single Publication

1. Open `data/publications.bib`
2. Add the new entry at the **top** of the file (after any header comments)
3. Include all required fields

**Entry Types:**
- `@Article` - Journal papers
- `@InProceedings` - Conference papers
- `@Book` - Books
- `@InCollection` - Book chapters
- `@Misc` - Preprints, technical reports

**Required fields:**
- `author` - Authors separated by " and "
- `title` - Full title in quotes
- `year` - Publication year
- `journal` or `booktitle` - Venue name

**Optional fields:**
- `url` - Link to PDF
- `doi` - DOI identifier (without https://doi.org/)
- `volume`, `number`, `pages` - Journal details

### Author Name Format

**Critical:** Author names must match the `authorVariants` in `team.json` for filtering to work.

Standard format: `First Initial. Last Name` separated by ` and `

```bibtex
author = "C. R. Johnson and T. M. Athawale and J. Doe",
```

Examples:
- `C. R. Johnson` ✓
- `T. M. Athawale` ✓
- `Chris Johnson` (also valid, add to authorVariants in team.json)

---

## Removing a Publication

1. Open `data/publications.bib`
2. Find the publication (search by title or key)
3. Delete the entire entry from `@Type{` to the closing `}`
4. Save the file

---

## Common JSON Mistakes (group.json, team.json)

### Missing Comma

**Wrong:**
```json
{
  "name": "John"
  "email": "john@utah.edu"
}
```

**Correct:**
```json
{
  "name": "John",
  "email": "john@utah.edu"
}
```

### Trailing Comma

**Wrong:**
```json
{
  "team": [
    { "name": "John" },
    { "name": "Jane" },
  ]
}
```

**Correct:**
```json
{
  "team": [
    { "name": "John" },
    { "name": "Jane" }
  ]
}
```

### Missing Quotes

**Wrong:**
```json
{
  "year": "2025",
  name: "John"
}
```

**Correct:**
```json
{
  "year": 2025,
  "name": "John"
}
```

Note: Numbers don't need quotes, but strings do.

---

## Common BibTeX Mistakes (publications.bib)

### Missing Closing Brace

**Wrong:**
```bibtex
@Article{Key2025,
  author = "J. Doe",
  title = "Paper Title",
  year = "2025",

```

**Correct:**
```bibtex
@Article{Key2025,
  author = "J. Doe",
  title = "Paper Title",
  year = "2025",
}
```

### Missing Quotes Around Values

**Wrong:**
```bibtex
  title = Paper Title,
```

**Correct:**
```bibtex
  title = "Paper Title",
```

### Incorrect Author Separator

**Wrong:**
```bibtex
  author = "J. Doe, C. R. Johnson",
```

**Correct:**
```bibtex
  author = "J. Doe and C. R. Johnson",
```

Authors must be separated by ` and ` (with spaces), not commas.

---

## Validation Steps

After any edit:

1. **For JSON files (group.json, team.json):**
   - Go to [jsonlint.com](https://jsonlint.com)
   - Paste your file contents
   - Click "Validate JSON"
   - Fix any errors reported

2. **For BibTeX (publications.bib):**
   - Ensure every `@Type{` has a matching closing `}`
   - Check that all field values are in quotes
   - Verify authors are separated by ` and `

3. **Test locally:**
   - Open `index.html` in Chrome or Firefox
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Verify your changes appear correctly

4. **Test filtering:**
   - Click on team member cards
   - Verify publications filter correctly
   - Check that new members show their publications

---

## Deployment

After making changes:

1. Upload changed files to web server
2. Clear browser cache (Ctrl+Shift+R) to see changes
3. Verify on live site

---

## Getting Help

If validation fails and you can't find the error:

1. Use VS Code - it highlights JSON and BibTeX errors
2. Compare your file to a working backup
3. Check for the common mistakes listed above
4. For BibTeX, try an online validator like [bibtex.online](https://bibtex.online/)
