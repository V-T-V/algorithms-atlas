import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flashSort2, type Flash2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Flash2Hooks = {
    onClassify: (i, b) => {
      rec
        .begin({ zh: `桶 ${i} 收到 ${b.length} 个`, en: `Bucket ${i}: ${b.length} items` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = flashSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
