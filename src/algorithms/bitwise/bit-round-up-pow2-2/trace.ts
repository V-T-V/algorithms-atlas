import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alignUp } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [10, 8],
  [16, 8],
  [17, 16],
  [0, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '对齐到2的幂倍数', en: 'Align to power of two' }).commit();
  for (const [s, a] of input) {
    const r = alignUp(s, a, {
      onMask: (m) =>
        rec
          .begin({ zh: 'mask = ' + m, en: 'mask = ' + m })
          .setAux([{ label: 'mask', value: String(m), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'alignUp(' + s + ',' + a + ')=' + r, en: 'alignUp(' + s + ',' + a + ')=' + r })
      .setAux([{ label: 'aligned', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
