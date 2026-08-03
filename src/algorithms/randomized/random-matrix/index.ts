// Random Matrix Generation · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
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
