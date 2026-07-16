import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pancakeSortMin, type PancakeMinHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: PancakeMinHooks = {
    onFlip: (k, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let i = 0; i <= k; i++) roles[i] = 'swap';
      rec
        .begin({ zh: `反转前 ${k + 1} 个`, en: `Flip first ${k + 1}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = pancakeSortMin(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
