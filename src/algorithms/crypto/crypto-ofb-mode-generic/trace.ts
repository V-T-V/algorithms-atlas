import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ofbEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x * 5 + 2) & 0xff);
export const DEFAULT_INPUT: any = {
  blocks: [
    [1, 2],
    [3, 4],
  ],
  iv: [7, 7],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'OFB', en: 'OFB' }).commit();
  const ct = ofbEncrypt(input.blocks, input.iv, E, {
    onBlock: (i, ks, o) =>
      rec
        .begin({ zh: '块' + i, en: 'block' })
        .setAux([
          { label: 'ks', value: ks.join(','), role: 'pivot' as BarRole },
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
