import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permuteUnique } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '全排列II [' + input.join(',') + ']', en: 'Permutations II' }).commit();
  permuteUnique(input, {
    onPick: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '选 ' + v, en: 'pick ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (p) =>
      rec
        .begin({ zh: p.join(''), en: p.join('') })
        .setBars(p.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
