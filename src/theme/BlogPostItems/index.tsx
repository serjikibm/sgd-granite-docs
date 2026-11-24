// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import BlogCardGrid from '@site/src/components/Blog/BlogCardGrid';
import {summarizeBlogPost} from '@site/src/components/Blog/utils';
import type {Props} from '@theme/BlogPostItems';

/**
 * Blog post lists (index, tag, and author pages) as a grid of cards instead
 * of stacked post excerpts.
 */
export default function BlogPostItems({items}: Props): ReactNode {
  return (
    <BlogCardGrid posts={items.map(({content}) => summarizeBlogPost(content))} />
  );
}
