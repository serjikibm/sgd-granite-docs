// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {translateBlogAuthorsListPageTitle} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import type {Props} from '@theme/Blog/Pages/BlogAuthorsListPage';
import type {AuthorItemProp} from '@docusaurus/plugin-content-blog';
import AuthorAvatar from '@site/src/components/Blog/AuthorAvatar';
import PostCount from '@site/src/components/Blog/PostCount';
import BlogPageHeader, {
  BlogHomeLink,
} from '@site/src/components/Blog/BlogPageHeader';
import styles from './styles.module.css';

/** Author tile. With an author page, the name link covers the tile. */
function AuthorTile({author}: {author: AuthorItemProp}): ReactNode {
  const {name, title, imageURL, page, count} = author;
  const hasSocials = Object.keys(author.socials ?? {}).length > 0;
  return (
    <article className={clsx(styles.tile, page && styles.tileLink)}>
      <AuthorAvatar name={name} imageURL={imageURL} size={72} />
      <Heading as="h2" className={styles.name}>
        {page ? (
          <Link to={page.permalink} className={styles.nameLink}>
            {name}
          </Link>
        ) : (
          name
        )}
      </Heading>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.footer}>
        <span className={styles.count}>
          <PostCount count={count} />
        </span>
        {hasSocials && (
          <div className={styles.socials}>
            <AuthorSocials author={author} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function BlogAuthorsListPage({authors}: Props): ReactNode {
  const title = translateBlogAuthorsListPageTitle();
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_list" />
      <BlogLayout>
        <BlogPageHeader
          eyebrow={<BlogHomeLink />}
          title={title}
          description={
            <Translate id="blog.authors.description">
              The people writing about Granite models, tools, and community.
            </Translate>
          }
        />
        <ul className={styles.grid}>
          {authors.map((author) => (
            <li key={author.key}>
              <AuthorTile author={author} />
            </li>
          ))}
        </ul>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
