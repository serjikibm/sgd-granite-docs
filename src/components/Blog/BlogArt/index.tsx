// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {getCategoryHue, hueShades} from '../categories';
import {hashString} from '../utils';
import styles from './styles.module.css';

/**
 * Generated cover art for posts without an `image`: a honeycomb (echoing the
 * landing page hero) with a cluster of cells lit in the category's color.
 * The layout is seeded by the post permalink, so it is stable across builds.
 */

const WIDTH = 320;
const HEIGHT = 180;
const R = 16; // hexagon circumradius
const HEX_W = Math.sqrt(3) * R;
const ROW_H = 1.5 * R;

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({length: 6}, (_, k) => {
    const angle = (Math.PI / 180) * (60 * k - 90);
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

type Cell = {points: string; fill?: string; stroke: string; opacity: number};

function buildArt(seed: string, category: string | undefined) {
  const random = mulberry32(hashString(seed));
  const shades = hueShades[getCategoryHue(category)];
  const focusX = WIDTH * (0.4 + random() * 0.45);
  const focusY = HEIGHT * (0.3 + random() * 0.4);
  const reach = 70 + random() * 50;

  const cells: Cell[] = [];
  for (let row = -1; row <= Math.ceil(HEIGHT / ROW_H) + 1; row++) {
    for (let col = -1; col <= Math.ceil(WIDTH / HEX_W) + 1; col++) {
      const cx = col * HEX_W + (row % 2 ? HEX_W / 2 : 0);
      const cy = row * ROW_H;
      const distance = Math.hypot(cx - focusX, cy - focusY) / reach;
      const value = 1 - distance + (random() - 0.5) * 0.7;
      const points = hexPoints(cx, cy, R - 1.5);
      if (value > 0.55) {
        // Brightest cells nearest the focus: shades 20–50.
        const shade = Math.min(3, Math.floor((1.2 - value) * 6));
        cells.push({
          points,
          fill: shades[Math.max(0, shade)],
          stroke: 'none',
          opacity: 0.55 + Math.min(0.45, value - 0.55),
        });
      } else if (value > 0.25) {
        cells.push({points, stroke: shades[3]!, opacity: 0.55});
      } else {
        cells.push({points, stroke: '#393939', opacity: 0.6});
      }
    }
  }
  return {cells, focusX, focusY, accent: shades[1]!};
}

export default function BlogArt({
  seed,
  category,
  className,
}: {
  seed: string;
  category?: string;
  className?: string;
}): ReactNode {
  const {cells, focusX, focusY, accent} = buildArt(seed, category);
  return (
    <svg
      className={clsx(styles.art, className)}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false">
      <rect width={WIDTH} height={HEIGHT} fill="#161616" />
      {cells.map((cell, i) => (
        <polygon
          key={i}
          points={cell.points}
          fill={cell.fill ?? 'none'}
          stroke={cell.stroke}
          strokeWidth={1}
          opacity={cell.opacity}
        />
      ))}
      <polygon
        points={hexPoints(focusX, focusY, R * 3.2)}
        fill="none"
        stroke={accent}
        strokeWidth={1.5}
      />
    </svg>
  );
}
