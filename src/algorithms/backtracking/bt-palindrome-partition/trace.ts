import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partition } from './impl.ts';
export const DEFAULT_S = 'aab';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '分割 "' + s + '"', en: 'Partition "' + s + '"' }).commit();
  partition(s, {
    onCut: (sub) => {
      cur.push(sub);
      rec
        .begin({ zh: '切 "' + sub + '"', en: 'cut "' + sub + '"' })
        .setBars(cur.map((x, i) => ({ value: x.length, role: 'pivot' as BarRole, label: x })))
        .commit();
    },
    onResult: (p) =>
      rec
        .begin({ zh: p.join('|'), en: p.join('|') })
        .setBars(p.map((x) => ({ value: x.length, role: 'final' as BarRole, label: x })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
