import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coarseToFineSearch, type CfProblem } from './impl.ts';
const P: CfProblem = {
  domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  goal: 7,
  near: (a, b, res) => Math.abs(a - b) <= res,
  levels: 3,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: CfProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '粗到细', en: 'Coarse-to-Fine' }).commit();
  const best = coarseToFineSearch(input, {
    onLevel: (L, cs) =>
      rec
        .begin({ zh: '层' + L + ' 候选[' + cs.join(',') + ']', en: 'level ' + L })
        .setAux([
          { label: 'level', value: String(L), role: 'pivot' as BarRole },
          { label: 'cand', value: cs.join(','), role: 'compare' as BarRole },
        ])
        .commit(),
    onFound: (p) =>
      rec
        .begin({ zh: '找到 ' + p, en: 'found ' + p })
        .setAux([{ label: 'found', value: String(p), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '答案 ' + best, en: 'best ' + best })
    .setAux([{ label: 'best', value: String(best), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
