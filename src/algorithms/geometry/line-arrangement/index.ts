// Line Arrangement · 公共入口

export { meta } from './meta.ts';

import type { Demo } from '../../../types.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
export {
  lineArrangement,
  intersectLines,
  type Point,
  type Line,
  type LineArrangementHooks,
  type LineArrangementResult,
} from './impl.ts';
export { buildTrace, DEFAULT_INPUT } from './trace.ts';
