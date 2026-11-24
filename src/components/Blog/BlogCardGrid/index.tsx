// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import BlogCard from '../BlogCard';
import type {BlogPostSummary} from '../types';
import styles from './styles.module.css';

/** Responsive grid of blog cards: 3, 2, then 1 column. */
export default function BlogCardGrid({
  posts,
}: {
  posts: BlogPostSummary[];
}): ReactNode {
  if (posts.length === 0) {
    return null;
  }
  return (
    <ul className={styles.grid}>
      {posts.map((post) => (
        <li key={post.permalink}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
