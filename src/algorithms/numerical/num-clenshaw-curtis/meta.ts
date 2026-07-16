// Clenshaw-Curtis 求积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-clenshaw-curtis',
  categoryId: 'numerical',
  title: { zh: 'Clenshaw-Curtis 求积', en: 'Clenshaw-Curtis Quadrature' },
  summary: {
    zh: '基于切比雪夫节点的数值积分，权系数可显式计算，谱收敛且节点不重叠。',
    en: 'Numerical integration on Chebyshev nodes with explicit weights; spectral convergence and non-clustered nodes.',
  },
  description: {
    zh: 'Clenshaw-Curtis 求积在 [a,b] 上用 N+1 个切比雪夫节点 x_k = (a+b)/2 + (b-a)/2·cos(kπ/N) (k=0..N)，积分 ∫f dx ≈ Σ w_k·f(x_k)。\n\n权系数 w_k 有显式公式（基于 DCT-I 变换）：\n- N 偶数时：w_k = c_k · Σ_{n=0}^{N/2} (b_n/(1-4n²))·cos(2nkπ/N)\n- c_0 = c_N = 1，其它 c_k = 2\n\n对光滑被积函数谱收敛（误差指数下降）。复杂度 O(N²) 计算 N+1 个权。',
    en: 'Clenshaw-Curtis quadrature on [a,b] uses N+1 Chebyshev nodes x_k=(a+b)/2+(b-a)/2·cos(kπ/N), k=0..N, with explicit weights w_k (via DCT-I transform). Spectral convergence for smooth integrands. Complexity O(N²) to compute N+1 weights.',
  },
  tags: ['numerical', 'quadrature', 'clenshaw-curtis', 'chebyshev', 'integration'],
  complexity: { time: 'O(N²)', space: 'O(N)' },
};
