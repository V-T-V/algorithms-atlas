// Randomized Hamiltonian Path · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  randomizedHamiltonianPath,
  hamiltonianPathBacktrack,
  makeAdjacency,
  makeRng,
  type Rng,
  type Adjacency,
  type HamiltonianHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
