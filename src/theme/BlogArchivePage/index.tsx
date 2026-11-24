// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Heading from '@theme/Heading';
import type {ArchiveBlogPost, Props} from '@theme/BlogArchivePage';
import BlogPageHeader, {
  BlogHomeLink,
  CategoryNav,
} from '@site/src/components/Blog/BlogPageHeader';
import {CategoryLabel, PostMeta} from '@site/src/components/Blog/BlogCard';
import {getPostCategoryKey} from '@site/src/components/Blog/categoryList';
import PostCount from '@site/src/components/Blog/PostCount';
import styles from './styles.module.css';

type Year = {year: string; posts: ArchiveBlogPost[]};

/** Newest year first, newest post first within each year. */
function groupByYear(posts: readonly ArchiveBlogPost[]): Year[] {
  const sorted = [...posts].sort((a, b) =>
    String(b.metadata.date).localeCompare(String(a.metadata.date)),
  );
  const years = new Map<string, ArchiveBlogPost[]>();
  for (const post of sorted) {
    const year = String(post.metadata.date).slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), post]);
  }
  return Array.from(years, ([year, yearPosts]) => ({year, posts: yearPosts}));
}

function ArchiveRow({post}: {post: ArchiveBlogPost}): ReactNode {
  const {metadata} = post;
  return (
    <li className={styles.row}>
      <PostMeta
        date={metadata.date as unknown as string}
        readingTime={metadata.readingTime}
        className={styles.meta}
      />
      <Link to={metadata.permalink} className={styles.title}>
        {metadata.title}
      </Link>
      <CategoryLabel
        category={getPostCategoryKey(metadata.frontMatter)}
        className={styles.category}
      />
    </li>
  );
}

/** Every post, grouped by year, as a Carbon structured list. */
export default function BlogArchivePage({archive}: Props): ReactNode {
  const title = translate({
    id: 'theme.blog.archive.title',
    message: 'Archive',
    description: 'The page & hero title of the blog archive page',
  });
  const description = translate({
    id: 'blog.archive.description',
    message: 'Every post on the Granite blog, newest first.',
  });
  const years = groupByYear(archive.blogPosts);
  return (
    <>
      <PageMetadata title={title} description={description} />
      <BlogLayout>
        <BlogPageHeader
          eyebrow={<BlogHomeLink />}
          title={title}
          description={description}>
          <CategoryNav />
        </BlogPageHeader>
        {years.map(({year, posts}) => (
          <section key={year} className={styles.year} aria-labelledby={`year-${year}`}>
            <div className={styles.yearLabel}>
              <Heading as="h2" id={`year-${year}`} className={styles.yearTitle}>
                {year}
              </Heading>
              <span className={styles.yearCount}>
                <PostCount count={posts.length} />
              </span>
            </div>
            <ul className={styles.list}>
              {posts.map((post) => (
                <ArchiveRow key={post.metadata.permalink} post={post} />
              ))}
            </ul>
          </section>
        ))}
      </BlogLayout>
    </>
  );
}
