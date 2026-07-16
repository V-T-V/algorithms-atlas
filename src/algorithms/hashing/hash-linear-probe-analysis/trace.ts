import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearProbingAnalysis } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [5, 21, 37, 53, 69, 13];
  rec.begin({ zh: '线性探查 size=16', en: 'Linear probing size=16' }).commit();
  const r = linearProbingAnalysis(16, keys, {
    onInsert: (k, p) =>
      rec
        .begin({ zh: `${k}: ${p} 次探查`, en: `${k}: ${p} probes` })
        .setBars([{ value: p, role: 'pivot' as BarRole }])
        .commit(),
    onConclude: (avg, th) =>
      rec
        .begin({
          zh: `实测${avg.toFixed(2)} 理论${th.toFixed(2)}`,
          en: `actual${avg.toFixed(2)} theory${th.toFixed(2)}`,
        })
        .setBars([
          { value: avg, role: 'final' as BarRole },
          { value: th, role: 'default' as BarRole },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
