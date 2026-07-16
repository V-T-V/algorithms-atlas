// 策略迭代 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { policyIteration, type Mdp } from './impl.ts';

/** 链式 MDP：s0 选择留在原地(a=0,r=0)或走向 s1(a=1,r=0)；s1 任意动作都 r=1 自环。 */
function makeMdp(): Mdp {
  return {
    states: [0, 1],
    actions: [0, 1],
    gamma: 0.9,
    transitions: {
      0: { 0: [[0, 1, 0]], 1: [[1, 1, 0]] },
      1: { 0: [[1, 1, 1]], 1: [[1, 1, 1]] },
    },
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const mdp = makeMdp();
  const labels = ['s0', 's1'];

  rec
    .begin({ zh: '策略迭代：初始策略 π=[0,0]', en: 'Policy iteration: init π=[0,0]' })
    .setBars([0, 0].map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: 'π', value: '[0,0]', role: 'pivot' as BarRole }])
    .commit();

  let evalCount = 0;
  policyIteration(mdp, {
    onEvaluate: (V) => {
      evalCount++;
      rec
        .begin({ zh: `第 ${evalCount} 轮策略评估`, en: `Eval #${evalCount}` })
        .setBars(
          labels.map((_, i) => ({ value: Number(V[i]!.toFixed(3)), role: 'compare' as BarRole })),
        )
        .commit();
    },
    onImprove: (policy, changed) => {
      rec
        .begin({
          zh: `策略改进：变更 ${changed} 个，π=[${policy}]`,
          en: `Improve: ${changed} changed, π=[${policy}]`,
        })
        .setBars(labels.map(() => ({ value: 0, role: 'final' as BarRole })))
        .setAux([{ label: 'π', value: `[${policy}]`, role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: '收敛：π=[1,0] (s0 选移动到 s1)', en: 'Converged: π=[1,0]' })
    .setAux([{ label: 'optimal', value: 'π=[1,0]', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
