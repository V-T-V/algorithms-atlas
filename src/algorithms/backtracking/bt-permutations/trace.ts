import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permutations } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '全排列 [' + input.join(',') + ']', en: 'Permutations' }).commit();
  const cur: number[] = [];
  permutations(input, {
    onPick: (i, v) => {
      cur[i] = v;
      rec
        .begin({ zh: '选 a[' + i + ']=' + v, en: 'pick ' + v })
        .setBars(cur.slice(0, i + 1).map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (p) =>
      rec
        .begin({ zh: '得到 ' + p.join(''), en: 'perm ' + p.join('') })
        .setBars(p.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
