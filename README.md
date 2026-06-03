# EBCI Work Timeline Repo

This repository holds the new `/suriya-ebci-work` report page for ebcinext.com.

## What is included

- `index.html` - simple repo landing page
- `suriya-ebci-work/` - the report page and its data
- `suriya-ebci-work/data.js` - structured timeline content
- `suriya-ebci-work/styles.css` - the maroon/gold visual theme

## Run locally

```bash
npm run dev
```

Then open:

- `http://localhost:4173/`
- `http://localhost:4173/suriya-ebci-work/`

## Build WordPress/HTML content

If this page ever needs to be pasted into a WordPress HTML block, generate a single bundled HTML file with:

```bash
npm run build:wp
```

The generated file is `suriya-ebci-work/wordpress-content.html`.

## Current live deployment

The current production page is deployed as static files under:

- `https://ebcinext.com/suriya-ebci-work/`

The files uploaded to the host are:

- `suriya-ebci-work/index.html`
- `suriya-ebci-work/styles.css`
- `suriya-ebci-work/data.js`

## Sources used

- `claude-ebci-timeline.html`
- `gemini_ebci_work_timeline_cleaned.html`
- `gptreport1 preview.html`
- `ebci-day-by-day-report.html`
