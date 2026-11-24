// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import Heading from '@theme/Heading';
import {useBlogPostsData} from '../utils';
import {blogCategories} from '../categories';
import {categoryStyle} from '../BlogCard';
import styles from './styles.module.css';

/** Header shared by the blog index, topic, and author pages. */
export default function BlogPageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}): ReactNode {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.text}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <Heading as="h1" className={styles.title}>
            {title}
          </Heading>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </header>
  );
}

/** "Blog" link that starts the eyebrow of sub-pages. */
export function BlogHomeLink(): ReactNode {
  const {basePath: blogBasePath, title: blogTitle} = useBlogPostsData();
  return <EyebrowLink to={blogBasePath}>{blogTitle}</EyebrowLink>;
}

/** A link in the eyebrow trail, followed by a "/" separator. */
export function EyebrowLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link to={to} className={styles.homeLink}>
      {children}
    </Link>
  );
}

/**
 * Paths of the blog's secondary pages. These follow the blog plugin's default
 * `archiveBasePath` and `authorsBasePath`; update them if those change.
 */
export function useBlogPaths(): {archive: string; authors: string; tags: string} {
  const base = useBlogPostsData().basePath.replace(/\/$/, '');
  return {
    archive: `${base}/archive`,
    authors: `${base}/authors`,
    tags: `${base}/tags`,
  };
}

/** Archive, Authors, and RSS links for the blog index header. */
export function BlogLinks(): ReactNode {
  const paths = useBlogPaths();
  return (
    <ul className={styles.links}>
      <li>
        <Link to={paths.archive} className={styles.rss}>
          <Translate id="blog.header.archive">Archive</Translate>
        </Link>
      </li>
      <li>
        <Link to={paths.authors} className={styles.rss}>
          <Translate id="blog.header.authors">Authors</Translate>
        </Link>
      </li>
      <li>
        <RssLink />
      </li>
    </ul>
  );
}

export function RssLink(): ReactNode {
  const {basePath: blogBasePath} = useBlogPostsData();
  return (
    <a href={`${blogBasePath}/rss.xml`} className={styles.rss}>
      <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M8 18a6 6 0 0 1 6 6h2a8 8 0 0 0-8-8z" />
        <path d="M8 10a14 14 0 0 1 14 14h2A16 16 0 0 0 8 8z" />
        <path d="M8 2v2a20 20 0 0 1 20 20h2A22 22 0 0 0 8 2z" />
        <circle cx="9" cy="23" r="2" />
      </svg>
      <Translate id="blog.header.rss">RSS feed</Translate>
    </a>
  );
}

/**
 * Category switcher: "All posts" plus one link per category, highlighting
 * the current page, with a link to the tag index at the end.
 */
export function CategoryNav(): ReactNode {
  const {basePath, tags} = useBlogPostsData();
  const {pathname} = useLocation();
  const base = basePath.replace(/\/$/, '');
  const current = pathname.replace(/\/$/, '');
  const isAll = current === base || current.startsWith(`${base}/page/`);
  const tagsPath = `${base}/tags`;

  const items = [
    {
      key: 'all',
      label: <Translate id="blog.categories.all">All posts</Translate>,
      to: basePath,
      active: isAll,
    },
    ...blogCategories.map((category) => ({
      key: category.key,
      label: category.label,
      to: `${base}/${category.key}`,
      active:
        current === `${base}/${category.key}` ||
        current.startsWith(`${base}/${category.key}/page/`),
    })),
  ];

  return (
    <nav
      className={styles.topics}
      aria-label={translate({
        id: 'blog.categories.ariaLabel',
        message: 'Blog categories',
      })}>
      <ul className={styles.topicList}>
        {items.map((item) => (
          <li key={item.key}>
            <Link
              to={item.to}
              className={clsx(styles.topic, item.active && styles.topicActive)}
              style={item.key === 'all' ? undefined : categoryStyle(item.key)}
              data-swatch={item.key === 'all' ? undefined : true}
              aria-current={item.active ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {tags.length > 0 && (
        <Link to={tagsPath} className={styles.allTopics}>
          <Translate id="blog.categories.allTags">Browse all tags</Translate>
        </Link>
      )}
    </nav>
  );
}
