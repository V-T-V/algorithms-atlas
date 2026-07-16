// Shampoo 优化器（Shampoo Optimizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-shampoo',
  categoryId: 'optimization',
  title: { zh: 'Shampoo 优化器', en: 'Shampoo Optimizer' },
  summary: {
    zh: '为矩阵参数维护左右预条件统计，二阶信息近似。',
    en: 'Maintains left/right preconditioner statistics for matrix parameters; 2nd-order-like.',
  },
  description: {
    zh: 'Shampoo：对矩阵参数 W，维护 L=G^TG 和 R=GG^T 的指数移动平均，更新 W←W-lr·L^{-1/4} G R^{-1/4}。',
    en: 'Shampoo: for matrix W keep EMA of L=G^TG and R=GG^T; update W<-W-lr·L^{-1/4}GR^{-1/4}.',
  },
  tags: ['optimization', 'preconditioned', 'matrix'],
  complexity: { time: 'O(k·mn)', space: 'O(m²+n²)' },
};
