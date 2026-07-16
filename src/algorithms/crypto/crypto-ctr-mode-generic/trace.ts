import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctrEncrypt } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x * 7 + 3) & 0xff);
export const DEFAULT_INPUT: any = {
  blocks: [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  nonce: [1, 2],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CTR', en: 'CTR' }).commit();
  const ct = ctrEncrypt(input.blocks, input.nonce, E, {
    onBlock: (i, ctr, o) =>
      rec
        .begin({ zh: '块' + i + ' ctr=[' + ctr.join(',') + ']', en: 'block' })
        .setAux([
          { label: 'ctr', value: ctr.join(','), role: 'pivot' as BarRole },
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
