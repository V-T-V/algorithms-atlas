// Broyden 拟牛顿 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-broyden',
  categoryId: 'optimization',
  title: { zh: 'Broyden 方法（非线性方程组）', en: 'Broyden Method (Nonlinear Systems)' },
  summary: {
    zh: '牛顿法解 F(x)=0 的拟牛顿推广：用秩一更新近似雅可比逆，避免每步重算。',
    en: 'Quasi-Newton extension of Newton method for F(x)=0: rank-one update of the inverse-Jacobian, avoiding refactorization each step.',
  },
  description: {
    zh: 'Broyden 方法是牛顿法在非线性方程组 F(x)=0 上的拟牛顿推广。牛顿法每步需求雅可比 J(x) 并解线性方程 J·Δx = −F，开销 O(n³)；Broyden 维护雅可比逆的近似 B≈J⁻¹，每步用秩一公式 B ← B + (s − B·F)·sᵀ·B / (sᵀ·B·F) 更新，其中 s=x_new−x。这样每步只需 O(n²) 矩阵-向量乘。收敛从牛顿的二次降为超线性，但每步便宜得多，是求解大维非线性方程组的标准工具（也用于寻根、平衡点计算）。',
    en: 'Broyden method is the quasi-Newton extension of Newton method for nonlinear systems F(x)=0. Newton must factorize the Jacobian J(x) each step to solve J·Δx = −F at O(n³); Broyden maintains an approximate inverse Jacobian B≈J⁻¹ and updates it with the rank-one formula B ← B + (s − B·F)·sᵀ·B / (sᵀ·B·F) where s=x_new−x. Each step then costs only O(n²) for matrix-vector products. Convergence drops from quadratic to superlinear but each step is far cheaper, making Broyden standard for large nonlinear systems (root-finding, fixed-point computation).',
  },
  tags: ['optimization', 'broyden', 'nonlinear', 'root-finding'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
