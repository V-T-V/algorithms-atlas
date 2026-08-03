// Schwartz-Zippel Polynomial Identity Testing · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  schwartzZippelProduct,
  schwartzZippelUnivariate,
  evalPoly,
  evalProductPoly,
  makeRng,
  type Rng,
  type SchwartzZippelHooks,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
