// All Segment Intersections (Bentley-Ottmann) · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  findAllIntersections,
  type Point,
  type Segment,
  type Intersection,
  type AllIntersectHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
