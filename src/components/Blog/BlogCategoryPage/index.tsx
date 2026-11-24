// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogCardGrid from '../BlogCardGrid';
import BlogPageHeader, {BlogHomeLink, CategoryNav} from '../BlogPageHeader';
import {getCategory} from '../categories';
import {useBlogPostsData} from '../utils';
import type {BlogCategoryPageMetadata} from '../types';

/**
 * A page of a category's posts at /blog/<category key>[/page/<n>]. The
 * routes and their pagination metadata come from src/plugins/blogPostsData.ts.
 */
export default function BlogCategoryPage({
  categoryKey,
  metadata,
}: {
  categoryKey: string;
  metadata: BlogCategoryPageMetadata;
}): ReactNode {
  const {posts} = useBlogPostsData();
  const category = getCategory(categoryKey)!;
  const start = (metadata.page - 1) * metadata.postsPerPage;
  const pagePosts = posts
    .filter((post) => post.category === categoryKey)
    .slice(start, start + metadata.postsPerPage);
  const pageTitle =
    metadata.page > 1
      ? translate(
          {
            id: 'blog.category.pageTitle',
            message: '{category} - Page {page}',
            description: 'Title of category pages after the first',
          },
          {category: category.label, page: metadata.page},
        )
      : category.label;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <PageMetadata title={pageTitle} description={category.description} />
      <BlogLayout>
        <BlogPageHeader
          eyebrow={
            <>
              <BlogHomeLink />
              <span>
                <Translate id="blog.category.eyebrow">Category</Translate>
              </span>
            </>
          }
          title={category.label}
          description={category.description}>
          <CategoryNav />
        </BlogPageHeader>
        {pagePosts.length > 0 ? (
          <>
            <BlogCardGrid posts={pagePosts} />
            <BlogListPaginator metadata={metadata} />
          </>
        ) : (
          <p>
            <Translate id="blog.category.empty">
              No posts in this category yet.
            </Translate>
          </p>
        )}
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
