// Monte Carlo Integration · 公共入口

export { meta } from './meta.ts';
export {
  monteCarloIntegrate,
  mulberry32,
  type Rng,
  type SamplePoint,
  type MonteCarloIntegralHooks,
  type MonteCarloIntegralResult,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
