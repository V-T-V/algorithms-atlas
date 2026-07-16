import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingSortOffset, type CountingOffsetHooks } from './impl.ts';

export const DEFAULT_INPUT = [-3, 5, -1, 0, 5, 2, -3, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `初始（含负数）：${input.join(', ')}`,
      en: `Initial (with negatives): ${input.join(', ')}`,
    })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: CountingOffsetHooks = {
    onCount: (count) => {
      rec
        .begin({ zh: `计数桶：[${count.join(',')}]`, en: `Count buckets: [${count.join(',')}]` })
        .setAux(count.map((c, i) => ({ label: `b${i}`, value: String(c) })))
        .commit();
    },
  };
  const result = countingSortOffset(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
