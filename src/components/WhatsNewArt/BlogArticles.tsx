// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ease, useTimeline, type Track} from './timeline';
import styles from './styles.module.css';

/**
 * "Recent Articles — Blog Image panel" (Figma node 156:490).
 *
 * An article page rises into a 736×424 black panel, scrolls down to a second
 * article and back, while three chat bubbles fade in and out. Insets are in %
 * of the 290×221 "Blog Image" box (node 156:491); `bleed` is an inner inset
 * for stroked artwork that overflows its slot.
 */

type Art = {src: string; inset: string; bleed?: string};

/** Page, scroll viewport and header rise 324.559px and fade in together. */
const rise: Track[] = [
  {property: 'opacity', values: [0, 1, 1], times: [0, 0.0026, 1], eases: ease.out},
  {
    property: 'transform',
    values: ['translateY(324.559px)', 'translateY(0px)', 'translateY(0px)'],
    times: [0, 0.0837, 1],
    eases: ease.out,
  },
];

/** A chat bubble that fades and rises 8px in at `start`, then out with the page. */
function bubble(start: number): Track[] {
  return [
    {
      property: 'opacity',
      values: [0, 0, 1, 1, 0, 0],
      times: [0, start, start + 0.0308, 0.7797, 0.815, 1],
      eases: ease.out,
    },
    {
      property: 'transform',
      values: ['translateY(8px)', 'translateY(8px)', 'translateY(0px)', 'translateY(0px)', 'translateY(-4px)', 'translateY(8px)'],
      times: [0, start, start + 0.0396, 0.7797, 0.815, 1],
      eases: ease.out,
    },
  ];
}

const tracks: Record<string, Track[]> = {
  '156:494': rise,
  '156:533': rise,
  '156:528': rise,
  '156:534': [
    {
      property: 'transform',
      values: ['translateY(0px)', 'translateY(0px)', 'translateY(-185.9px)', 'translateY(-185.9px)', 'translateY(0px)', 'translateY(0px)'],
      times: [0, 0.2687, 0.5881, 0.6938, 0.9031, 1],
      eases: ease.inOut,
    },
  ],
  '156:503': bubble(0.1542),
  '145:19552': bubble(0.2115),
  '156:522': bubble(0.0969),
};

const PAGE = '-20.96% 9.07% -17.46% 5.27%';

// Article content (node 156:534), in % of the scrolling content box.
const content: Art[] = [
  {src: 'blog-group-lines.svg', inset: '24.52% 11.53% 43.45% 11.38%', bleed: '-0.42% 0'},
  {src: 'blog-group-image.svg', inset: '6.73% 53.94% 80.56% 9.94%'},
  {src: 'blog-group-side.svg', inset: '7.01% 12.3% 82.15% 55.43%', bleed: '-1.25% 0'},
  {src: 'blog-second-image.svg', inset: '64.89% 8.45% 22.39% 55.43%'},
  {src: 'blog-second-side-lines.svg', inset: '64.6% 57.79% 24.55% 9.94%', bleed: '-1.25% 0'},
];

function Img({base, art}: {base: string; art: Art}) {
  const img = <img className={styles.img} src={base + art.src} alt="" />;
  return (
    <div className={styles.layer} style={{inset: art.inset}}>
      {art.bleed ? (
        <div className={styles.layer} style={{inset: art.bleed}}>
          {img}
        </div>
      ) : (
        img
      )}
    </div>
  );
}

export default function BlogArticles(): ReactNode {
  const base = useBaseUrl('/img/landing/whats-new/');
  const root = useTimeline(tracks);
  return (
    <div className={styles.panel} aria-hidden="true">
      <div ref={root} className={styles.stage}>
        <div className={styles.blogImage}>
          <div data-track="156:494" className={styles.layer} style={{inset: PAGE}}>
            <img className={styles.img} src={`${base}blog-page.svg`} alt="" />
          </div>
          <div data-track="156:533" className={styles.viewport} style={{inset: PAGE}}>
            <div data-track="156:534" className={styles.layer} style={{inset: '0 0 -60.77% 0'}}>
              {content.map((art) => (
                <Img key={art.src} base={base} art={art} />
              ))}
              <div className={styles.secondLines}>
                <div className={styles.layer} style={{inset: '-1.23% 0 0 0'}}>
                  <img className={styles.img} src={`${base}blog-second-lines.svg`} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div data-track="156:528" className={styles.layer} style={{inset: '-30.12% 9.06% 120.96% 5.27%'}}>
            <img className={styles.img} src={`${base}blog-header.svg`} alt="" />
          </div>
          <div data-track="156:503" className={styles.layer} style={{inset: '39.14% 78.13% 25.57% -15.65%'}}>
            <img className={styles.img} src={`${base}blog-bubble-medium.svg`} alt="" />
          </div>
          <div data-track="145:19552" className={styles.layer} style={{inset: '62.22% -10.69% -7.67% 73.1%'}}>
            <img className={styles.img} src={`${base}blog-bubble-large.svg`} alt="" />
          </div>
          <div data-track="156:522" className={styles.layer} style={{inset: '-11.09% -4.83% 83.98% 82.41%'}}>
            <img className={styles.img} src={`${base}blog-bubble-small.svg`} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
