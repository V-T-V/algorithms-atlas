// Farthest Pair (Rotating Calipers) · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  farthestPair,
  convexHull,
  dist,
  type Point,
  type FarthestPairHooks,
  type FarthestPairResult,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
