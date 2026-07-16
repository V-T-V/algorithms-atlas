// Fisher-Yates Shuffle · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fisher-yates',
  categoryId: 'randomized',
  title: { zh: 'Fisher-Yates 洗牌', en: 'Fisher-Yates Shuffle' },
  summary: {
    zh: 'Fisher-Yates 洗牌属于randomized类别。',
    en: 'Fisher-Yates Shuffle is a randomized algorithm.',
  },
  description: {
    zh: 'Fisher-Yates 洗牌（Fisher-Yates Shuffle）属于randomized类别的算法。',
    en: 'Fisher-Yates Shuffle is an algorithm in the randomized category.',
  },
  tags: ["randomized"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
