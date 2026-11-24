// SPDX-License-Identifier: Apache-2.0
import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * Card artwork, placed in a 352×480 scene (Figma: IBM Granite Docs - Landing
 * page, node 71:8327). `left`/`top`/`width` are percentages of the scene so
 * the artwork scales with the card; the height follows the SVG's own ratio.
 *
 * Hover follows the Granite Playground demo cards
 * (new-playground/docs/granite-demo-showcase-cover.md): the artwork zooms to
 * 1.06× and hue-shifts. `hue` picks the shift: `green` (−80°, blue artwork →
 * vibrant green, as on Language and Guardian) or `blue` (+100°, green artwork
 * → electric blue, as on Vision and Speech).
 *
 * `accent` is the Speech-style split layer: a mask of just the green shapes.
 * Only that layer takes the hue shift, so the neutral grays around it don't
 * turn mauve.
 */
type Scene = {
  src: string;
  width: number;
  height: number;
  left: string;
  top: string;
  hue: 'green' | 'blue';
  accent?: string;
};

const scenes = {
  // Node 71:8459, clip path group inset 21.04% 10.97%. Matches Language.
  models: {src: 'card-models.svg', width: 275, height: 281, left: '10.97%', top: '21.04%', hue: 'green'},
  // Node 79:10303, 349×297 at (0, 91). Matches Vision.
  tools: {src: 'card-tools.svg', accent: 'card-tools-accent.svg', width: 349, height: 297, left: '0%', top: '18.96%', hue: 'blue'},
  // Node 71:9237, clip path group inset 12.5% 0. Matches Guardian.
  tutorials: {src: 'card-tutorials.svg', width: 352, height: 360, left: '0%', top: '12.5%', hue: 'green'},
  // Node 71:9359, 290×221 centered (+0.5px). Matches Speech.
  blogs: {src: 'card-blogs.svg', accent: 'card-blogs-accent.svg', width: 290, height: 221, left: '8.81%', top: '27.08%', hue: 'blue'},
} satisfies Record<string, Scene>;

export type IllustrationName = keyof typeof scenes;

/**
 * Bump when the artwork files change, so browsers don't keep a cached copy
 * (v2: frame backgrounds removed from the Models and Tutorials art).
 */
const ART_VERSION = '2';

export default function LandingIllustration({
  name,
}: {
  name: IllustrationName;
}): ReactNode {
  const scene: Scene = scenes[name];
  const {src, width, height, left, top, hue, accent} = scene;
  const base = useBaseUrl('/img/landing/');
  const style = {
    left,
    top,
    width: `${(width / 352) * 100}%`,
    '--demo-hue': hue === 'blue' ? 'var(--demo-hue-blue)' : 'var(--demo-hue-green)',
  } as CSSProperties;
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.artwork} style={style}>
        <img
          className={clsx(styles.img, !accent && styles.shift)}
          src={`${base}${src}?v=${ART_VERSION}`}
          width={width}
          height={height}
          alt=""
        />
        {accent && (
          <div
            className={clsx(styles.accent, styles.shift)}
            style={{'--accent-mask': `url("${base}${accent}?v=${ART_VERSION}")`} as CSSProperties}
          />
        )}
      </div>
    </div>
  );
}
