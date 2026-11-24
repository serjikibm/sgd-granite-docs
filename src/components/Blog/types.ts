// SPDX-License-Identifier: Apache-2.0
export type BlogTagSummary = {
  label: string;
  permalink: string;
};

/** What a blog card needs to render; built from list items or global data. */
export type BlogPostSummary = {
  permalink: string;
  title: string;
  description: string;
  /** ISO date string. */
  date: string;
  readingTime?: number;
  /** Category key from src/components/Blog/categoryList.ts, e.g. "models". */
  category?: string;
  image?: string;
  tags: BlogTagSummary[];
  authors: string[];
};

export type BlogPostsData = {
  /** Blog index route, e.g. "/blog". */
  basePath: string;
  title: string;
  posts: BlogPostSummary[];
  tags: (BlogTagSummary & {count: number})[];
};

/**
 * Pagination of a category page; same shape as the blog plugin's list page
 * metadata, so BlogListPaginator can render it.
 */
export type BlogCategoryPageMetadata = {
  permalink: string;
  page: number;
  postsPerPage: number;
  totalCount: number;
  totalPages: number;
  previousPage?: string;
  nextPage?: string;
  blogTitle: string;
  blogDescription: string;
};
