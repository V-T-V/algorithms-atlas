// Gauss-Legendre 求积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-gauss-legendre',
  categoryId: 'numerical',
  title: { zh: 'Gauss-Legendre 求积', en: 'Gauss-Legendre Quadrature' },
  summary: {
    zh: '基于 Legendre 多项式根的高斯求积，2n 点积分对 2n-1 次多项式精确。',
    en: 'Gaussian quadrature on the roots of Legendre polynomials; a 2n-point rule is exact for polynomials up to degree 2n-1.',
  },
  description: {
    zh: "Gauss-Legendre 求积在 [-1,1] 上用 Legendre 多项式 P_n 的 n 个根 x_k 作为节点，权 w_k 由\n```\nw_k = 2(1-x_k²)^{-1} · [P'_n(x_k)]^{-2}\n```\n给出。一般区间 [a,b] 通过线性变换 x = (b-a)/2·t + (a+b)/2 映射到 [-1,1]。\n\n本实现用牛顿迭代求根，伴随矩阵特征值法或 Newton-Raphson 求根。最高代数精度（2n-1）。复杂度求权 O(n²)，积分 O(n)。",
    en: "Gauss-Legendre quadrature on [-1,1] uses the n roots x_k of Legendre polynomial P_n as nodes; weights w_k = 2(1-x_k²)^{-1}·[P'_n(x_k)]^{-2}. Map general [a,b] via x=(b-a)/2·t+(a+b)/2. Roots found by Newton iteration. Maximal algebraic degree of exactness (2n-1). Computing weights O(n²); integration O(n).",
  },
  tags: ['numerical', 'quadrature', 'gaussian', 'legendre', 'integration'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
