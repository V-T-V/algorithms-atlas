// Randomized Bipartite Matching · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  greedyMatching,
  augmentMatching,
  findAugmentPath,
  shuffle,
  makeRng,
  makeSampleGraph,
  maxMatchingExact,
  type BipartiteGraph,
  type MatchEdge,
  type Matching,
  type GreedyHooks,
  type AugmentHooks,
  type Rng,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
