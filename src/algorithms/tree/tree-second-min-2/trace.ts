import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, findSecondMinimumValue } from './impl.ts';
export const DEFAULT_INPUT = [2, 2, 5, null, null, 5, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '第二小值', en: 'Second minimum' }).commit();
  const v = findSecondMinimumValue(root, {
    onCand: (val) =>
      rec
        .begin({ zh: '候选 ' + val, en: 'candidate ' + val })
        .setAux([{ label: 'cand', value: String(val), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '第二小 = ' + v, en: 'second min = ' + v })
    .setAux([{ label: 'second', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
