import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';
export { baseballElimination, findAllEliminated } from './impl.ts';
export type { BaseballTeam, BaseballInput, BaseballResult, BaseballHooks } from './impl.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
