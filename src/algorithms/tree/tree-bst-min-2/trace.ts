import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstMin } from './impl.ts';
export const DEFAULT_INPUT = [50, 30, 70, 20, 40];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input);
  rec.begin({ zh: 'BST 最小值', en: 'BST minimum' }).commit();
  const v = bstMin(root, {
    onVisit: (val) =>
      rec
        .begin({ zh: '经过 ' + val, en: 'pass ' + val })
        .setAux([{ label: 'node', value: String(val), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最小 = ' + v, en: 'min = ' + v })
    .setAux([{ label: 'min', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
