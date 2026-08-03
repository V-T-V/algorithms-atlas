// Randomized Skip List · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  SkipList,
  makeRng,
  type Rng,
  type SkipNode,
  type SkipListHooks,
  type SkipListOptions,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
