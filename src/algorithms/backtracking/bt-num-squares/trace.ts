import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numSquares } from './impl.ts';
export const DEFAULT_N = 12;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拆 ' + n + ' 为平方和', en: 'Squares of ' + n }).commit();
  const m = numSquares(n, {
    onTry: (sq, cnt) =>
      rec
        .begin({ zh: '试 ' + sq + ' (第 ' + cnt + ' 个)', en: 'try ' + sq })
        .setAux([{ label: 'sq', value: String(sq), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最少 = ' + m, en: 'min = ' + m })
    .setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
