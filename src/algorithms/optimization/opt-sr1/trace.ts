// =============================================================================
// SR1 对称秩一更新 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sr1, type SR1Hooks } from './impl.ts';

export const DEFAULT_INPUT = {
  f: (x: number[]): number => (x[0]! - 2) ** 2 + (x[1]! - 4) ** 2,
  g: (x: number[]): number[] => [2 * (x[0]! - 2), 2 * (x[1]! - 4)],
  x0: [0, 0],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { f, g, x0 } = input;

  rec
    .begin({
      zh: `SR1 拟牛顿最小化目标，初始 (${x0.join(',')})，目标 (2,4)。`,
      en: `SR1 quasi-Newton minimizing objective, init (${x0.join(',')}), target (2,4).`,
    })
    .setAux([
      { label: '初始点', value: `(${x0.join(',')})`, role: 'frontier' as BarRole },
      { label: '初始值', value: f(x0).toFixed(6), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: SR1Hooks = {
    onIter: (iter, x, grad, value, step) => {
      rec
        .begin({
          zh: `iter ${iter}：x=(${x.map((v) => v.toFixed(4)).join(',')}), f=${value.toFixed(6)}, 步长 ${step.toFixed(4)}`,
          en: `iter ${iter}: x=(${x.map((v) => v.toFixed(4)).join(',')}), f=${value.toFixed(6)}, step ${step.toFixed(4)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          {
            label: 'x',
            value: `(${x.map((v) => v.toFixed(4)).join(',')})`,
            role: 'compare' as BarRole,
          },
          { label: 'f', value: value.toFixed(6), role: 'final' as BarRole },
          { label: '|g|', value: norm(grad).toFixed(6), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onUpdate: (v, vy) => {
      rec
        .begin({
          zh: `SR1 秩一更新：vᵀy=${vy.toFixed(4)}`,
          en: `SR1 rank-one update: vᵀy=${vy.toFixed(4)}`,
        })
        .setAux([
          {
            label: 'v',
            value: `(${v.map((x) => x.toFixed(3)).join(',')})`,
            role: 'compare' as BarRole,
          },
          { label: 'vᵀy', value: vy.toFixed(6), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const result = sr1(f, g, x0, { maxIter: 100, tol: 1e-10 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=(${result.x.map((v) => v.toFixed(4)).join(',')}), f=${result.value.toFixed(8)}（${result.iterations} 步）`
        : `结束：x=(${result.x.map((v) => v.toFixed(4)).join(',')})`,
      en: result.converged
        ? `Converged: x=(${result.x.map((v) => v.toFixed(4)).join(',')}), f=${result.value.toFixed(8)} (${result.iterations} iters)`
        : `Stopped: x=(${result.x.map((v) => v.toFixed(4)).join(',')})`,
    })
    .setAux([
      {
        label: 'x',
        value: `(${result.x.map((v) => v.toFixed(6)).join(',')})`,
        role: 'final' as BarRole,
      },
      { label: 'f', value: result.value.toFixed(8), role: 'final' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

function norm(g: number[]): number {
  return Math.sqrt(g.reduce((s, v) => s + v * v, 0));
}
