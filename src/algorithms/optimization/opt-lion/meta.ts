// Lion 优化器（Lion Optimizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-lion',
  categoryId: 'optimization',
  title: { zh: 'Lion 优化器', en: 'Lion Optimizer' },
  summary: {
    zh: '符号动量优化器，内存比 Adam 少一半，性能相当。',
    en: 'Sign-momentum optimizer using half the memory of Adam with comparable performance.',
  },
  description: {
    zh: 'Lion：u=sign(β1·m+(1-β1)·g)；x←x-lr·u；m←β2·m+(1-β2)·g。只用一阶动量。',
    en: 'Lion: u=sign(β1·m+(1-β1)·g); x<-x-lr·u; m<-β2·m+(1-β2)·g. Single first moment.',
  },
  tags: ['optimization', 'adaptive', 'machine-learning'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
