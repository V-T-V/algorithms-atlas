import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { meansEndAnalysis, type MeaProblem } from './impl.ts';
const P: MeaProblem = {
  start: [0, 0],
  goal: [3, 3],
  ops: [
    {
      name: 'A+1',
      diff: (s, g) => Math.abs(s[0]! + 1 - g[0]!) + Math.abs(s[1]! - g[1]!),
      apply: (s) => [s[0]! + 1, s[1]!],
    },
    {
      name: 'B+1',
      diff: (s, g) => Math.abs(s[0]! - g[0]!) + Math.abs(s[1]! + 1 - g[1]!),
      apply: (s) => [s[0]!, s[1]! + 1],
    },
  ],
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: MeaProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '手段-目的分析', en: 'MEA' }).commit();
  const plan = meansEndAnalysis(input, {
    onOp: (op) =>
      rec
        .begin({ zh: '选算子 ' + op, en: 'op ' + op })
        .setAux([{ label: 'op', value: op, role: 'pivot' as BarRole }])
        .commit(),
    onApply: (op, st) =>
      rec
        .begin({ zh: '应用 ' + op + ' -> [' + st.join(',') + ']', en: 'apply' })
        .setAux([{ label: 'state', value: '[' + st.join(',') + ']', role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '计划 ' + plan.join('->'), en: 'plan ' + plan.join('->') })
    .setAux([{ label: 'plan', value: plan.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
