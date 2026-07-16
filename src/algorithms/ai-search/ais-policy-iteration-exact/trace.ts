import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { policyIterationExact, type PiMdp } from './impl.ts';
const M: PiMdp = {
  states: [0, 1],
  actions: [0, 1],
  gamma: 0.9,
  theta: 1e-3,
  trans: (s, a) =>
    s === 0 ? [{ to: a, prob: 1, reward: a === 1 ? 1 : 0 }] : [{ to: 1, prob: 1, reward: 0 }],
};
export const DEFAULT_INPUT = M;
export function buildTrace(input: PiMdp = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '策略迭代', en: 'Policy Iteration' }).commit();
  const policy = policyIterationExact(input, {
    onImprove: (p) =>
      rec
        .begin({ zh: '策略 [' + p.join(',') + ']', en: 'policy' })
        .setAux([{ label: 'policy', value: p.join(','), role: 'compare' as BarRole }])
        .commit(),
    onEval: (it, V) =>
      rec
        .begin({
          zh: '评估#' + it + ' V=[' + V.map((v) => v.toFixed(2)).join(',') + ']',
          en: 'eval',
        })
        .setAux([{ label: 'iter', value: String(it), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最终策略 [' + policy.join(',') + ']', en: 'final' })
    .setAux([{ label: 'policy', value: policy.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
