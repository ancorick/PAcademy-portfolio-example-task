# Portfolio site

A static, multi-file personal portfolio. Plain HTML, CSS and JavaScript: no framework, no build step, no dependencies. All content lives in the HTML; `js/main.js` only adds the theme toggle and the mobile menu, and the site works fully without it.

**Status: all personal facts are `TODO` placeholders.** Every missing fact is marked with a visible dashed highlight (`class="todo"`) so nothing invented can slip onto the live site. See [Fill in the TODOs](#fill-in-the-todos).

The site answers three questions, in this order:

1. **Who is this and what do they do?** The first screen on Home.
2. **Can they actually do it?** Project cards and case studies (Problem → Approach → Outcome).
3. **How do I reach them?** A Contact link in the header and an email and profile links in the footer, on every page.

If something does not serve one of those three questions, it does not belong on the site.

## Run locally

Any static file server works. From this folder:

```bash
python -m http.server 8000      # then open http://localhost:8000
# or
npx serve .
```

Opening `index.html` straight from disk also works for Home and the case studies. The 404 page uses root-absolute paths (see [Deploy](#deploy)), so view it at `http://localhost:8000/404.html`. Note that Python's simple server shows its own error page for unknown URLs; real hosts serve `404.html`.

## Files

```
index.html              Home: hero, selected work, experience, contact
404.html                Not-found page, links back to Home and Work
work/_template.html     Copy this to add a project (noindex, never published as-is)
work/<slug>.html        One case study per project
css/tokens.css          ALL colors, fonts, type scale, spacing. Restyle here.
css/base.css            Element defaults, typography, focus styles, .todo marker
css/layout.css          Page grid and section spacing
css/components.css      Header, nav, buttons, cards, footer
js/main.js              Theme toggle and mobile menu. Nothing else uses JS.
assets/favicon.svg      Browser-tab icon
assets/fonts/           Self-hosted fonts and their licenses
assets/img/             Images used in pages (currently a screenshot placeholder)
assets/og/              Open Graph preview images, 1200x630 PNG, one per page
```

Each change has one obvious place: colors and fonts in `tokens.css`, spacing and grid in `layout.css`, a component's look in `components.css`.

## Fill in the TODOs

List every remaining placeholder:

```bash
grep -rn "TODO" --include="*.html" --include="*.css" .
```

What to supply, by file:

| Where | What |
| --- | --- |
| Every page | Your name (header, footer, `<title>`, Open Graph tags), email, profile links |
| `index.html` hero | One-line positioning (this is the `h1`), short bio |
| `index.html` Selected work | Per project: one-line outcome with a number, title, year, role |
| `index.html` Experience | Per job: dates, role, company, one achievement |
| `index.html` Contact | One sentence on what to get in touch about |
| `work/project-*.html` | Title, outcome, year, role, stack, links, Problem, Approach, Outcome numbers, screenshot |
| `assets/cv.pdf` | Your CV. Linked from Contact and every footer. Until you add it, the link 404s. |
| `assets/og/*.png` | Real preview images, see [Social previews](#social-previews) |
| All pages | Replace `TODO-your-domain.example` with your real domain (canonical and Open Graph URLs must be absolute) |

Rules that keep the site credible:

- Use only facts you can stand behind. If you cannot support a claim or a number, delete the line instead of rounding it up.
- Replace a whole `<span class="todo">…</span>` with plain text, not just the words inside it, so the highlight goes away.
- When no `TODO` is left, delete the `.todo` rule at the bottom of `css/base.css`.
- Placeholder email is `TODO@example.com`. Search for it and replace it everywhere (it is in `mailto:` links as well as visible text).

## Add a project

1. Copy the template and name it after the project (lowercase, hyphens):

   ```bash
   cp work/_template.html work/checkout-redesign.html
   ```

2. In the new file:
   - Replace `TODO-slug` with `checkout-redesign` (canonical URL, `og:url`, `og:image`).
   - Replace `TODO-next-slug` with the slug of the project that should come next, or remove that paragraph if there is none.
   - Fill in every `TODO`. Keep the order **Problem → Approach → Outcome**.
   - Delete the instruction comment at the top and the `<meta name="robots" content="noindex">` line.
3. Add a screenshot to `assets/img/`. Keep `width` and `height` on the `<img>` (prevents layout shift), keep `loading="lazy"`, and write real `alt` text. Prefer AVIF or WebP with a fallback; the template has a `<picture>` example in a comment.
4. Add a 1200x630 preview image as `assets/og/checkout-redesign.png`.
5. In `index.html`, add a card to the `work-grid` list (copy an existing `<li class="card">`) and link it to `work/checkout-redesign.html`. Keep the outcome first: it is what proves ability.
6. Make the previous project's "Next project" link point to the new page if you want it in the chain.

Three to four projects read best. A weak project hurts more than a missing one, so remove it rather than keep filler.

## Restyle

Everything visual is a variable in `css/tokens.css`:

- **Colors:** one accent and a few neutrals, defined once as `light-dark(<light>, <dark>)`. Text and background pairs meet WCAG AA contrast (4.5:1); control outlines meet 3:1. If you change a color, check the pair again, for example with the WebAIM contrast checker.
- **Fonts:** Space Grotesk (display) and Inter (text), self-hosted as variable WOFF2 in `assets/fonts/`, both under the SIL Open Font License (license files included). To change them, put new `.woff2` files in `assets/fonts/`, update the two `@font-face` blocks and `--font-display` / `--font-text` in `tokens.css`, and update the two `<link rel="preload">` lines in each HTML file. The shipped files cover the Latin alphabet only; for other scripts add a matching subset.
- **Theme:** follows the system setting. The toggle in the header overrides it and remembers the choice in `localStorage`.
- **Motion:** only hover, focus and menu-open transitions, and none at all under `prefers-reduced-motion`.

## Social previews

Each page has its own `<title>`, description and Open Graph image. The current images in `assets/og/` are placeholders showing the page title.

- Size: 1200x630. Format: PNG or JPG (messengers and social networks do not reliably render AVIF, WebP or SVG here).
- Name each file after its page: `home.png`, `<slug>.png`, `404.png`.
- After deploying, check how a link looks with the preview tools of the platforms you care about (LinkedIn Post Inspector, the Telegram or WhatsApp link preview, and so on). Platforms cache previews, so check before you share the link widely.

## Deploy

It is a folder of static files. There is nothing to build: publish the repository root.

**Netlify or Cloudflare Pages:** connect the repository (or drag the folder in). Leave the build command empty and set the publish directory to the repository root. `404.html` is served automatically for unknown URLs.

**GitHub Pages:** push to a repository, then Settings → Pages → deploy from the `main` branch, root folder.

- A user site (`<user>.github.io`) or a custom domain serves from the domain root, so everything works as is.
- A project site (`<user>.github.io/<repo>/`) serves from a sub-folder. Every page except `404.html` uses relative paths and keeps working. `404.html` uses root-absolute paths (`/css/...`) because a host serves it at any broken URL, so in a sub-folder prefix them with `/<repo>`, or use a custom domain.

Before you announce the site:

- [ ] No `TODO` left: `grep -rn "TODO" .` prints nothing
- [ ] Real domain in canonical and Open Graph URLs
- [ ] `assets/cv.pdf` exists
- [ ] Real preview images in `assets/og/`
- [ ] `work/_template.html` still has `noindex` (it must never be indexed)
- [ ] Lighthouse (Chrome DevTools → Lighthouse, mobile) scores 95+ on every page
- [ ] Keyboard check: Tab through each page, focus is always visible, the menu works, Escape closes it
- [ ] Open the live link on your phone, in both light and dark mode

Optional once the domain is known: add `robots.txt` and `sitemap.xml` at the root so search engines find every case study.

## Accessibility and performance notes

- Landmarks (`header`, `nav`, `main`, `footer`), exactly one `h1` per page, a skip link, visible focus on every control, 44px touch targets.
- Content is in the HTML. Without JavaScript, the nav is a plain row of links and the theme follows the system.
- The header is not sticky, so focused elements are never hidden under it.
- Fonts are preloaded and use `font-display: swap`. Images need explicit `width` and `height`, and `loading="lazy"` below the fold.
