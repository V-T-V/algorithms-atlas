import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';
export { intervalScheduling, greedyReference } from './impl.ts';
export type { IntervalInput, IsnEdge, IsnHooks } from './impl.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
