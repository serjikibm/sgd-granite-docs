// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import type {Props} from '@theme/BlogLayout';
import styles from './styles.module.css';

/**
 * Full-width blog layout with no "Recent posts" sidebar: blog pages bring
 * their own navigation (topics, related posts). The `toc` prop is ignored;
 * the post page places its table of contents itself.
 */
export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc, children, ...layoutProps} = props;
  return (
    <Layout {...layoutProps}>
      <main className={styles.main}>{children}</main>
    </Layout>
  );
}
