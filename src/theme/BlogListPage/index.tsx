// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import type {Props} from '@theme/BlogListPage';
import BlogCard from '@site/src/components/Blog/BlogCard';
import BlogPageHeader, {
  BlogLinks,
  CategoryNav,
} from '@site/src/components/Blog/BlogPageHeader';
import {summarizeBlogPost} from '@site/src/components/Blog/utils';
import styles from './styles.module.css';

/**
 * Blog index: header with topics, the newest post as a featured card on the
 * first page, then a card grid.
 */
export default function BlogListPage(props: Props): ReactNode {
  const {metadata, items} = props;
  const {blogTitle, blogDescription} = metadata;
  const isFirstPage = metadata.page === 1;
  const featured = isFirstPage ? items[0] : undefined;
  const rest = featured ? items.slice(1) : items;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <PageMetadata title={blogTitle} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <BlogLayout>
        <BlogPageHeader
          title={blogTitle}
          description={blogDescription}
          actions={<BlogLinks />}>
          <CategoryNav />
        </BlogPageHeader>
        {featured && (
          <section className={styles.featured}>
            <BlogCard
              post={summarizeBlogPost(featured.content)}
              featured
              headingLevel="h2"
            />
          </section>
        )}
        <BlogPostItems items={rest} />
        <BlogListPaginator metadata={metadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
