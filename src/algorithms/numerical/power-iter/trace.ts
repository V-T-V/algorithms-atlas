// =============================================================================
// 幂迭代求特征值 · 录制帧序列
// 演示求 2×2 对称矩阵的占优特征值与特征向量。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { powerIter, type PowerIterHooks } from './impl.ts';

// A = [[2,1],[1,2]]，特征值 3（向量 [1,1]/√2）与 1（向量 [1,-1]/√2）
export const DEFAULT_INPUT = {
  A: [
    [2, 1],
    [1, 2],
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { A: number[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { A } = input;
  const n = A.length;
  // 固定初值以保证可复现
  const v0 = new Array(n).fill(0).map((_, i) => (i === 0 ? 1 : 0.5));

  rec
    .begin({
      zh: `幂迭代求 ${n}×${n} 矩阵的占优特征值`,
      en: `Power iteration: dominant eigenvalue of a ${n}×${n} matrix`,
    })
    .setBars(v0.map((v) => ({ value: v, role: 'pivot' as BarRole })))
    .setAux([{ label: '迭代', value: 'v ← A·v / ‖A·v‖，λ ← vᵀ A v', role: 'pivot' }])
    .commit();

  const hooks: PowerIterHooks = {
    onStep: ({ iter, eigenvalue, vector }) => {
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：λ ≈ ${eigenvalue.toFixed(8)}，v ≈ [${vector.map((x) => x.toFixed(5)).join(', ')}]`,
          en: `Iter ${iter + 1}: λ ≈ ${eigenvalue.toFixed(8)}, v ≈ [${vector.map((x) => x.toFixed(5)).join(', ')}]`,
        })
        .setBars(vector.map((x) => ({ value: x, role: 'frontier' as BarRole })))
        .setAux([
          { label: '特征值 λ', value: eigenvalue.toFixed(10), role: 'frontier' },
          {
            label: '向量范数',
            value: Math.sqrt(vector.reduce((s, x) => s + x * x, 0)).toFixed(6),
            role: 'compare',
          },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = powerIter(A, { v0, tol: 1e-12, maxIter: 200 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得 λ ≈ ${result.eigenvalue}，v ≈ [${result.vector.map((x) => x.toFixed(6)).join(', ')}]`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: λ ≈ ${result.eigenvalue}`
        : `Did not converge`,
    })
    .setBars(result.vector.map((x) => ({ value: x, role: 'final' as BarRole })))
    .setAux([
      { label: '占优特征值', value: result.eigenvalue.toFixed(10), role: 'final' },
      { label: '迭代轮数', value: String(result.iterations), role: 'final' },
      { label: '是否收敛', value: result.converged ? '是 yes' : '否 no', role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
