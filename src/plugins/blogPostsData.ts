// SPDX-License-Identifier: Apache-2.0
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {BlogContent} from '@docusaurus/plugin-content-blog';
import logger from '@docusaurus/logger';
import type {
  BlogCategoryPageMetadata,
  BlogPostSummary,
  BlogPostsData,
} from '../components/Blog/types';
import {
  blogCategories,
  getPostCategoryKey,
} from '../components/Blog/categoryList';

/**
 * Exposes a lightweight summary of every blog post as global data, so blog
 * pages can show related posts without the blog plugin's sidebar (which only
 * carries titles and dates), and adds a page per category at
 * /blog/<category key>.
 *
 * Read it with `useBlogPostsData()` from src/components/Blog/utils.
 *
 * Option `categoryPostsPerPage` (default 12) sets the category page size;
 * later pages live at /blog/<category key>/page/<n>.
 */
export type BlogPostsDataOptions = {categoryPostsPerPage?: number};

export default function blogPostsDataPlugin(
  _context: LoadContext,
  options: BlogPostsDataOptions = {},
): Plugin<void> {
  const postsPerPage = Math.max(1, options.categoryPostsPerPage ?? 12);
  return {
    name: 'blog-posts-data',
    async allContentLoaded({allContent, actions}) {
      const blog = allContent['docusaurus-plugin-content-blog']?.default as
        | BlogContent
        | undefined;
      if (!blog) {
        return;
      }

      const posts: BlogPostSummary[] = blog.blogPosts
        .filter((post) => !post.metadata.unlisted)
        .map(({metadata}) => {
          const image = metadata.frontMatter.image;
          const category = getPostCategoryKey(metadata.frontMatter);
          if (!category) {
            logger.warn`Blog post path=${metadata.source} has a missing or unknown code=${'category'}. Use one of: ${blogCategories.map((c) => c.key).join(', ')} (see src/components/Blog/categoryList.ts).`;
          }
          return {
            permalink: metadata.permalink,
            title: metadata.title,
            description: metadata.description,
            date: metadata.date as unknown as string,
            readingTime: metadata.readingTime,
            category,
            // Relative images are only resolved inside the MDX bundle, so only
            // absolute URLs and static paths are usable here.
            image:
              typeof image === 'string' && /^(https?:)?\//.test(image)
                ? image
                : undefined,
            tags: metadata.tags.map(({label, permalink}) => ({label, permalink})),
            authors: metadata.authors.map(({name}) => name ?? '').filter(Boolean),
          };
        });

      const tags = Object.values(blog.blogTags)
        .filter((tag) => !tag.unlisted)
        .map((tag) => ({
          label: tag.label,
          permalink: tag.permalink,
          count: tag.items.length,
        }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

      // Tags live at <basePath>/tags (the default tagsBasePath).
      const basePath =
        blog.blogTagsListPath.replace(/\/[^/]+\/?$/, '') || '/';

      for (const category of blogCategories) {
        const path = `${basePath.replace(/\/$/, '')}/${category.key}`;
        if (posts.some((post) => post.permalink.replace(/\/$/, '') === path)) {
          logger.warn`Blog post at url=${path} clashes with the code=${category.label} category page; give the post another slug.`;
        }
        const totalCount = posts.filter(
          (post) => post.category === category.key,
        ).length;
        // An empty category still gets its first page.
        const totalPages = Math.max(1, Math.ceil(totalCount / postsPerPage));
        const pagePath = (page: number) =>
          page === 1 ? path : `${path}/page/${page}`;

        for (let page = 1; page <= totalPages; page++) {
          const metadata: BlogCategoryPageMetadata = {
            permalink: pagePath(page),
            page,
            postsPerPage,
            totalCount,
            totalPages,
            previousPage: page > 1 ? pagePath(page - 1) : undefined,
            nextPage: page < totalPages ? pagePath(page + 1) : undefined,
            blogTitle: category.label,
            blogDescription: category.description,
          };
          actions.addRoute({
            path: metadata.permalink,
            component: '@site/src/components/Blog/BlogCategoryPage',
            exact: true,
            props: {categoryKey: category.key, metadata},
          });
        }
      }

      const data: BlogPostsData = {
        basePath,
        title: blog.blogTitle,
        posts,
        tags,
      };
      actions.setGlobalData(data);
    },
  };
}
