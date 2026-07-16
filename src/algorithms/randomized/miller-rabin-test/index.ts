// Miller-Rabin Randomized Primality Test · 公共入口

export { meta } from './meta.ts';
export {
  millerRabin,
  modPow,
  makeRng,
  DETERMINISTIC_BASES,
  type Rng,
  type MillerRabinHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
