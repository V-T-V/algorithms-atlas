import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minConflicts, type McProblem } from './impl.ts';
const P: McProblem = {
  n: 3,
  domain: [0, 1, 2],
  conflicts: (a, i, v) => {
    let c = 0;
    for (let k = 0; k < a.length; k++) if (k !== i && a[k] === v) c++;
    return c;
  },
  rand: () => 0,
};
export const DEFAULT_INPUT = { p: P, init: [0, 0, 0] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Min-Conflicts', en: 'Min-Conflicts' }).commit();
  const r = minConflicts(input.p, 50, input.init, {
    onStep: (i, v, c) =>
      rec
        .begin({ zh: 'x' + i + '=' + v + ' 冲突' + c, en: 'x' + i + '=' + v })
        .setAux([
          { label: 'var', value: 'x' + i, role: 'compare' as BarRole },
          { label: 'conf', value: String(c), role: 'pivot' as BarRole },
        ])
        .commit(),
    onSolved: (a) =>
      rec
        .begin({ zh: '求解 ' + a.join(','), en: 'solved' })
        .setAux([{ label: 'sol', value: a.join(','), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: r ? '成功' : '超时', en: r ? 'ok' : 'timeout' })
    .setAux([{ label: 'result', value: r ? r.join(',') : 'none', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
