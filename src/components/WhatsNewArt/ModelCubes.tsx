// SPDX-License-Identifier: Apache-2.0
import type {CSSProperties, ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ease, useTimeline, type Track} from './timeline';
import styles from './styles.module.css';

/**
 * "Main Model Cube — pyramid card-deal motion" (Figma node 147:490).
 *
 * A pyramid of six isometric cubes on a 736×424 black panel. The top cube
 * zooms in from 8.19× scale; the other five are dealt in face by face, each
 * face flipping over (rotateX 180° → 0°) and swapping from its back color to
 * its front color at the 90° mark. Each face is its Figma vector used as a
 * mask, so its fill can be animated.
 */

type Face = 'lower' | 'blue' | 'upper' | 'white';

const COLORS: Record<Face, string> = {
  lower: '#000000',
  blue: '#2764ff',
  upper: '#000000',
  white: '#ffffff',
};

// Flip curve sampled at 13 evenly spaced keyframes (from get_motion_context).
const FLIP_STEPS = 12;
const FLIP_SPAN = 0.0564; // of the timeline
const ROTATE_X = [180, 176.932, 168.401, 155.161, 137.45, 115.332, 90, 64.668, 42.55, 24.839, 11.599, 3.068, 0];
const ROTATE_Y = [0, 1.77, 6.621, 13.633, 21.327, 27.557, 30, 27.557, 21.327, 13.633, 6.621, 1.77, 0];
const ROTATE_Z = [-60.001, -59.953, -59.327, -56.985, -51.614, -42.353, -30, -17.647, -8.387, -3.016, -0.673, -0.047, 0];

type Flip = {
  /** Timeline position (0–1) where the flip starts. */
  start: number;
  /** Rotation pivot in px within the face's own box. */
  pivot: [number, number];
  /** 1: tilts with +rotateY/−rotateZ (left faces); −1: mirrored (right faces). */
  hand: 1 | -1;
  /** Back-side color shown until the face turns edge-on. */
  from: string;
  /** Offset in px the face slides in from (blue tops only). */
  slide?: [number, number];
};

function flipTracks({start, pivot: [px, py], hand, from, slide = [0, 0]}: Flip, to: string): Track[] {
  const step = FLIP_SPAN / FLIP_STEPS;
  const times = Array.from({length: FLIP_STEPS + 1}, (_, i) => start + i * step);
  const transforms = ROTATE_X.map((rx, i) => {
    const k = 1 - i / FLIP_STEPS;
    return (
      `translate(${slide[0] * k}px, ${slide[1] * k}px) translate(${px}px, ${py}px) ` +
      `rotateX(${rx}deg) rotateY(${hand * ROTATE_Y[i]}deg) rotateZ(${hand * ROTATE_Z[i]}deg) ` +
      `translate(${-px}px, ${-py}px)`
    );
  });
  return [
    {
      property: 'transform',
      values: [transforms[0], ...transforms, transforms[FLIP_STEPS]],
      times: [0, ...times, 1],
      eases: 'linear',
    },
    {
      property: 'opacity',
      values: [0, 0, 1, 1],
      times: [0, start, start + 0.0016, 1],
      eases: 'linear',
    },
    {
      property: 'backgroundColor',
      values: [from, from, to, to],
      times: [0, start + 0.0282, start + 0.0283, 1],
      eases: 'linear',
    },
  ];
}

/** Zoom-in of the top cube: `hold` keeps 8.19× until that point. */
function zoomTracks(end: number, hold?: number): Track[] {
  const zoom = 'scale(8.187019)';
  return [
    hold
      ? {
          property: 'transform',
          values: [zoom, zoom, 'scale(1)', 'scale(1)'],
          times: [0, hold, end, 1],
          eases: [ease.sine, ease.quintOut, ease.linear],
        }
      : {
          property: 'transform',
          values: [zoom, 'scale(1)', 'scale(1)'],
          times: [0, end, 1],
          eases: [ease.quintOut, ease.linear],
        },
  ];
}

type Layer = {
  id: string;
  face: Face;
  mask: string;
  /** Inset (top right bottom left) in % of the 736×408 panel. */
  inset: string;
  origin?: string;
  tracks: Track[];
};

const BLUE = COLORS.blue;
const BLACK = '#000000';
const WHITE = '#ffffff';

// Pivots shared by the flipping faces (px within each face box).
const P_LOWER: [number, number] = [22.475, -12.975];
const P_UPPER: [number, number] = [22.475, 12.977];
const P_WHITE: [number, number] = [22.474, 12.975];
const P_BLUE_LEFT: [number, number] = [67.424, 12.976];
const P_BLUE_RIGHT: [number, number] = [22.475, 12.976];

/** Faces of a dealt cube: `lead` is when its blue top starts flipping. */
type DealtCube = {
  id: string;
  insets: Record<Face, string>;
  masks?: Partial<Record<Face, string>>;
  /** Left-hand cubes slide their top in from the upper right, right-hand from the upper left. */
  hand: 1 | -1;
  starts: Record<Face, number>;
  slide: [number, number];
};

const dealt: DealtCube[] = [
  {
    id: '150:490', // row 2, left
    hand: 1,
    slide: [3.999947, -5.001921],
    starts: {lower: 0.2907, blue: 0.2026, upper: 0.2907, white: 0.2731},
    insets: {
      lower: '50% 56.66% 37.28% 37.24%',
      blue: '37.28% 50.55% 50% 37.24%',
      upper: '43.64% 56.66% 43.64% 37.24%',
      white: '43.64% 50.55% 37.28% 43.34%',
    },
  },
  {
    id: '150:510', // row 2, right
    hand: -1,
    slide: [-3.999947, -5.001921],
    starts: {lower: 0.2784, blue: 0.1903, upper: 0.2784, white: 0.2608},
    insets: {
      lower: '50% 43.36% 37.28% 50.54%',
      blue: '37.28% 37.25% 50% 50.54%',
      upper: '43.64% 43.36% 43.64% 50.54%',
      white: '43.64% 37.25% 37.28% 56.64%',
    },
  },
  {
    id: '150:530', // row 3, left
    hand: 1,
    slide: [3.999947, -4.998014],
    starts: {lower: 0.4546, blue: 0.3665, upper: 0.4546, white: 0.437},
    insets: {
      lower: '70.31% 63.31% 16.97% 30.58%',
      blue: '57.59% 57.2% 29.69% 30.58%',
      upper: '63.95% 63.31% 23.33% 30.58%',
      white: '63.95% 57.2% 16.97% 36.69%',
    },
  },
  {
    id: '150:550', // row 3, center
    hand: -1,
    slide: [-3.999947, -4.998014],
    starts: {lower: 0.467, blue: 0.3789, upper: 0.467, white: 0.4493},
    insets: {
      lower: '70.31% 50.01% 16.97% 43.89%',
      blue: '57.59% 43.9% 29.69% 43.89%',
      upper: '63.95% 50.01% 23.33% 43.89%',
      white: '63.95% 43.9% 16.97% 49.99%',
    },
  },
  {
    id: '150:570', // row 3, right
    hand: -1,
    slide: [-3.999947, -4.998014],
    starts: {lower: 0.4793, blue: 0.3912, upper: 0.4793, white: 0.4617},
    masks: {lower: 'cube-6-lower.svg', upper: 'cube-6-upper.svg', white: 'cube-6-white.svg'},
    insets: {
      lower: '70.31% 36.71% 16.97% 57.19%',
      blue: '57.59% 30.6% 29.69% 57.19%',
      upper: '63.95% 36.71% 23.33% 57.19%',
      white: '63.95% 30.6% 16.97% 63.29%',
    },
  },
];

const FACES: Face[] = ['lower', 'blue', 'upper', 'white'];

function dealtLayers(cube: DealtCube): Layer[] {
  const flips: Record<Face, Flip> = {
    lower: {start: cube.starts.lower, pivot: P_LOWER, hand: 1, from: BLUE},
    upper: {start: cube.starts.upper, pivot: P_UPPER, hand: 1, from: BLUE},
    white: {start: cube.starts.white, pivot: P_WHITE, hand: -1, from: BLUE},
    blue: {
      start: cube.starts.blue,
      pivot: cube.hand === 1 ? P_BLUE_LEFT : P_BLUE_RIGHT,
      hand: cube.hand,
      // The top shows the color of the side it flips over from.
      from: cube.hand === 1 ? BLACK : WHITE,
      slide: cube.slide,
    },
  };
  return FACES.map((face) => ({
    id: `${cube.id}-${face}`,
    face,
    mask: cube.masks?.[face] ?? `cube-${face}.svg`,
    inset: cube.insets[face],
    origin: '0 0',
    tracks: flipTracks(flips[face], COLORS[face]),
  }));
}

const layers: Layer[] = [
  // Top cube (147:491) zooms in
  {id: '147:493', face: 'lower', mask: 'cube-main-lower.svg', inset: '29.69% 50.01% 57.59% 43.89%', origin: '99.999% -0.001%', tracks: zoomTracks(0.1233)},
  {id: '147:494', face: 'blue', mask: 'cube-main-blue.svg', inset: '16.97% 43.9% 57.59% 43.89%', origin: '50% 50.001%', tracks: zoomTracks(0.1339, 0.0106)},
  {id: '147:495', face: 'upper', mask: 'cube-main-upper.svg', inset: '23.33% 50.01% 63.95% 43.89%', origin: '99.999% 50.002%', tracks: zoomTracks(0.1233)},
  {id: '147:496', face: 'white', mask: 'cube-main-white.svg', inset: '23.33% 43.9% 57.59% 49.99%', origin: '-0.001% 33.332%', tracks: zoomTracks(0.1445, 0.0211)},
  ...dealt.flatMap(dealtLayers),
];

const tracks = Object.fromEntries(layers.map((layer) => [layer.id, layer.tracks]));

export default function ModelCubes(): ReactNode {
  const base = useBaseUrl('/img/landing/whats-new/');
  const root = useTimeline(tracks);
  return (
    <div className={styles.panel} aria-hidden="true">
      <div ref={root} className={`${styles.stage} ${styles.perspective} ${styles.centered}`}>
        {layers.map(({id, face, mask, inset, origin}) => (
          <div
            key={id}
            data-track={id}
            className={styles.face}
            style={
              {
                inset,
                transformOrigin: origin,
                backgroundColor: COLORS[face],
                '--mask': `url("${base}${mask}")`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
