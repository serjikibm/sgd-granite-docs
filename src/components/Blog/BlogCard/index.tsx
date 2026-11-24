// SPDX-License-Identifier: Apache-2.0
import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import BlogArt from '../BlogArt';
import {getCategory, getCategoryHue, hueShades} from '../categories';
import {useBlogPostsData, useFormatBlogDate} from '../utils';
import type {BlogPostSummary} from '../types';
import styles from './styles.module.css';

/** Inline style that sets the category color variables used by the CSS. */
export function categoryStyle(category: string | undefined): CSSProperties {
  const shades = hueShades[getCategoryHue(category)];
  return {
    '--blog-hue': shades[4],
    '--blog-hue-dark': shades[2],
  } as CSSProperties;
}

/**
 * Category name with a swatch in its color. With `link`, it links to the
 * category page (don't use inside a card: the card is already one link).
 */
export function CategoryLabel({
  category,
  link = false,
  className,
}: {
  /** Category key */
  category?: string;
  link?: boolean;
  className?: string;
}): ReactNode {
  const {basePath} = useBlogPostsData();
  const definition = getCategory(category);
  if (!definition) {
    return null;
  }
  const props = {
    className: clsx(styles.category, link && styles.categoryLink, className),
    style: categoryStyle(definition.key),
  };
  return link ? (
    <Link to={`${basePath.replace(/\/$/, '')}/${definition.key}`} {...props}>
      {definition.label}
    </Link>
  ) : (
    <span {...props}>{definition.label}</span>
  );
}

export function PostMeta({
  date,
  readingTime,
  className,
}: {
  date: string;
  readingTime?: number;
  className?: string;
}): ReactNode {
  const formatDate = useFormatBlogDate();
  return (
    <p className={clsx(styles.meta, className)}>
      <time dateTime={date}>{formatDate(date)}</time>
      {readingTime !== undefined && (
        <>
          <span aria-hidden="true" className={styles.dot}>
            ·
          </span>
          <span>
            <Translate
              id="blog.card.readingTime"
              description="Reading time on a blog card"
              values={{minutes: Math.max(1, Math.ceil(readingTime))}}>
              {'{minutes} min read'}
            </Translate>
          </span>
        </>
      )}
    </p>
  );
}

export function PostCover({
  post,
  className,
}: {
  post: Pick<BlogPostSummary, 'permalink' | 'category' | 'image'>;
  className?: string;
}): ReactNode {
  return (
    <div className={clsx(styles.cover, className)}>
      {post.image ? (
        <img src={post.image} alt="" loading="lazy" />
      ) : (
        <BlogArt seed={post.permalink} category={post.category} />
      )}
    </div>
  );
}

/**
 * Blog post card. The title link is stretched over the whole card, so the
 * card is one click target and one tab stop.
 */
export default function BlogCard({
  post,
  featured = false,
  headingLevel = 'h3',
}: {
  post: BlogPostSummary;
  featured?: boolean;
  headingLevel?: 'h2' | 'h3';
}): ReactNode {
  return (
    <article className={clsx(styles.card, featured && styles.featured)}>
      <PostCover post={post} />
      <div className={styles.body}>
        <CategoryLabel category={post.category} />
        <Heading as={headingLevel} className={styles.title}>
          <Link to={post.permalink} className={styles.link}>
            {post.title}
          </Link>
        </Heading>
        {post.description && (
          <p className={styles.description}>{post.description}</p>
        )}
        <div className={styles.footer}>
          {featured && post.authors.length > 0 && (
            <p className={styles.authors}>{post.authors.join(', ')}</p>
          )}
          <PostMeta date={post.date} readingTime={post.readingTime} />
        </div>
        {featured && (
          <span className={styles.readMore} aria-hidden="true">
            <Translate id="blog.card.readArticle">Read article</Translate>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
              <path d="M18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10L18 6z" />
            </svg>
          </span>
        )}
      </div>
    </article>
  );
}
