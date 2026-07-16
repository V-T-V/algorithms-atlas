// 三次样条插值（自然边界）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-cubic-spline',
  categoryId: 'numerical',
  title: { zh: '三次样条插值（自然）', en: 'Cubic Spline Interpolation (Natural)' },
  summary: {
    zh: '在 n+1 个节点上构造分段三次多项式，自然边界（二阶导=0），二阶导连续。',
    en: 'Piecewise cubic polynomials on n+1 nodes with natural boundary (2nd derivative zero); C² continuous.',
  },
  description: {
    zh: '三次样条插值：在每个区间 [x_i, x_{i+1}] 上构造三次多项式 S_i(x)，整体 C² 连续（函数、一阶、二阶导数都连续）。\n\n对自然边界（端点二阶导 = 0），二阶导数 M_i 满足三对角方程组：h_{i-1} M_{i-1} + 2(h_{i-1}+h_i) M_i + h_i M_{i+1} = 6[(y_{i+1}-y_i)/h_i - (y_i-y_{i-1})/h_{i-1}]。\n边界 M_0 = M_n = 0。用追赶法（Thomas）解 O(n)。\n\n每段：S_i(x) = M_i (x_{i+1}-x)³/(6h_i) + M_{i+1}(x-x_i)³/(6h_i) + [y_i/h_i - M_i h_i/6](x_{i+1}-x) + [y_{i+1}/h_i - M_{i+1}h_i/6](x-x_i)\n\n复杂度 O(n)。',
    en: 'Cubic spline: build a cubic per interval [x_i,x_{i+1}], globally C² continuous. Natural boundary: second derivatives at endpoints are zero. The M_i (second derivatives) satisfy a tridiagonal system solved by Thomas algorithm in O(n). Each segment is built from M_i, M_{i+1}, y_i, y_{i+1}, h_i. Complexity O(n).',
  },
  tags: ['numerical', 'interpolation', 'spline', 'cubic', 'piecewise'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
