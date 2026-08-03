// Point in Convex Polygon (Binary Search) · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export { pointInConvex, isPointInConvex, type Point, type PointInConvexHooks } from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
