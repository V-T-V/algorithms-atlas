import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixSortMsdDec, type RadixMsdHooks } from './impl.ts';

export const DEFAULT_INPUT = [170, 45, 75, 90, 802, 24, 2, 66];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: RadixMsdHooks = {
    onDigit: (digit, depth, arr) => {
      rec
        .begin({ zh: `深度 ${depth}，位 ${digit} 分桶`, en: `Depth ${depth}, digit ${digit}` })
        .setBars(rec.barsFrom(arr.length === input.length ? arr : input))
        .commit();
    },
  };
  const result = radixSortMsdDec(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
