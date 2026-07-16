import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapSort4ary, type Heap4Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let sorted = 0;
  const hooks: Heap4Hooks = {
    onSiftDown: (_root, end, arr) => {
      sorted = arr.length - end;
      const roles: Record<number, BarRole> = {};
      for (let k = arr.length - sorted; k < arr.length; k++) roles[k] = 'sorted';
      rec
        .begin({ zh: `取出最大值，剩余 ${end} 个重新下沉`, en: `Pop max, sift-down ${end} left` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = heapSort4ary(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
