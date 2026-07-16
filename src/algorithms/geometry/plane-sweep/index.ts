// Plane Sweep (General Framework) · 公共入口

export { meta } from './meta.ts';
export {
  sweepIntervalUnion,
  sweepRectUnionArea,
  type Interval,
  type Rect,
  type PlaneSweepHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
