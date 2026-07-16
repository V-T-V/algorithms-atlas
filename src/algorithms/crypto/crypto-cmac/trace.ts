import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cmacCompute } from './impl.ts';
const E = (b: number[]) => b.map((x) => (x + 7) & 0xff);
export const DEFAULT_INPUT: any = {
  blocks: [
    [1, 2],
    [3, 4],
  ],
  k1: [1, 1],
  k2: [2, 2],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CMAC', en: 'CMAC' }).commit();
  const tag = cmacCompute(input.blocks, E, input.k1, input.k2, {
    onBlock: (i) =>
      rec
        .begin({ zh: '块 ' + i, en: 'block' })
        .setAux([{ label: 'block', value: String(i), role: 'compare' as BarRole }])
        .commit(),
    onTag: (t) =>
      rec
        .begin({ zh: 'tag [' + t.join(',') + ']', en: 'tag' })
        .setAux([{ label: 'tag', value: t.join(','), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
