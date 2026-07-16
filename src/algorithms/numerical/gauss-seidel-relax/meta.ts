// 松弛 Gauss-Seidel · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gauss-seidel-relax',
  categoryId: 'numerical',
  title: { zh: '松弛 Gauss-Seidel', en: 'Relaxed Gauss-Seidel (SOR)' },
  summary: {
    zh: '逐次超松弛：ω∈(0,2) 加速 Gauss-Seidel 收敛。',
    en: 'Successive over-relaxation: ω∈(0,2) accelerates Gauss-Seidel convergence.',
  },
  description: {
    zh: 'SOR（Successive Over-Relaxation）在 Gauss-Seidel 的基础上引入松弛因子 ω：每步新值 = 旧值 + ω·(Gauss-Seidel 校正)。ω=1 退化为标准 Gauss-Seidel；ω>1 超松弛加速收敛；ω<1 欠松弛稳定发散系统。最佳 ω* 与谱半径相关，常用于大型稀疏线性方程组。',
    en: 'SOR (Successive Over-Relaxation) adds a relaxation factor ω to Gauss-Seidel: new = old + ω·(Gauss-Seidel correction). ω=1 recovers standard Gauss-Seidel; ω>1 over-relaxes to speed convergence; ω<1 under-relaxes to stabilize divergent systems. The optimal ω* relates to the spectral radius; SOR is widely used for large sparse linear systems.',
  },
  tags: ['numerical', 'linear-algebra', 'iterative'],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
