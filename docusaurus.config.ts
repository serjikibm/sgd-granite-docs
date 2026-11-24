// SPDX-License-Identifier: Apache-2.0
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as RedirectOptions} from '@docusaurus/plugin-client-redirects';
import redirects from './redirects';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The base URL and site URL come from the environment so the same build works
// for production and for forks. The CI workflow (.github/workflows/docs-publish.yml)
// sets them:
//   Upstream (ibm-granite/docs): /granite/docs/ on https://www.ibm.com, which the
//     ibm.com proxy serves at www.ibm.com/granite/docs/.
//   Forks: /<repo-name>/granite/docs/ on https://<owner>.github.io, for previews.
// Locally, the defaults below serve the site at http://localhost:3000/granite/docs/.
const BASE_URL: string = process.env.DOCS_BASE_URL ?? '/granite/docs/';
const SITE_URL: string = process.env.DOCS_SITE_URL ?? 'https://ibm-granite.github.io';

const config: Config = {
  title: 'IBM Granite',
  tagline: 'Documentation for Granite models, tools, and tutorials',
  favicon: 'img/granite-pictogram.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: SITE_URL,
  baseUrl: BASE_URL,
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs are served from the site root: /granite/docs/models/...
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: {
          blogTitle: 'Granite Blog',
          blogDescription:
            'News, releases, and deep dives from the IBM Granite team.',
          showReadingTime: true,
          // Blog pages render their own navigation (topics, related posts).
          blogSidebarCount: 0,
          // One featured post plus four rows of three cards.
          postsPerPage: 13,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['**/search'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Post summaries as global data (related posts, category nav) and the
    // paginated /blog/<category> pages.
    ['./src/plugins/blogPostsData.ts', {categoryPostsPerPage: 12}],
    // Redirects for moved and removed URLs. Edit them in redirects.ts.
    [
      '@docusaurus/plugin-client-redirects',
      {redirects} satisfies RedirectOptions,
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: false,
        docsRouteBasePath: ['/'],
        blogRouteBasePath: ['/blog'],
        language: ['en'],
        explicitSearchResultPath: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  // IBM Analytics. The script only runs on *.ibm.com hostnames.
  scripts: [{src: `${BASE_URL}analytics.js`, async: true}],

  themeConfig: {
    // Social card (1200×630) for link previews.
    image: 'img/granite-social-card.png',
    metadata: [
      {name: 'keywords', content: 'IBM Granite, AI, foundation models, LLM'},
      {
        name: 'description',
        content:
          'IBM Granite documentation: models, tools, tutorials, and the Granite blog',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      // Shown as "IBM **Granite Docs**": the regular-weight "IBM" prefix is
      // added in src/css/custom.css (.navbar__title::before).
      title: 'Granite Docs',
      items: [
        {
          to: '/models',
          // Stays highlighted on every page under /models
          activeBasePath: '/models',
          label: 'Models',
          position: 'left',
        },
        {
          to: '/tools',
          activeBasePath: '/tools',
          label: 'Tools',
          position: 'left',
        },
        {
          to: '/tutorials',
          activeBasePath: '/tutorials',
          label: 'Tutorials',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://www.ibm.com/granite/playground',
          label: 'Playground',
          position: 'right',
        },
        {
          href: 'https://github.com/ibm-granite',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'IBM',
        src: 'img/landing/ibm-logo.svg',
        href: 'https://www.ibm.com',
        width: 128,
        height: 65,
      },
      links: [
        {
          title: 'Contact Info',
          // Same URLs as the previous production footer, including IBM's
          // footer tracking parameters (lnk=...).
          items: [
            {label: 'Contact', href: 'https://www.ibm.com/contact/global'},
            {label: 'Privacy', href: 'https://www.ibm.com/us-en/privacy'},
            {label: 'Terms of use', href: 'https://www.ibm.com/legal?lnk=flg-tous-usen'},
            {label: 'Accessibility', href: 'https://www.ibm.com/able/?lnk=flg-acce-usen'},
            {label: 'Cookies', href: 'https://www.ibm.com/privacy#cookies'},
          ],
        },
        {
          title: 'Learn More',
          // The Figma design shows Stack Overflow, Discord, and X, but Granite
          // has no official channels there; these are the official ones.
          items: [
            {label: 'IBM Granite', href: 'https://www.ibm.com/granite'},
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/orgs/ibm-granite/discussions',
            },
            {
              label: 'Hugging Face',
              href: 'https://huggingface.co/ibm-granite',
            },
            {
              // Latest Granite generation on Ollama; update on each release.
              label: 'Ollama',
              href: 'https://ollama.com/library/granite4.2',
            },
            {
              label: 'Granite Community',
              href: 'https://github.com/ibm-granite-community',
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
