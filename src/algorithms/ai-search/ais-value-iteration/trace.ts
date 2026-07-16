// 价值迭代 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { valueIteration, greedyPolicy, type ValueIterHooks } from './impl.ts';
import type { Mdp } from '../ais-policy-iteration/impl.ts';

function makeMdp(): Mdp {
  return {
    states: [0, 1],
    actions: [0, 1],
    gamma: 0.9,
    transitions: {
      0: { 0: [[0, 1, 0]], 1: [[1, 1, 10]] },
      1: { 0: [[1, 1, 0]], 1: [[1, 1, 0]] },
    },
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const mdp = makeMdp();
  const labels = ['s0', 's1'];

  rec
    .begin({ zh: '价值迭代：初始 V=0', en: 'Value iteration: V=0' })
    .setBars([0, 0].map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: ValueIterHooks = {
    onSweep: (k, V, delta) => {
      rec
        .begin({
          zh: `第 ${k} 次扫描 Δ=${delta.toExponential(1)}`,
          en: `Sweep #${k} Δ=${delta.toExponential(1)}`,
        })
        .setBars(
          labels.map((_, i) => ({ value: Number(V[i]!.toFixed(3)), role: 'compare' as BarRole })),
        )
        .commit();
    },
  };

  const { V, k } = valueIteration(mdp, 1000, 1e-4, hooks);
  const policy = greedyPolicy(mdp, V);

  rec
    .begin({
      zh: `收敛于 ${k} 次扫描，π=[${policy}]`,
      en: `Converged in ${k} sweeps, π=[${policy}]`,
    })
    .setBars(labels.map((_, i) => ({ value: Number(V[i]!.toFixed(3)), role: 'final' as BarRole })))
    .setAux([{ label: 'optimal', value: `[${policy}]`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
