// Merging Two Convex Hulls · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export { mergeConvexHulls, andrewMonotone, type Point, type MergeHullsHooks } from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
