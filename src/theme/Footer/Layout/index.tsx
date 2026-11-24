// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Footer/Layout';

/**
 * IBM footer: logo on the left, link groups on the right.
 */
export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid footer__inner">
        {logo && <div className="footer__brand">{logo}</div>}
        {links}
      </div>
      {copyright && (
        <div className="container container-fluid footer__bottom">
          {copyright}
        </div>
      )}
    </footer>
  );
}
