// Polygon Union Area · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  polygonUnionArea,
  sumAreas,
  pointInPolygon,
  polygonArea,
  unionBoundingBox,
  mulberry32,
  type Point,
  type Rng,
  type PolygonUnionHooks,
  type UnionAreaResult,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
