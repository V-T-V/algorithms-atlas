// Neural Net (Toy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'neural-net',
  categoryId: 'ml',
  title: { zh: '神经网络玩具版', en: 'Neural Net (Toy)' },
  summary: {
    zh: '神经网络玩具版属于ml类别。',
    en: 'Neural Net (Toy) is a ml algorithm.',
  },
  description: {
    zh: '神经网络玩具版（Neural Net (Toy)）属于ml类别的算法。',
    en: 'Neural Net (Toy) is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
