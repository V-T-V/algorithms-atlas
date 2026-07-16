// 批量梯度下降（变种：动量 + 梯度裁剪）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-gradient-batch-2',
  categoryId: 'optimization',
  title: { zh: '批量梯度下降（动量+裁剪）', en: 'Batch Gradient Descent (Momentum + Clipping)' },
  summary: {
    zh: '在批量梯度下降上叠加动量加速与梯度范数裁剪，提升稳定性。',
    en: 'Augment batch gradient descent with momentum and gradient-norm clipping for stability.',
  },
  description: {
    zh: '本变体在标准批量梯度下降之上叠加两项工程技巧：(1) 动量（heavy-ball）—— 维护一个指数滑动平均的梯度方向 v，每步用 v 而非瞬时梯度更新，能加速通过平缓区域、抑制震荡；(2) 梯度裁剪 —— 当梯度范数超过阈值时按比例缩放，避免爆炸。演示问题：对一组样本 (x_i, y_i) 拟合 y = w·x + b，最小化 MSE。与纯批量 GD 相比，动量在病态曲率下收敛更快。',
    en: 'This variant adds two engineering tricks atop vanilla batch gradient descent: (1) momentum (heavy-ball) — maintain an exponentially-averaged direction v and step with v instead of the instantaneous gradient, accelerating through flat regions and dampening oscillation; (2) gradient clipping — rescale when the gradient norm exceeds a threshold to avoid blow-up. Demo: fit y = w·x + b on samples by minimizing MSE. Versus plain batch GD, momentum converges faster on ill-conditioned curvature.',
  },
  tags: ['optimization', 'gradient-descent', 'momentum', 'first-order'],
  complexity: { time: 'O(k·n·d)', space: 'O(d)' },
};
