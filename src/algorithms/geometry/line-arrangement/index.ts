// Line Arrangement · 公共入口

export { meta } from './meta.ts';
export {
  lineArrangement,
  intersectLines,
  type Point,
  type Line,
  type LineArrangementHooks,
  type LineArrangementResult,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
