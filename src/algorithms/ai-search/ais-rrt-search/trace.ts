import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rrtSearch, type RrtProblem } from './impl.ts';
const P: RrtProblem = {
  start: [0, 0],
  goal: [9, 9],
  sample: () => [Math.random() * 10, Math.random() * 10],
  step: 1,
  threshold: 1.5,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: RrtProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RRT', en: 'RRT' }).commit();
  const path = rrtSearch(input, 40, {
    onSample: (x, y) =>
      rec
        .begin({ zh: '采样 (' + x.toFixed(1) + ',' + y.toFixed(1) + ')', en: 'sample' })
        .setAux([
          {
            label: 'sample',
            value: '(' + x.toFixed(1) + ',' + y.toFixed(1) + ')',
            role: 'compare' as BarRole,
          },
        ])
        .commit(),
    onExtend: (f, t) =>
      rec
        .begin({ zh: '扩展 ' + f + '->' + t, en: 'extend' })
        .setAux([{ label: 'extend', value: f + '->' + t, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径长 ' + path.length, en: 'len ' + path.length })
    .setAux([{ label: 'len', value: String(path.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
