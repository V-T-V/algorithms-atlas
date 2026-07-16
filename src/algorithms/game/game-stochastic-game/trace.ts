// 随机博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStochasticGame } from './impl.ts';
export const DEFAULT_INPUT = {
  A: [
    [2, 0],
    [0, 1],
  ],
  gamma: 0.9,
};
export function buildTrace(input: { A?: number[][]; gamma?: number } = {}): Frame[] {
  const { A = DEFAULT_INPUT.A, gamma = DEFAULT_INPUT.gamma } = input;
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: '随机博弈：单状态自环值迭代',
      en: 'Stochastic game: single-state self-loop value iteration',
    })
    .setAux([{ label: 'γ', value: String(gamma), role: 'pivot' as BarRole }])
    .commit();
  const r = gameStochasticGame(A, gamma, 50, 1e-6, {
    onIter: (it, V) => {
      rec
        .begin({ zh: `迭代 ${it}：V=${V.toFixed(6)}`, en: `Iter ${it}: V=${V.toFixed(6)}` })
        .setAux([{ label: 'V', value: V.toFixed(6), role: 'compare' as BarRole }])
        .commit();
    },
  });
  rec
    .begin({
      zh: `收敛 V*=${r.value.toFixed(6)}（${r.iterations} 步）`,
      en: `Converged V*=${r.value.toFixed(6)} in ${r.iterations} steps`,
    })
    .setAux([{ label: 'V*', value: r.value.toFixed(6), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
