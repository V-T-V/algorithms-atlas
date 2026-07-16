// Gauss-Hermite 求积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-gauss-hermite',
  categoryId: 'numerical',
  title: { zh: 'Gauss-Hermite 求积', en: 'Gauss-Hermite Quadrature' },
  summary: {
    zh: '在 (-∞,+∞) 上对带权重 e^{-x²} 的积分 ∫f(x)e^{-x²}dx 进行高斯求积。',
    en: 'Gaussian quadrature for ∫f(x)e^{-x²}dx over (-∞,+∞), using Hermite polynomial roots.',
  },
  description: {
    zh: 'Gauss-Hermite 求积用于无穷区间加权积分：∫_{-∞}^{+∞} f(x) e^{-x²} dx ≈ Σ_{k=1}^{n} w_k · f(x_k)。\nx_k 是物理学家型 Hermite 多项式 H_n(x) 的根，权 w_k = 2^{n-1} n! √π / (n² · [H_{n-1}(x_k)]²)。\n\n应用：量子谐振子、统计力学中的高斯加权期望、概率（标准正态矩）。\n\n物理学家型 H_n 递推：H_0=1, H_1=2x, H_{n+1}=2xH_n - 2n H_{n-1}。\n\n复杂度求权 O(n²)。',
    en: 'Gauss-Hermite quadrature for weighted integrals on (-∞,+∞): ∫f(x)e^{-x²}dx ≈ Σ w_k f(x_k), where x_k are roots of the physicists Hermite polynomial H_n and w_k = 2^{n-1} n! √π / (n² [H_{n-1}(x_k)]²). Applications: quantum harmonic oscillator, statistical mechanics, Gaussian-weighted moments. Recurrence H_0=1, H_1=2x, H_{n+1}=2x H_n - 2n H_{n-1}. Complexity O(n²).',
  },
  tags: ['numerical', 'quadrature', 'gaussian', 'hermite', 'integration'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
