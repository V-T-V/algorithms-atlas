import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstMax } from './impl.ts';
export const DEFAULT_INPUT = [50, 30, 70, 60, 80];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input);
  rec.begin({ zh: 'BST 最大值', en: 'BST maximum' }).commit();
  const v = bstMax(root, {
    onVisit: (val) =>
      rec
        .begin({ zh: '经过 ' + val, en: 'pass ' + val })
        .setAux([{ label: 'node', value: String(val), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大 = ' + v, en: 'max = ' + v })
    .setAux([{ label: 'max', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
