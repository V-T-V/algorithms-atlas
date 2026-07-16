// Schwartz-Zippel Polynomial Identity Testing · 公共入口

export { meta } from './meta.ts';
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
