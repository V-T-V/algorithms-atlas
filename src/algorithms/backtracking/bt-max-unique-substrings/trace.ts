import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxUniqueSplit } from './impl.ts';
export const DEFAULT_S = 'ababccc';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '"' + s + '" 最大唯一拆分', en: 'Max split of "' + s + '"' }).commit();
  maxUniqueSplit(s, {
    onCut: (sub) => {
      cur.push(sub);
      rec
        .begin({ zh: '切 "' + sub + '"', en: 'cut "' + sub + '"' })
        .setBars(cur.map((x, i) => ({ value: x.length, role: 'pivot' as BarRole, label: x })))
        .commit();
    },
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
