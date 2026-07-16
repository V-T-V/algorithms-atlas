// =============================================================================
// 单调队列 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowMax } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, -1, -3, 5, 3, 6, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const k = 3;
  const result = slidingWindowMax(input, k, {
    onWindow: (l, r, maxVal) => {
      rec
        .begin({
          zh: `窗口 [${l},${r}] 最大 = ${maxVal}`,
          en: `Window [${l},${r}] max = ${maxVal}`,
        })
        .setBars(
          input.map((x, i) => ({
            value: x,
            role: i >= l && i <= r ? 'compare' : 'default',
          })),
        )
        .setAux([
          { label: 'window', value: `[${l},${r}]`, role: 'frontier' },
          { label: 'max', value: String(maxVal), role: 'pivot' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `结果 = [${result.join(',')}]`, en: `Result = [${result.join(',')}]` })
    .setBars(input.map((x) => ({ value: x, role: 'final' })))
    .setAux([{ label: 'result', value: `[${result.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
