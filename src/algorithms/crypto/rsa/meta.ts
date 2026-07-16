// RSA (Toy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rsa',
  categoryId: 'crypto',
  title: { zh: 'RSA（玩具版）', en: 'RSA (Toy)' },
  summary: {
    zh: 'RSA（玩具版）属于crypto类别。',
    en: 'RSA (Toy) is a crypto algorithm.',
  },
  description: {
    zh: 'RSA（玩具版）（RSA (Toy)）属于crypto类别的算法。',
    en: 'RSA (Toy) is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(log e · log²n)', space: 'O(1)' },
};
