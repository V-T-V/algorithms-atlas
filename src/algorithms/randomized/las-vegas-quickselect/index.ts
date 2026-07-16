// Las Vegas Quickselect · 公共入口

export { meta } from './meta.ts';
export {
  quickselect,
  median,
  makeRng,
  makeSampleArray,
  estimatePivotSequenceLength,
  type QuickselectHooks,
  type Rng,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
