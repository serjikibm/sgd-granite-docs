// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  useBlogAuthorPageTitle,
  translateBlogAuthorsListPageTitle,
} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import type {Props} from '@theme/Blog/Pages/BlogAuthorsPostsPage';
import AuthorAvatar from '@site/src/components/Blog/AuthorAvatar';
import BlogPageHeader, {
  BlogHomeLink,
  EyebrowLink,
  useBlogPaths,
} from '@site/src/components/Blog/BlogPageHeader';
import PostCount from '@site/src/components/Blog/PostCount';
import styles from './styles.module.css';

/** Author page: profile header, then the author's posts as cards. */
export default function BlogAuthorsPostsPage({
  author,
  items,
  listMetadata,
}: Props): ReactNode {
  const pageTitle = useBlogAuthorPageTitle(author);
  const paths = useBlogPaths();
  const hasSocials = Object.keys(author.socials ?? {}).length > 0;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsPostsPage,
      )}>
      <PageMetadata title={pageTitle} description={author.description} />
      <SearchMetadata tag="blog_authors_posts" />
      <BlogLayout>
        <BlogPageHeader
          eyebrow={
            <>
              <BlogHomeLink />
              <EyebrowLink to={paths.authors}>
                {translateBlogAuthorsListPageTitle()}
              </EyebrowLink>
            </>
          }
          title={
            <span className={styles.titleRow}>
              <AuthorAvatar
                name={author.name}
                imageURL={author.imageURL}
                size={80}
              />
              <span>{author.name}</span>
            </span>
          }
          description={
            <>
              {author.title && (
                <span className={styles.role}>{author.title}</span>
              )}
              {author.description && (
                <span className={styles.bio}>{author.description}</span>
              )}
            </>
          }>
          <div className={styles.meta}>
            <span>
              <PostCount count={author.count} />
            </span>
            {hasSocials && (
              <div className={styles.socials}>
                <AuthorSocials author={author} />
              </div>
            )}
          </div>
        </BlogPageHeader>
        {items.length === 0 ? (
          <p>
            <Translate id="blog.author.empty">
              This author has not published any posts yet.
            </Translate>
          </p>
        ) : (
          <>
            <BlogPostItems items={items} />
            <BlogListPaginator metadata={listMetadata} />
          </>
        )}
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
