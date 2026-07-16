// DFP 矩阵更新 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-dfp',
  categoryId: 'optimization',
  title: { zh: 'DFP 拟牛顿法', en: 'DFP Quasi-Newton' },
  summary: {
    zh: '最早提出的拟牛顿法：用秩二更新递推海森逆近似，超线性收敛。',
    en: 'The original quasi-Newton method: rank-two update of the inverse-Hessian approximation, superlinear convergence.',
  },
  description: {
    zh: 'DFP（Davidon–Fletcher–Powell）是历史上第一个拟牛顿法，比 BFGS 早。它同样维护海森逆的近似 H，并用一对 (s,y)=(x_new−x, g_new−g) 做秩二更新：H ← H − (H·y·yᵀ·H)/(yᵀ·H·y) + (s·sᵀ)/(yᵀ·s)。DFP 与 BFGS 互为对偶（一个更新 H、另一个更新 B）。理论上 DFP 在二次问题上超线性收敛，但对线搜索精度更敏感，实践中通常不如 BFGS 稳健，故渐被 BFGS 取代。本实现演示其更新过程。',
    en: 'DFP (Davidon–Fletcher–Powell) is the historically first quasi-Newton method, predating BFGS. It also maintains the inverse-Hessian approximation H and performs a rank-two update with the pair (s,y)=(x_new−x, g_new−g): H ← H − (H·y·yᵀ·H)/(yᵀ·H·y) + (s·sᵀ)/(yᵀ·s). DFP and BFGS are duals (one updates H, the other B). DFP is superlinearly convergent on quadratics but more sensitive to line-search accuracy and usually less robust than BFGS in practice, hence BFGS took over. This implementation demonstrates the update process.',
  },
  tags: ['optimization', 'quasi-newton', 'dfp', 'second-order'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
