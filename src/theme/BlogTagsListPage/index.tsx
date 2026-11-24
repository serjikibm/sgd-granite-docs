// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsListPage';
import BlogPageHeader, {
  BlogHomeLink,
  CategoryNav,
} from '@site/src/components/Blog/BlogPageHeader';
import styles from './styles.module.css';

/** All tags as one alphabetical cloud of Carbon tags with post counts. */
export default function BlogTagsListPage({tags}: Props): ReactNode {
  const title = translateTagsPageTitle();
  const sorted = [...tags].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, {sensitivity: 'base'}),
  );
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_list" />
      <BlogLayout>
        <BlogPageHeader
          eyebrow={<BlogHomeLink />}
          title={title}
          description={
            <Translate id="blog.tags.description">
              Browse posts by model family, tool, or topic.
            </Translate>
          }>
          <CategoryNav />
        </BlogPageHeader>
        <ul className={styles.tags}>
          {sorted.map((tag) => (
            <li key={tag.permalink}>
              <Link
                to={tag.permalink}
                className={styles.tag}
                title={tag.description}>
                <span>{tag.label}</span>
                <span className={styles.count}>{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
