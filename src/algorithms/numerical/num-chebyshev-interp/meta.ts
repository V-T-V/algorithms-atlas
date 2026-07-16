// 切比雪夫插值 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-chebyshev-interp',
  categoryId: 'numerical',
  title: { zh: '切比雪夫插值', en: 'Chebyshev Interpolation' },
  summary: {
    zh: '在第二类切比雪夫节点上构造多项式插值，避免龙格现象，近极小极大逼近。',
    en: 'Polynomial interpolation at Chebyshev nodes of the second kind; avoids Runge phenomenon and is near-minimax.',
  },
  description: {
    zh: '切比雪夫插值：在 n+1 个第二类切比雪夫节点 x_k = cos(kπ/n) (k=0..n) 上插值函数 f，得到 n 次多项式 p_n(x) ≈ f(x)。\n\n步骤：\n1. 计算节点 x_k = cos(kπ/n)\n2. 求函数值 y_k = f(x_k)\n3. 用 barycentric 公式快速求值：p(x) = Σ [w_k y_k / (x - x_k)] / Σ [w_k / (x - x_k)]\n第二类节点的重心权 w_k = c_k (-1)^k / 2，c_0 = c_n = 1，其余 c_k = 2（除以 n）\n\n相比等距插值，无龙格现象；误差与极小极大逼近接近（√2 倍）。复杂度构造 O(n)，求值 O(n)。',
    en: 'Chebyshev interpolation: interpolate f at n+1 Chebyshev nodes of the 2nd kind x_k=cos(kπ/n), giving a degree-n polynomial. Compute nodes x_k, values y_k=f(x_k), then evaluate via barycentric form p(x)=Σ[w_k y_k/(x-x_k)] / Σ[w_k/(x-x_k)] with weights w_k = c_k(-1)^k/2 / n. No Runge phenomenon; near-minimax. Construction O(n), evaluation O(n).',
  },
  tags: ['numerical', 'interpolation', 'chebyshev', 'barycentric', 'polynomial'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
