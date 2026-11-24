# IBM Granite Documentation

Source for the IBM Granite documentation site and blog at **https://www.ibm.com/granite/docs**. The site is built with [Docusaurus 3](https://docusaurus.io/), styled with the [IBM Carbon Design System](https://carbondesignsystem.com/) (White and Gray 100 themes), and published through GitHub Pages.

Every merge to `main` triggers CI, which builds the site and deploys it. There is no staging branch or versioning: `main` is always the live site.

---

## Repository layout

| Path | What's there |
| ---- | ------------ |
| `docs/` | Docs pages: `models/`, `tools/`, `tutorials/` |
| `blog/` | Blog posts, plus `authors.yml` and `tags.yml` |
| `data/` | Model catalog data used to generate parts of the Models docs |
| `scripts/generate-models.mjs` | Generates `docs/models/_generated/` from `data/` |
| `src/pages/index.tsx` | Landing page |
| `src/css/custom.css` | Carbon look and feel for Docusaurus (tokens, header, search, side nav, tables, footer) |
| `src/components/` | Landing page artwork and the blog components (`Blog/`) |
| `src/theme/` | Swizzled Docusaurus theme components (footer and all blog pages) |
| `src/plugins/blogPostsData.ts` | Blog plugin: post summaries as global data, and the category pages |
| `static/` | Images, the IBM Analytics script (`analytics.js`), and `robots.txt` |
| `redirects.ts` | Redirects for moved and removed URLs |
| `sidebars.ts` | Sidebar, generated from the `docs/` folder structure |
| `docusaurus.config.ts` | Site configuration |
| `.github/workflows/docs-publish.yml` | CI: build, checks, and deploy |

---

## Local development

Requires Node.js 20 or later. CI uses Node.js 24.

```bash
npm install
npm start          # dev server with live reload
npm run build      # static site in build/
npm run serve      # serve the build/ output locally
npm run typecheck  # TypeScript check
npm run clear      # clear the Docusaurus build cache
```

The site is served at **http://localhost:3000/granite/docs/**.

`start` and `build` run `npm run models:generate` first (see [Model data](#model-data)).

---

## Base URL and deployment

The site is served at `/granite/docs/` on www.ibm.com. The ibm.com proxy forwards `www.ibm.com/granite/docs/*` to GitHub Pages, so the base URL isn't hardcoded. `docusaurus.config.ts` reads it from two environment variables, which the CI workflow sets:

| Repository | `DOCS_BASE_URL` | `DOCS_SITE_URL` | Site |
| ---------- | --------------- | --------------- | ---- |
| `ibm-granite/docs` (production) | `/granite/docs/` | `https://www.ibm.com` | https://www.ibm.com/granite/docs/ |
| A fork, for example `<user>/<repo>` | `/<repo>/granite/docs/` | `https://<user>.github.io` | `https://<user>.github.io/<repo>/granite/docs/` |

Without the variables, the defaults are `/granite/docs/` and `https://ibm-granite.github.io`.

The deploy job copies the build into `granite/docs/` on the `gh-pages` branch. That way GitHub Pages serves every page and asset under the same `/granite/docs/` path that the proxy uses. For production, the direct `ibm-granite.github.io` URL doesn't work; use www.ibm.com/granite/docs/.

**Preview from a fork:** in the fork's settings, set GitHub Pages to deploy from the `gh-pages` branch. Then push to the fork's `main`. The workflow deploys to `https://<user>.github.io/<repo>/granite/docs/`.

**Building locally with a different base URL:** the build cache keeps links from the previous base URL. Run `npm run clear` first:

```bash
npm run clear
DOCS_BASE_URL=/<repo>/granite/docs/ DOCS_SITE_URL=https://<user>.github.io npm run build
```

IBM Analytics (`static/analytics.js`) only runs on `*.ibm.com` hostnames, so local and fork builds don't send analytics.

---

## Redirects

When a page moves or is removed, add a redirect to `redirects.ts`:

```ts
{from: '/old/path', to: '/new/path'},
{from: ['/old/a', '/old/b'], to: '/new/path'},
```

Paths are relative to the base URL and have no trailing slash. The build fails if `to` isn't an existing page, or if `from` is a page that still exists.

These redirects are client-side pages that forward to the new URL. They aren't HTTP 301 responses.

---

## Writing docs

Docs live in `docs/` as `.mdx` files. The sidebar is generated from the folder structure:

- Each folder's `_category_.json` sets its sidebar label and position.
- Each page's `sidebar_position` sets its order within the folder.
- A new page appears in the sidebar automatically.

Every page needs at least:

```mdx
---
title: My page
description: One sentence describing what this page covers.
---
```

| Optional field | Purpose |
| -------------- | ------- |
| `sidebar_label` | Sidebar name, if different from `title` |
| `sidebar_position` | Order within the folder |

For callouts, use Docusaurus admonitions:

```mdx
:::note
This is a note.
:::

:::warning
This is a warning.
:::
```

Link to other pages by file path, for example `[Verify model signatures](../trust/verify-signatures.mdx)`. The build fails on broken links and anchors.

---

## Model data

Parts of the Models docs are generated from JSON files in `data/`:

- `models.json` and `model-sources.json` are owned upstream by the model selector. Update them with `npm run models:sync` (set `MODEL_DATA_DIR` if the model selector checkout isn't at the default path).
- `docs-overlay.json` holds docs-only data, such as Hugging Face collections and signing methods.

`npm run models:generate` writes the MDX partials to `docs/models/_generated/`. Don't edit those files by hand. The folder isn't committed; it's generated on every `start` and `build`.

---

## Writing blog posts

Posts live in `blog/` as `YYYY-MM-DD-<name>.mdx`, or as a `YYYY-MM-DD-<name>/index.mdx` folder to keep images next to the post. The blog is at `/blog`.

```mdx
---
slug: llmon-preview
title: 'LLMON: teaching Granite to tell instructions from data'
description: One or two sentences, shown on cards and as the post's subtitle.
category: models
authors: [granite-team]
tags: [llmon, language]
image: ./cover.png
---

Opening paragraph, shown in feeds and previews.

{/*truncate*/}

The rest of the post.
```

| Field | Notes |
| ----- | ----- |
| `slug` | Short URL, `/blog/<slug>`. Without it the URL is date based (`/blog/2026/11/12/...`). Don't use a category key (`models`, `tools`, `community`) as a slug. |
| `description` | Shown on cards and as the subtitle on the post page. Without it, cards fall back to the start of the post and the post has no subtitle. |
| `category` | Required, exactly one: `models`, `tools`, or `community`. The build warns when it's missing or unknown. |
| `authors` | Keys from `blog/authors.yml`. |
| `tags` | Keys from `blog/tags.yml`. Tags are free form and not tied to a category; add new ones to `tags.yml` (the build warns about tags that aren't listed). |
| `image` | Optional cover image. Without one, the post gets generated honeycomb artwork in its category's color. |

Also:

- Put a `{/*truncate*/}` comment after the opening paragraph. Write it without spaces inside, because markdownlint misreads `{/* truncate */}`.
- Link to other posts by file path, for example `[LLMON](./2026-11-12-llmon-preview.mdx)`, so links keep working if a slug changes.
- Headings (`##`, `###`) build the post's "On this page" list.

### Blog structure

- **Index** (`/blog`): the newest post as a featured card, then a card grid, 13 posts per page.
- **Categories** (`/blog/models`, `/blog/tools`, `/blog/community`): 12 posts per page (`categoryPostsPerPage` in `docusaurus.config.ts`). Categories are defined in `src/components/Blog/categoryList.ts`; adding an entry there adds its page.
- **Tags** (`/blog/tags`, `/blog/tags/<tag>`), **authors** (`/blog/authors`), and **archive** (`/blog/archive`).
- **Feeds:** `/blog/rss.xml` and `/blog/atom.xml`.
- The landing page's "Recent Articles" lists the three newest posts.

---

## CI checks

On every pull request and push to `main`, `.github/workflows/docs-publish.yml` runs:

| Check | Blocks the build? |
| ----- | ----------------- |
| `npm run typecheck` | Yes |
| `npm run build`, which fails on broken links, broken anchors, duplicate routes, and invalid redirects | Yes |
| markdownlint on `docs/` and `blog/` (rules in `docs/.markdownlint.json`) | No |
| codespell on `docs/` and `blog/` | No |

An external link check (lychee) runs weekly and on manual dispatch. A push to `main` also deploys the site.

---

## Contributing

To report a problem or suggest a change, open an issue. To propose a change directly, open a pull request:

1. Create a branch: `git checkout -b feature/my-change`
2. Make your changes, and test them locally with `npm start` and `npm run build`.
3. Open a pull request against `main`.

Pull requests need at least one maintainer approval and a passing CI build before they're merged.

---

## License

[Apache License 2.0](LICENSE)
