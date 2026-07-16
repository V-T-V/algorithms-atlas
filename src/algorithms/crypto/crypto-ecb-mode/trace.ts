import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ecbEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 1) & 0xff);
export const DEFAULT_INPUT: any = [
  [1, 2],
  [1, 2],
  [3, 4],
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'ECB', en: 'ECB' }).commit();
  const ct = ecbEncrypt(input, E, {
    onBlock: (i, _inp, out) =>
      rec
        .begin({ zh: '块' + i + ' -> [' + out.join(',') + ']', en: 'block' })
        .setAux([
          { label: 'block', value: String(i), role: 'compare' as BarRole },
          { label: 'out', value: out.join(','), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' })
    .setAux([{ label: 'blocks', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
