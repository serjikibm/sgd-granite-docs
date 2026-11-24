// SPDX-License-Identifier: Apache-2.0
import type {ComponentType, CSSProperties, ReactNode, SVGProps} from 'react';
import clsx from 'clsx';

import FadeA from './assets/fade-a.svg';
import FadeB from './assets/fade-b.svg';
import FadeC from './assets/fade-c.svg';
import FadeD from './assets/fade-d.svg';
import FadeE from './assets/fade-e.svg';
import Lines from './assets/lines.svg';
import IconDemo from './assets/icon-demo.svg';
import IconVoiceActivate from './assets/icon-voice-activate.svg';
import IconIbmGranite from './assets/icon-ibm-granite.svg';
import IconBullhorn from './assets/icon-bullhorn.svg';
import IconTask from './assets/icon-task.svg';
import IconDocumentMultiple from './assets/icon-document-multiple.svg';
import IconModelAlt from './assets/icon-model-alt.svg';
import IconModel from './assets/icon-model.svg';
import IconTextAnnotationToggle from './assets/icon-text-annotation-toggle.svg';
import IconViewFilled from './assets/icon-view-filled.svg';
import IconBlog from './assets/icon-blog.svg';
import IconQuestionAnswering from './assets/icon-question-answering.svg';

import styles from './styles.module.css';

/**
 * "Honeycomb · transparent color loop" (Figma node 50:4475).
 *
 * A 731×411 honeycomb in the top right of the hero, faded out to the left
 * and bottom by a luminance mask. Every layer shares one 9s timeline that
 * plays once per page load and holds on its final gray frame: strokes and
 * fills cycle green → blue → gray, and the icons pop in and pulse.
 * Positions are in px within the 731×411 box (Figma frame x − 858).
 */

type Svg = ComponentType<SVGProps<SVGSVGElement>>;

type Box = {left: number; top: number; width: number; height: number};

/** Stroked line segments; `bleed` lets the stroke overflow its slot. */
const lines: (Box & {Svg: Svg; bleed: string})[] = [
  {Svg: FadeA, left: 214, top: 29, width: 69, height: 282, bleed: '-0.53% -2.17%'},
  {Svg: FadeB, left: 283, top: 0, width: 16, height: 29, bleed: '-5.17% -9.38%'},
  {Svg: FadeC, left: 283, top: 29, width: 41, height: 352, bleed: '-0.43% -3.66%'},
  {Svg: FadeD, left: 306, top: 381, width: 17, height: 30, bleed: '-5% -8.83%'},
  {Svg: FadeE, left: 324, top: 99, width: 81, height: 282, bleed: '-0.53% -1.85%'},
  {Svg: Lines, left: 405, top: 0, width: 326, height: 411, bleed: '-0.37% -0.46%'},
];

/**
 * Peak/dip opacity of the pulse; the three levels in the design.
 * Values are the Figma keyframes: [peak, dip].
 */
const tiers = {
  full: [1, 0.82],
  mid: [0.76154, 0.62446],
  low: [0.25, 0.205],
} as const;

const icons: (Box & {Svg: Svg; tier: keyof typeof tiers})[] = [
  {Svg: IconDemo, left: 462, top: 76, width: 48, height: 47, tier: 'full'},
  {Svg: IconVoiceActivate, left: 341, top: 146, width: 46, height: 48, tier: 'mid'},
  {Svg: IconIbmGranite, left: 586, top: 145, width: 45, height: 50, tier: 'full'},
  {Svg: IconBullhorn, left: 465, top: 223, width: 42, height: 34, tier: 'full'},
  {Svg: IconTask, left: 345, top: 287, width: 38, height: 48, tier: 'mid'},
  {Svg: IconDocumentMultiple, left: 588, top: 287, width: 41, height: 49, tier: 'full'},
  {Svg: IconModelAlt, left: 464, top: 344, width: 44, height: 43, tier: 'full'},
  {Svg: IconModel, left: 338, top: 21, width: 52, height: 48, tier: 'mid'},
  {Svg: IconTextAnnotationToggle, left: 585, top: 21, width: 47, height: 48, tier: 'full'},
  {Svg: IconViewFilled, left: 233, top: 80, width: 52, height: 38, tier: 'low'},
  {Svg: IconBlog, left: 238, top: 220, width: 41, height: 41, tier: 'low'},
  {Svg: IconQuestionAnswering, left: 237, top: 342, width: 48, height: 45, tier: 'low'},
];

const boxStyle = ({left, top, width, height}: Box): CSSProperties => ({
  left,
  top,
  width,
  height,
});

export default function HeroHoneycomb({
  className,
}: {
  className?: string;
}): ReactNode {
  return (
    <div className={clsx(styles.honeycomb, className)} aria-hidden="true">
      {lines.map(({Svg, bleed, ...box}, i) => (
        <div key={`line-${i}`} className={styles.slot} style={boxStyle(box)}>
          <div className={styles.slot} style={{inset: bleed}}>
            <Svg className={clsx(styles.svg, styles.line)} />
          </div>
        </div>
      ))}
      {icons.map(({Svg, tier, ...box}, i) => {
        const [peak, dip] = tiers[tier];
        return (
          <div key={`icon-${i}`} className={styles.slot} style={boxStyle(box)}>
            {/* The exported paths are drawn in slot pixels, not the 32×32 viewBox. */}
            <Svg
              className={clsx(styles.svg, styles.icon)}
              viewBox={`0 0 ${box.width} ${box.height}`}
              style={{'--peak': peak, '--dip': dip} as CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
}
