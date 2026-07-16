import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthSmallest, type KthHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 10, 4, 3, 20, 15];
export const DEFAULT_K = 3;

export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  rec
    .begin({ zh: `排序后取第 ${k} 小`, en: `Sort and take the ${k}-th smallest` })
    .setBars(rec.barsFrom(sorted))
    .commit();
  const hooks: KthHooks = {
    onPick: (value) => {
      const idx = sorted.indexOf(value);
      const roles: Record<number, BarRole> = { [idx]: 'final' };
      rec
        .begin({ zh: `第 ${k} 小 = ${value}`, en: `${k}-th smallest = ${value}` })
        .setBars(rec.barsFrom(sorted, roles))
        .commit();
    },
  };
  kthSmallest(input, k, hooks);
  return rec.build();
}
