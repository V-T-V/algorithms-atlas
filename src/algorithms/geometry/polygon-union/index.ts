// Polygon Union Area · 公共入口

export { meta } from './meta.ts';
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
