// SPDX-License-Identifier: Apache-2.0
import {usePluginData} from '@docusaurus/useGlobalData';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import type {PropBlogPostContent} from '@docusaurus/plugin-content-blog';
import type {BlogPostSummary, BlogPostsData} from './types';
import {getPostCategoryKey} from './categoryList';

export function useBlogPostsData(): BlogPostsData {
  return (
    (usePluginData('blog-posts-data') as BlogPostsData | undefined) ?? {
      basePath: '/blog',
      title: 'Blog',
      posts: [],
      tags: [],
    }
  );
}

/** "24 Nov 2026" */
export function useFormatBlogDate(): (date: string) => string {
  const format = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // Day first, no comma, as on the IBM Research blog: "26 Aug 2021".
  return (date) => {
    const parts = format.formatToParts(new Date(date));
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? '';
    return `${part('day')} ${part('month')} ${part('year')}`;
  };
}

export function summarizeBlogPost(
  content: PropBlogPostContent,
): BlogPostSummary {
  const {metadata, frontMatter, assets} = content;
  return {
    permalink: metadata.permalink,
    title: metadata.title,
    description: metadata.description,
    date: metadata.date as unknown as string,
    readingTime: metadata.readingTime,
    category: getPostCategoryKey(frontMatter),
    image: assets.image ?? frontMatter.image,
    tags: metadata.tags.map(({label, permalink}) => ({label, permalink})),
    authors: metadata.authors.map(({name}) => name ?? '').filter(Boolean),
  };
}

/**
 * Posts related to `current`: shared tags count most, then the same category,
 * then recency (posts are newest first).
 */
export function getRelatedPosts(
  posts: BlogPostSummary[],
  current: {
    permalink: string;
    category?: string;
    tags: {permalink: string}[];
  },
  count = 3,
): BlogPostSummary[] {
  const tagSet = new Set(current.tags.map((t) => t.permalink));
  return posts
    .filter((post) => post.permalink !== current.permalink)
    .map((post, index) => ({
      post,
      index,
      score:
        2 * post.tags.filter((t) => tagSet.has(t.permalink)).length +
        (current.category && post.category === current.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(({post}) => post);
}

/** Small, stable string hash (FNV-1a) used to seed generated artwork. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
