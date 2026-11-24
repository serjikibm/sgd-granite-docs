// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import Translate from '@docusaurus/Translate';

/** "1 post" / "3 posts" */
export default function PostCount({count}: {count: number}): ReactNode {
  return count === 1 ? (
    <Translate id="blog.postCount.one" values={{count}}>
      {'{count} post'}
    </Translate>
  ) : (
    <Translate id="blog.postCount.other" values={{count}}>
      {'{count} posts'}
    </Translate>
  );
}
