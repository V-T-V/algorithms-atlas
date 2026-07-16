import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countArrangement } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '美丽排列 n=' + n, en: 'Beautiful arrangement n=' + n }).commit();
  countArrangement(n, {
    onPlace: (pos, v) => {
      cur[pos - 1] = v;
      rec
        .begin({ zh: '位 ' + pos + ' 放 ' + v, en: 'pos ' + pos + ' = ' + v })
        .setBars(cur.slice(0, pos).map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
