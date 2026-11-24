// SPDX-License-Identifier: Apache-2.0
/**
 * Blog categories. Every post sets exactly one with `category: <key>` in its
 * front matter; each category gets a page at /blog/<key>.
 *
 * Plain data with no imports: also read by src/plugins/blogPostsData.ts
 * at build time.
 */
export type BlogCategory = {
  key: string;
  label: string;
  description: string;
  /** Carbon color family, see categories.ts */
  hue: 'blue' | 'purple' | 'teal' | 'cyan' | 'magenta' | 'green';
};

export const blogCategories: BlogCategory[] = [
  {
    key: 'models',
    label: 'Models',
    description:
      'Releases, benchmarks, and deep dives on Granite model families.',
    hue: 'blue',
  },
  {
    key: 'tools',
    label: 'Tools',
    description:
      'What is new in Granite tools such as Granite.build, Granite.mem, and Granite.loop.',
    hue: 'teal',
  },
  {
    key: 'community',
    label: 'Community',
    description:
      'Updates, decisions, and events from the Granite team and community.',
    hue: 'purple',
  },
];

/**
 * The category key for a post's front matter, matching keys or labels
 * case-insensitively. Undefined when missing or unknown.
 */
export function getPostCategoryKey(frontMatter: object): string | undefined {
  const {category} = frontMatter as {category?: unknown};
  if (typeof category !== 'string') {
    return undefined;
  }
  const value = category.trim().toLowerCase();
  return blogCategories.find(
    (c) => c.key === value || c.label.toLowerCase() === value,
  )?.key;
}
