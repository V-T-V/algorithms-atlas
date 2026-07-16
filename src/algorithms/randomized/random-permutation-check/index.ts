// Random Permutation Generation & Verification · 公共入口

export { meta } from './meta.ts';
export {
  fisherYatesShuffle,
  verifyByCounting,
  verifyByFingerprint,
  generateAndVerify,
  makeRng,
  type Rng,
  type PermutationHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
