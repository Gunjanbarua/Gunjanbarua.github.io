# gunjanbarua.github.io

Single-page personal site built with Eleventy (Nunjucks), plain CSS and vanilla JS. Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.

```bash
npm install
npm start        # local preview at http://localhost:8080
npm run build    # outputs to _site/
```

## Structure

- `src/index.njk` — the home page; includes one partial per section from `src/_includes/sections/`.
- `src/_includes/base.njk` — layout: head/SEO, side rail, mobile menu, footer, lightbox.
- `src/updates-page.njk` — `/updates/` archive (content from `src/content/updates.md`).
- `src/css/style.css` — design tokens ("Urban slate") at the top, then section styles.
- `src/js/main.js` — active-section highlight, mobile menu, show-all toggles, lightbox.

## Editing content (`src/_data/`)

| File | What it controls |
|---|---|
| `site.json` | Title, description, links, feature flags |
| `nav.json` | Side-rail / menu items (items with `feature` appear only when that flag is true) |
| `pillars.json` | The three focus cards |
| `work.json` | The four case studies |
| `experience.json` | Recent roles, earlier career, education, skills |
| `publications.json` | Publications (array order = display order) |
| `talks.json`, `awards.json` | Talks and awards (array order = display order) |
| `gallery.json` | Gallery images |

Items with `"featured": true` show by default; the rest sit behind the "Show all" buttons.

### Add a publication

Add an object to `publications.json` in the right place (published newest first, then in review):

```json
{ "title": "...", "authors": "Barua, G., ...", "venue": "Journal", "year": 2026,
  "status": "Published", "url": "https://doi.org/...", "featured": false }
```

`status` is `Published` or `In Review`. "Barua, G." is bolded automatically.

### Add gallery photos

1. Put the file in `src/images/gallery/`.
2. Add an entry to `gallery.json` with `src`, `width`, `height` (pixels), `alt`, `caption`, `year`, `featured`, `order`.

### Updates archive

Edit `src/content/updates.md` (front matter list; newest sorted first automatically).

## Writing section (hidden by default)

1. In `src/_data/site.json` set `"features": { "writing": true }`.
2. Add posts as markdown files in `src/posts/` with front matter `title`, `date`, `summary`, `tags`. The three latest appear as summary cards between Work and Experience.
3. Delete `src/posts/example-post.md` (a placeholder) before switching it on.

With the flag `false`, no nav item, section or empty state is rendered.
