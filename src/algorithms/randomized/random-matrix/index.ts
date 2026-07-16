// Random Matrix Generation · 公共入口

export { meta } from './meta.ts';
export {
  randomUniformMatrix,
  randomBernoulliMatrix,
  randomGaussianMatrix,
  matVec,
  matMul,
  transpose,
  freivaldsCheck,
  makeRng,
  type Rng,
  type Matrix,
  type RandomMatrixHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
