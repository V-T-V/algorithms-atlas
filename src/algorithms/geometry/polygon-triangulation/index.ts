// Polygon Triangulation (Ear Clipping) · 公共入口

export { meta } from './meta.ts';
export { triangulate, type Point, type Triangle, type TriangulationHooks } from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
