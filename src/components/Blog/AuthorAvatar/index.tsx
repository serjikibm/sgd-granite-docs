// SPDX-License-Identifier: Apache-2.0
import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import {hueShades} from '../categories';
import {hashString} from '../utils';
import styles from './styles.module.css';

const hues = Object.values(hueShades);

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1]![0] : '';
  return (first + last).toUpperCase();
}

/**
 * Round author photo; falls back to initials on a Carbon color when the
 * author has no image.
 */
export default function AuthorAvatar({
  name,
  imageURL,
  size = 40,
  className,
}: {
  name?: string;
  imageURL?: string;
  size?: number;
  className?: string;
}): ReactNode {
  const style = {'--avatar-size': `${size / 16}rem`} as CSSProperties;
  if (imageURL) {
    return (
      <img
        className={clsx(styles.avatar, className)}
        style={style}
        src={imageURL}
        alt=""
        width={size}
        height={size}
      />
    );
  }
  const shades = hues[hashString(name ?? '') % hues.length]!;
  return (
    <span
      className={clsx(styles.avatar, styles.initials, className)}
      style={{...style, backgroundColor: shades[5]}}
      aria-hidden="true">
      {initials(name ?? '?')}
    </span>
  );
}
