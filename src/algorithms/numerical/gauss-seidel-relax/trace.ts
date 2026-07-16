// =============================================================================
// 松弛 Gauss-Seidel · 录制帧序列
// 解 4×4 对角占优系统，对比不同 ω 的收敛速度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sor, type SorHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  A: [
    [4, -1, 0, 0],
    [-1, 4, -1, 0],
    [0, -1, 4, -1],
    [0, 0, -1, 3],
  ],
  b: [15, 10, 10, 10],
  omega: 1.5,
};

export function buildTrace(
  input: { A: number[][]; b: number[]; omega: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { A, b, omega } = input;
  const n = b.length;

  rec
    .begin({ zh: `解 ${n}×${n} 系统，ω = ${omega}`, en: `Solve ${n}×${n} system, ω = ${omega}` })
    .setAux([
      { label: '松弛 ω', value: String(omega), role: 'pivot' as BarRole },
      { label: '初值', value: '全 0', role: 'frontier' as BarRole },
    ])
    .commit();

  const hooks: SorHooks = {
    onIter: (iter, x, residual) => {
      rec
        .begin({
          zh: `迭代 ${iter}：残差 ${residual.toExponential(3)}`,
          en: `Iter ${iter}: residual ${residual.toExponential(3)}`,
        })
        .setBars(
          x.map((v, i) => ({
            value: v,
            role: i === iter % n ? ('pivot' as BarRole) : ('default' as BarRole),
            label: `x${i}=${v.toFixed(3)}`,
          })),
        )
        .setAux([
          { label: '迭代', value: String(iter), role: 'pivot' as BarRole },
          { label: '残差', value: residual.toExponential(3), role: 'compare' as BarRole },
          { label: 'x', value: x.map((v) => v.toFixed(3)).join(', '), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = sor(A, b, omega, 200, 1e-8, hooks);

  rec
    .begin({
      zh: `完成：${result.converged ? '收敛' : '未收敛'}（${result.iterations} 次迭代）`,
      en: `Done: ${result.converged ? 'converged' : 'NOT converged'} (${result.iterations} iters)`,
    })
    .setBars(
      result.x.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `x${i}=${v.toFixed(3)}`,
      })),
    )
    .setMap([
      {
        key: '解 / solution',
        value: result.x.map((v) => v.toFixed(4)).join(', '),
        role: 'final' as BarRole,
      },
      { key: '迭代次数', value: String(result.iterations), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
