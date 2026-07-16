// AES (Toy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aes',
  categoryId: 'crypto',
  title: { zh: 'AES玩具版', en: 'AES (Toy)' },
  summary: {
    zh: 'AES玩具版属于crypto类别。',
    en: 'AES (Toy) is a crypto algorithm.',
  },
  description: {
    zh: 'AES玩具版（AES (Toy)）属于crypto类别的算法。',
    en: 'AES (Toy) is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
