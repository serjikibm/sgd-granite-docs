// SPDX-License-Identifier: Apache-2.0
import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {
  BlogPostProvider,
  useBlogPost,
} from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import BlogPostPageStructuredData from '@theme/BlogPostPage/StructuredData';
import ContentVisibility from '@theme/ContentVisibility';
import EditThisPage from '@theme/EditThisPage';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import TOC from '@theme/TOC';
import type {Props} from '@theme/BlogPostPage';
import BlogCard, {
  CategoryLabel,
  PostCover,
  PostMeta,
} from '@site/src/components/Blog/BlogCard';
import {BlogHomeLink} from '@site/src/components/Blog/BlogPageHeader';
import {getPostCategoryKey} from '@site/src/components/Blog/categoryList';
import {
  getRelatedPosts,
  useBlogPostsData,
} from '@site/src/components/Blog/utils';
import styles from './styles.module.css';

function Byline(): ReactNode {
  const {metadata, assets} = useBlogPost();
  const {authors, date, readingTime} = metadata;
  return (
    <div className={styles.byline}>
      {authors.length > 0 && (
        <ul className={styles.authors}>
          {authors.map((author, i) => {
            const image = assets.authorsImageUrls[i] ?? author.imageURL;
            const href = author.page?.permalink ?? author.url;
            const name = author.name ?? author.key;
            return (
              <li key={author.key ?? name ?? i} className={styles.author}>
                {image && (
                  <img src={image} alt="" width={40} height={40} />
                )}
                <span>
                  {href ? (
                    <Link to={href} className={styles.authorName}>
                      {name}
                    </Link>
                  ) : (
                    <span className={styles.authorName}>{name}</span>
                  )}
                  {author.title && (
                    <span className={styles.authorTitle}>{author.title}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <PostMeta
        date={date as unknown as string}
        readingTime={readingTime}
        className={styles.meta}
      />
    </div>
  );
}

function Share({url, title}: {url: string; title: string}): ReactNode {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const copy = () => {
    void navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <ul className={styles.share}>
      <li>
        <button type="button" className={styles.shareButton} onClick={copy}>
          {copied ? (
            <Translate id="blog.post.share.copied">Link copied</Translate>
          ) : (
            <Translate id="blog.post.share.copy">Copy link</Translate>
          )}
        </button>
      </li>
      <li>
        <a
          className={styles.shareButton}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer">
          LinkedIn
        </a>
      </li>
      <li>
        <a
          className={styles.shareButton}
          href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer">
          X
        </a>
      </li>
    </ul>
  );
}

function Aside(): ReactNode {
  const {metadata, toc, frontMatter} = useBlogPost();
  const {siteConfig} = useDocusaurusContext();
  const showToc = !frontMatter.hide_table_of_contents && toc.length > 0;
  return (
    <aside className={styles.aside}>
      <div className={styles.asideInner}>
        {showToc && (
          <section className={styles.asideSection}>
            <Heading as="h2" className={styles.asideTitle}>
              <Translate id="theme.TOCCollapsible.toggleButtonLabel">
                On this page
              </Translate>
            </Heading>
            <TOC
              toc={toc}
              minHeadingLevel={frontMatter.toc_min_heading_level}
              maxHeadingLevel={frontMatter.toc_max_heading_level}
              className={styles.toc}
            />
          </section>
        )}
        {metadata.tags.length > 0 && (
          <section className={styles.asideSection}>
            <Heading as="h2" className={styles.asideTitle}>
              <Translate id="blog.post.tags">Tags</Translate>
            </Heading>
            <ul className={styles.tags}>
              {metadata.tags.map((tag) => (
                <li key={tag.permalink}>
                  <Link to={tag.permalink} className={styles.tag}>
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className={styles.asideSection}>
          <Heading as="h2" className={styles.asideTitle}>
            <Translate id="blog.post.share">Share</Translate>
          </Heading>
          <Share
            url={`${siteConfig.url}${metadata.permalink}`}
            title={metadata.title}
          />
        </section>
      </div>
    </aside>
  );
}

function RelatedPosts(): ReactNode {
  const {metadata} = useBlogPost();
  const {posts} = useBlogPostsData();
  const related = getRelatedPosts(posts, {
    ...metadata,
    category: getPostCategoryKey(metadata.frontMatter),
  });
  if (related.length === 0) {
    return null;
  }
  return (
    <section className={styles.related}>
      <Heading as="h2" className={styles.relatedTitle}>
        <Translate id="blog.post.related">Keep reading</Translate>
      </Heading>
      <ul className={styles.relatedGrid}>
        {related.map((post) => (
          <li key={post.permalink}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlogPostPageContent({children}: {children: ReactNode}): ReactNode {
  const {metadata, frontMatter, assets} = useBlogPost();
  const {title, nextItem, prevItem, permalink, editUrl} = metadata;
  const category = getPostCategoryKey(frontMatter);
  // Only show a dek when the author wrote one; the generated description
  // just repeats the first paragraph.
  const dek = frontMatter.description;
  const image = assets.image ?? frontMatter.image;

  return (
    <BlogLayout>
      <ContentVisibility metadata={metadata} />
      <article className={styles.post}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <BlogHomeLink />
            {category ? (
              <CategoryLabel category={category} link className={styles.category} />
            ) : (
              <span>
                <Translate id="blog.post.eyebrow">Article</Translate>
              </span>
            )}
          </p>
          <Heading as="h1" className={styles.title}>
            {title}
          </Heading>
          {dek && <p className={styles.dek}>{dek}</p>}
          <Byline />
        </header>

        <PostCover
          post={{permalink, category, image}}
          className={styles.cover}
        />

        <div className={styles.columns}>
          <div className={styles.content}>
            <div
              // Used by the feed generation to locate the main content
              id={blogPostContainerID}
              className="markdown">
              <MDXContent>{children}</MDXContent>
            </div>
            {editUrl && (
              <div className={styles.edit}>
                <EditThisPage editUrl={editUrl} />
              </div>
            )}
            {(nextItem || prevItem) && (
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            )}
          </div>
          <Aside />
        </div>
      </article>
      <RelatedPosts />
    </BlogLayout>
  );
}

export default function BlogPostPage(props: Props): ReactNode {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <BlogPostPageContent>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
