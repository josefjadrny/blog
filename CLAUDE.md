# Josef Jadrny's personal page

One-page personal site for https://www.josefjadrny.info, in English and Czech. Plain static HTML, CSS and JS:
no build step, no dependencies, no framework. Keep it that way - the motto is "I ❤ simple code".

## Layout

- `src/index.html` - English page (`/`)
- `src/cs/index.html` - Czech page (`/cs/`), the same markup with translated text
- `src/files/styles.css`, `src/files/scripts.js` - shared by both pages
- `src/files/` - fonts, favicon, hero photo/video, project logos
- `src/sitemap.xml`, `src/robots.txt` - list both language versions
- `.github/workflows/production.yml` - every push to `master` runs `aws s3 sync src` to S3 (static website hosting behind Cloudflare). What is in `src/` is exactly what goes live.

## Two languages - always change both

Every change to page content or markup goes into **both** `src/index.html` and `src/cs/index.html`, in the same commit.
The two files must stay identical apart from:

- text, `aria-label`s, `<html lang>`, meta description/og tags, canonical and `og:url`
- asset paths: `files/...` in English, `../files/...` in Czech
- the language switch link (`CZ` → `/cs/` on the English page, `EN` → `/` on the Czech page)
- the head script: only the English page has the browser-language redirect

To check the two are still in sync, compare their structure, e.g. `diff <(sed 's/>[^<]*</></g' src/index.html) <(sed 's/>[^<]*</></g' src/cs/index.html)`.

Josef sometimes edits `src/index.html` directly on GitHub. Pull before starting, and if the English page changed without the Czech one, bring the Czech page up to date.

### Czech text

- Natural Czech, formal "vy" towards the reader (`Napište mi`), first person for Josef.
- Keep job titles (`Senior Software Engineer`, `Head of Development`), tech names and the skill/tech chips in English, as Czech IT does.
- Months are lowercase (`květen 2021 - současnost`).
- The 360° review quotes in the Feedback section stay in the original English on both pages (`<blockquote lang="en">` on the Czech page). Never translate or reword them; cuts are marked with `[&hellip;]`.

## SEO - keep Google able to index both versions

- Each page has its own canonical, plus `hreflang` alternates for `en`, `cs` and `x-default` (= English). Keep these and `sitemap.xml` in step if URLs ever change.
- The redirect (inline script in the English `<head>`) sends Czech/Slovak browsers from `/` to `/cs/` once, unless the visitor already chose a language with the switch (`localStorage.lang`, set in `scripts.js`) or is a crawler. It only goes English → Czech. Never add a redirect to the Czech page: Googlebot crawls with an English browser and would be sent away from `/cs/`.

## Conventions

- After changing `styles.css` or `scripts.js`, bump its `?v=` number in both HTML files so Cloudflare and browsers fetch the new file.
- Scripts are plain ES5-style JS in one IIFE (`var`, `function`), no libraries. Wrap `localStorage` in try/catch.
- Colours and sizes come from the CSS variables in `:root`. The site is dark-only.
- Text uses a spaced hyphen ` - ` as a dash, not an em dash. Keep the copy short and plain.
- Commit messages are one plain sentence saying what changed for the visitor, e.g. "Add a Feedback section with quotes from my Pipedrive 360° reviews".

## Checking a change

Serve `src/` and look at both pages, on desktop and at phone width (375px), with no horizontal scroll:

```
cd src && python3 -m http.server 8765
# http://localhost:8765/ and http://localhost:8765/cs/
```

Elements with `.reveal` fade in on scroll, so a full-page screenshot may show them hidden; add `is-visible` to them first.
