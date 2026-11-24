// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import Unlisted from '@theme/ContentVisibility/Unlisted';
import type {Props} from '@theme/BlogTagsPostsPage';
import BlogPageHeader, {
  BlogHomeLink,
  CategoryNav,
  EyebrowLink,
} from '@site/src/components/Blog/BlogPageHeader';
import PostCount from '@site/src/components/Blog/PostCount';

/** Tag page: same header and card grid as the blog index. */
export default function BlogTagsPostsPage({
  tag,
  items,
  listMetadata,
}: Props): ReactNode {
  const pageTitle = useBlogTagsPostsPageTitle(tag);
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage,
      )}>
      <PageMetadata title={pageTitle} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
      <BlogLayout>
        {tag.unlisted && <Unlisted />}
        <BlogPageHeader
          eyebrow={
            <>
              <BlogHomeLink />
              <EyebrowLink to={tag.allTagsPath}>
                {translateTagsPageTitle()}
              </EyebrowLink>
            </>
          }
          title={tag.label}
          description={
            tag.description ?? <PostCount count={tag.count} />
          }>
          <CategoryNav />
        </BlogPageHeader>
        <BlogPostItems items={items} />
        <BlogListPaginator metadata={listMetadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
