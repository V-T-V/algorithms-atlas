// 信赖域 CG（Trust Region Conjugate Gradient）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-trust-region-cg',
  categoryId: 'optimization',
  title: { zh: '信赖域 CG', en: 'Trust Region Conjugate Gradient' },
  summary: {
    zh: '在信赖域内用共轭梯度解二次模型，自动调节步长。',
    en: 'Solve the quadratic model with CG inside a trust region; auto-adjusts step length.',
  },
  description: {
    zh: '信赖域 Steihaug-CG：在半径 Δ 内用 CG 迭代解 Bp=-g，遇边界则截断，根据实际/预测下降调节 Δ。',
    en: 'Trust region Steihaug-CG: CG solves Bp=-g within radius Δ; truncate at boundary; adjust Δ by actual/predicted.',
  },
  tags: ['optimization', 'trust-region'],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
