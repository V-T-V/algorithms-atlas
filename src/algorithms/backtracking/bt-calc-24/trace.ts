import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { judgePoint24 } from './impl.ts';
export const DEFAULT_INPUT = [4, 1, 8, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '24点 [' + input.join(',') + ']', en: '24 game' }).commit();
  let steps = 0;
  const ok = judgePoint24(input, {
    onMerge: (a, b, r) => {
      steps++;
      if (steps <= 10)
        rec
          .begin({
            zh: a + ' 与 ' + b + ' → ' + r.toFixed(2),
            en: a + ',' + b + ' → ' + r.toFixed(2),
          })
          .setAux([{ label: 'r', value: r.toFixed(2), role: 'pivot' as BarRole }])
          .commit();
    },
  });
  rec
    .begin({ zh: '能得 24？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
