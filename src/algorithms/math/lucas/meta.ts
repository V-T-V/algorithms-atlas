// Lucas Theorem · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lucas',
  categoryId: 'math',
  title: { zh: '卢卡斯定理', en: 'Lucas Theorem' },
  summary: {
    zh: '卢卡斯定理属于math类别。',
    en: 'Lucas Theorem is a math algorithm.',
  },
  description: {
    zh: '卢卡斯定理（Lucas Theorem）属于math类别的算法。',
    en: 'Lucas Theorem is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(p + log_p n)', space: 'O(p)' },
};
