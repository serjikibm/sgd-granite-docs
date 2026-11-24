// SPDX-License-Identifier: Apache-2.0
import {blogCategories, type BlogCategory} from './categoryList';

export {blogCategories, type BlogCategory};

/**
 * Carbon color families used for blog categories: the label color on cards
 * and the palette of the generated cover art.
 * https://carbondesignsystem.com/elements/color/overview/
 */
export type BlogHue = BlogCategory['hue'];

/** Shades 20 → 70 of each Carbon family. */
export const hueShades: Record<BlogHue, string[]> = {
  blue: ['#d0e2ff', '#a6c8ff', '#78a9ff', '#4589ff', '#0f62fe', '#0043ce'],
  purple: ['#e8daff', '#d4bbff', '#be95ff', '#a56eff', '#8a3ffc', '#6929c4'],
  teal: ['#9ef0f0', '#3ddbd9', '#08bdba', '#009d9a', '#007d79', '#005d5d'],
  cyan: ['#bae6ff', '#82cfff', '#33b1ff', '#1192e8', '#0072c3', '#00539a'],
  magenta: ['#ffd6e8', '#ffafd2', '#ff7eb6', '#ee5396', '#d02670', '#9f1853'],
  green: ['#a7f0ba', '#6fdc8c', '#42be65', '#24a148', '#198038', '#0e6027'],
};

export function getCategory(key: string | undefined): BlogCategory | undefined {
  return blogCategories.find((c) => c.key === key);
}

export function getCategoryHue(key: string | undefined): BlogHue {
  return getCategory(key)?.hue ?? 'blue';
}
