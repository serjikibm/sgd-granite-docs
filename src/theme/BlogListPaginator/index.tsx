// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/BlogListPaginator';
import styles from './styles.module.css';

function Arrow({left = false}: {left?: boolean}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      style={left ? {transform: 'scaleX(-1)'} : undefined}>
      <path d="M18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10L18 6z" />
    </svg>
  );
}

/** Carbon-style pagination bar: newer / "Page x of y" / older. */
export default function BlogListPaginator({metadata}: Props): ReactNode {
  const {previousPage, nextPage, page, totalPages} = metadata;
  if (totalPages <= 1) {
    return null;
  }
  return (
    <nav
      className={styles.paginator}
      aria-label={translate({
        id: 'theme.blog.paginator.navAriaLabel',
        message: 'Blog list page navigation',
        description: 'The ARIA label for the blog pagination',
      })}>
      <div className={styles.side}>
        {previousPage && (
          <Link to={previousPage} className={styles.button}>
            <Arrow left />
            <Translate id="theme.blog.paginator.newerEntries">
              Newer posts
            </Translate>
          </Link>
        )}
      </div>
      <span className={styles.status}>
        <Translate
          id="blog.paginator.status"
          values={{page, totalPages}}
          description="Blog pagination status">
          {'Page {page} of {totalPages}'}
        </Translate>
      </span>
      <div className={styles.side} data-end>
        {nextPage && (
          <Link to={nextPage} className={styles.button}>
            <Translate id="theme.blog.paginator.olderEntries">
              Older posts
            </Translate>
            <Arrow />
          </Link>
        )}
      </div>
    </nav>
  );
}
