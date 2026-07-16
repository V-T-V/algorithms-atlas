// 序列二次规划（Sequential Quadratic Programming）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-sqp',
  categoryId: 'optimization',
  title: { zh: '序列二次规划', en: 'Sequential Quadratic Programming' },
  summary: {
    zh: '每步解一个 QP 子问题近似原约束问题，收敛快。',
    en: 'Each step solves a QP subproblem approximating the constrained problem; fast convergence.',
  },
  description: {
    zh: 'SQP：在第 k 点构造 QP 子问题 min ½d^TBd+g^Td s.t. 约束线性化，解 d 更新 x。',
    en: 'SQP: at point k build QP subproblem min ½d^TBd+g^Td s.t. linearized constraints; solve d, update x.',
  },
  tags: ['optimization', 'constrained', 'nonlinear'],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};
