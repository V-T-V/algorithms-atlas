import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { poly1305 } from './impl.ts';
export const DEFAULT_INPUT: any = {
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  r: 0x0000_0000_0000_0000_0000_0000_0000_0003n,
  s: 0n,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Poly1305', en: 'Poly1305' }).commit();
  const tag = poly1305(input.data, input.r, input.s, {
    onBlock: (i, a) =>
      rec
        .begin({ zh: '块 ' + i, en: 'block' })
        .setAux([
          { label: 'block', value: String(i), role: 'compare' as BarRole },
          { label: 'acc', value: a.toString(16), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'tag [' + tag.join(',') + ']', en: 'tag' })
    .setAux([{ label: 'tag', value: tag.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
