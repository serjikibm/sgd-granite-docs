// SPDX-License-Identifier: Apache-2.0
import {useEffect, useRef} from 'react';

/**
 * Shared timeline for the "Explore what's new" panels (Figma node 140:8631):
 * every animated layer loops on one 11.35s timeline.
 */
export const DURATION = 11350;

export const ease = {
  linear: 'linear',
  out: 'cubic-bezier(0, 0, 0.58, 1)', // motion.dev "easeOut"
  inOut: 'cubic-bezier(0.42, 0, 0.58, 1)', // motion.dev "easeInOut"
  quintOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  sine: 'cubic-bezier(0.5, 0, 0.5, 1)',
};

/** One property's track: values at `times` (0–1), `eases[i]` runs from i to i+1. */
export type Track = {
  property: 'transform' | 'opacity' | 'backgroundColor';
  values: (string | number)[];
  times: number[];
  eases: string | string[];
};

function toKeyframes({property, values, times, eases}: Track): Keyframe[] {
  return values.map((value, i) => ({
    offset: times[i],
    [property]: value,
    easing: typeof eases === 'string' ? eases : (eases[i] ?? 'linear'),
  }));
}

/**
 * Starts every track on its element in lockstep. Each element's tracks are
 * keyed by its `data-track` attribute. Under `prefers-reduced-motion` nothing
 * runs and the server-rendered resting state stays on screen.
 */
export function useTimeline(tracks: Record<string, Track[]>) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof el.animate !== 'function') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const animations: Animation[] = [];
    el.querySelectorAll<HTMLElement>('[data-track]').forEach((node) => {
      for (const track of tracks[node.dataset.track!] ?? []) {
        animations.push(
          node.animate(toKeyframes(track), {
            duration: DURATION,
            iterations: Infinity,
          }),
        );
      }
    });
    const start = document.timeline.currentTime;
    animations.forEach((animation) => {
      animation.startTime = start;
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [tracks]);
  return root;
}
