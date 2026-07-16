// 带位移的幂法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'power-method-shift',
  categoryId: 'numerical',
  title: { zh: '带位移的幂法', en: 'Power Method with Shift' },
  summary: {
    zh: '幂法 + 谱位移，加速收敛并避开符号问题。',
    en: 'Power iteration with spectral shift; accelerates convergence and resolves sign issues.',
  },
  description: {
    zh: '幂法反复做 v ← A v 并归一化，收敛到最大模特征对。带位移版本改为 v ← (A - σI) v：通过选合适的 σ 把目标特征值搬到「相对最大」的位置，从而加速收敛（收敛率 = |λ₂/λ₁| 改进）并找到非最大模的特征值。最终 λ = σ + Rayleigh 商。',
    en: 'The power method repeatedly computes v ← A v and normalizes, converging to the dominant eigenpair. The shifted version instead uses v ← (A - σI) v: a well-chosen σ moves the target eigenvalue into the relatively-dominant position, speeding convergence (rate |λ₂/λ₁| improves) and reaching non-dominant eigenvalues. Final λ = σ + Rayleigh quotient.',
  },
  tags: ['numerical', 'linear-algebra', 'eigenvalue', 'iterative'],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
