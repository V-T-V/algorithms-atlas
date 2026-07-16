import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cbcEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 1) & 0xff);
export const DEFAULT_INPUT: any = {
  blocks: [
    [1, 2],
    [1, 2],
    [3, 4],
  ],
  iv: [0, 0],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CBC', en: 'CBC' }).commit();
  const ct = cbcEncrypt(input.blocks, input.iv, E, {
    onBlock: (i, x, o) =>
      rec
        .begin({ zh: '块' + i, en: 'block' })
        .setAux([
          { label: 'block', value: String(i), role: 'compare' as BarRole },
          { label: 'out', value: o.join(','), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 块', en: ct.length + ' blocks' })
    .setAux([{ label: 'blocks', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
