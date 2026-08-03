// Dynamic Convex Hull (Incremental) · 公共入口（懒加载）

import type { Demo } from '../../../types.ts';

export { meta } from './meta.ts';
export { DynamicConvexHull, type Point, type DynamicHullHooks } from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
