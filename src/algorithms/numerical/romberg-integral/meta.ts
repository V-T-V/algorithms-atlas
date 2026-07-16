// 龙贝格积分 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'romberg-integral',
  categoryId: 'numerical',
  title: { zh: '龙贝格积分 (Romberg)', en: 'Romberg Integration' },
  summary: {
    zh: '梯形序列 + Richardson 外推，高精度数值积分。',
    en: 'Trapezoid sequence + Richardson extrapolation; high-accuracy quadrature.',
  },
  description: {
    zh: '龙贝格积分把梯形法的逐步细化结果（步长 h, h/2, h/4 …）按 Richardson 外推组合：R[i][j] = R[i][j-1] + (R[i][j-1] - R[i-1][j-1]) / (4^j - 1)，每次外推提高两阶精度。最终 R[n][n] 收敛极快，光滑被积函数只用很少次函数求值就可达高精度。',
    en: 'Romberg integration combines the progressively refined trapezoid estimates (steps h, h/2, h/4 …) via Richardson extrapolation: R[i][j] = R[i][j-1] + (R[i][j-1] - R[i-1][j-1]) / (4^j - 1), each extrapolation raising the order by two. The final R[n][n] converges very fast — smooth integrands reach high accuracy with few function evaluations.',
  },
  tags: ['numerical', 'integration', 'extrapolation'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
