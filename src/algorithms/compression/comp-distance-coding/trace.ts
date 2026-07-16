import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { distanceCoding } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 1, 3, 2, 1, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '距离编码', en: 'Distance Coding' }).commit();
  const out = distanceCoding(input, {
    onEmit: (s, d) =>
      rec
        .begin({ zh: '符号 ' + s + ' 距离 ' + d, en: 'sym ' + s })
        .setAux([
          { label: 'sym', value: String(s), role: 'compare' as BarRole },
          { label: 'dist', value: String(d), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
