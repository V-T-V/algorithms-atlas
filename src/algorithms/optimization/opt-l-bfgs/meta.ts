// L-BFGS 有限内存拟牛顿 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-l-bfgs',
  categoryId: 'optimization',
  title: { zh: 'L-BFGS 有限内存', en: 'L-BFGS (Limited-memory)' },
  summary: {
    zh: '只保留最近 m 对 (s,y)，用两循环递归近似 H·g，超线性收敛且 O(md) 内存。',
    en: 'Keep only the last m (s,y) pairs; two-loop recursion approximates H·g with O(md) memory and superlinear convergence.',
  },
  description: {
    zh: 'L-BFGS（Limited-memory BFGS）是 BFGS 的内存友好版本，专为高维优化设计。BFGS 显式存储 n×n 的海森逆近似 H，对大 n 不可行；L-BFGS 只保存最近 m（如 10）对位移差 s_k = x_{k+1}−x_k 与梯度差 y_k = g_{k+1}−g_k，用「两循环递归」隐式计算 H·g，每步仅 O(md) 时间与 O(md) 内存，却仍保留 BFGS 的超线性收敛。它是大规模连续优化（深度学习之前的黄金标准）的事实默认算法。本实现配合回溯线搜索（Armijo 条件）。',
    en: 'L-BFGS (Limited-memory BFGS) is the memory-friendly variant of BFGS for high-dimensional problems. BFGS stores the full n×n inverse-Hessian H, infeasible for large n; L-BFGS keeps only the last m (e.g. 10) curvature pairs s_k = x_{k+1}−x_k and y_k = g_{k+1}−g_k, and a "two-loop recursion" implicitly computes H·g in O(md) time and memory while retaining superlinear convergence. It is the de-facto default for large-scale continuous optimization (the pre-DL gold standard). This implementation pairs with backtracking line search (Armijo condition).',
  },
  tags: ['optimization', 'quasi-newton', 'l-bfgs', 'first-order'],
  complexity: { time: 'O(k·m·d)', space: 'O(m·d)' },
};
