import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryInsertionSort2, type BinInsert2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: BinInsert2Hooks = {
    onInsert: (pos, value, arr) => {
      const roles: Record<number, BarRole> = { [pos]: 'swap' };
      for (let k = 0; k < pos; k++) roles[k] = 'sorted';
      rec
        .begin({
          zh: `二分定位 ${value} → 插入位置 ${pos}`,
          en: `Binary-find ${value} → insert at ${pos}`,
        })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = binaryInsertionSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
