// =============================================================================
// 雅可比迭代 · 录制帧序列
// 演示解 3×3 严格对角占优方程组，每轮展示解向量与残差。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jacobi, type JacobiHooks } from './impl.ts';

// 严格对角占优方程组，解 x = [1, 2, -1]
export const DEFAULT_INPUT = {
  A: [
    [10, -1, 2],
    [-1, 11, -1],
    [2, -1, 10],
  ],
  b: [6, 25, -11],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { A: number[][]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { A, b } = input;

  rec
    .begin({
      zh: `雅可比迭代解 ${b.length}×${b.length} 方程组（严格对角占优）`,
      en: `Jacobi iteration on a ${b.length}×${b.length} system (strictly diagonally dominant)`,
    })
    .setBars(new Array(b.length).fill(0).map(() => ({ value: 0, role: 'pivot' as BarRole })))
    .setAux([
      {
        label: '公式',
        value: 'x_i^{(k+1)} = (b_i − Σ_{j≠i} A[i][j]·x_j^{(k)}) / A[i][i]',
        role: 'pivot',
      },
    ])
    .commit();

  const hooks: JacobiHooks = {
    onStep: ({ iter, next, residual }) => {
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：x = [${next.map((v) => v.toFixed(5)).join(', ')}]，残差 ‖b−Ax‖∞ = ${residual.toExponential(3)}`,
          en: `Iter ${iter + 1}: x = [${next.map((v) => v.toFixed(5)).join(', ')}], residual ‖b−Ax‖∞ = ${residual.toExponential(3)}`,
        })
        .setBars(next.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .setAux([
          { label: '迭代轮', value: String(iter + 1), role: 'compare' },
          { label: '残差', value: residual.toExponential(4), role: 'warn' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = jacobi(A, b, { tol: 1e-10, maxIter: 100 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得 x ≈ [${result.x.map((v) => v.toFixed(6)).join(', ')}]`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: x ≈ [${result.x.map((v) => v.toFixed(6)).join(', ')}]`
        : `Did not converge`,
    })
    .setBars(result.x.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux(
      result.x.map((v, i) => ({ label: `x_${i}`, value: v.toFixed(8), role: 'final' as BarRole })),
    )
    .commit();

  return rec.build();
}
