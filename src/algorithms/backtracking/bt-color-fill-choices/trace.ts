import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominoTiling } from './impl.ts';
export const DEFAULT_N = 4;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2×' + n + ' 多米诺', en: '2x' + n + ' domino' }).commit();
  const c = dominoTiling(n, {
    onPlace: (col, vertical) =>
      rec
        .begin({
          zh: '列 ' + col + (vertical ? ' 竖放' : ' 横放'),
          en: 'col ' + col + (vertical ? ' V' : ' H'),
        })
        .setAux([{ label: 'col', value: String(col), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + c + ' 种', en: c + ' ways' })
    .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
