import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselect, type QuickselectHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 10, 4, 3, 20, 15];
export const DEFAULT_K = 3;

export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `在 [${input.join(',')}] 中找第 ${k} 小`,
      en: `Find ${k}-th smallest in [${input.join(',')}]`,
    })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: QuickselectHooks = {
    onPartition: (_pivotIdx, arr) => {
      rec
        .begin({ zh: `分区后：[${arr.join(',')}]`, en: `After partition: [${arr.join(',')}]` })
        .setBars(rec.barsFrom(arr))
        .commit();
    },
  };
  const r = quickselect(input, k, hooks);
  rec
    .begin({ zh: `第 ${k} 小 = ${r}`, en: `${k}-th smallest = ${r}` })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
