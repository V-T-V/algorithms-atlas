// All Segment Intersections (Bentley-Ottmann) · 公共入口

export { meta } from './meta.ts';
export {
  findAllIntersections,
  type Point,
  type Segment,
  type Intersection,
  type AllIntersectHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
