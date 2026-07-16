import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapSortTernary, type HeapTernaryHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: HeapTernaryHooks = {
    onExtract: (k, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let i = k; i < arr.length; i++) roles[i] = 'sorted';
      rec
        .begin({ zh: `取出最大值到位置 ${k}`, en: `Extract max to ${k}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = heapSortTernary(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
