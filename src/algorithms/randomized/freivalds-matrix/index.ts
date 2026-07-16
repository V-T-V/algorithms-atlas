// Freivalds' Matrix Verification · 公共入口

export { meta } from './meta.ts';
export {
  freivaldsVerify,
  matVec,
  matMul,
  makeBitRng,
  type Rng,
  type Matrix,
  type FreivaldsHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
