// DES (Toy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'des',
  categoryId: 'crypto',
  title: { zh: 'DES玩具版', en: 'DES (Toy)' },
  summary: {
    zh: 'DES玩具版属于crypto类别。',
    en: 'DES (Toy) is a crypto algorithm.',
  },
  description: {
    zh: 'DES玩具版（DES (Toy)）属于crypto类别的算法。',
    en: 'DES (Toy) is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
