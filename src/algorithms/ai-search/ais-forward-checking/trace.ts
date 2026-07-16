import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { forwardChecking, type FcProblem } from './impl.ts';
const P: FcProblem = {
  n: 3,
  domain: [0, 1, 2],
  edges: [
    [0, 1],
    [1, 2],
    [0, 2],
  ],
  conflict: (i, vi, j, vj) => vi === vj,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: FcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前向检查', en: 'Forward Checking' }).commit();
  const r = forwardChecking(input, {
    onAssign: (i, v) =>
      rec
        .begin({ zh: 'x' + i + '=' + v, en: 'x' + i + '=' + v })
        .setAux([{ label: 'var', value: 'x' + i, role: 'compare' as BarRole }])
        .commit(),
    onPrune: (j, w) =>
      rec
        .begin({ zh: '剪 x' + j + '!=' + w, en: 'prune' })
        .setAux([{ label: 'pruned', value: 'x' + j + '!=' + w, role: 'warn' as BarRole }])
        .commit(),
    onFound: (a) =>
      rec
        .begin({ zh: '解 ' + a.join(','), en: 'sol' })
        .setAux([{ label: 'sol', value: a.join(','), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: r ? '成功' : '无解', en: r ? 'ok' : 'fail' })
    .setAux([{ label: 'result', value: r ? r.join(',') : 'none', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
