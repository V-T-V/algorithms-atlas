// SHA-1 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sha1',
  categoryId: 'crypto',
  title: { zh: 'SHA-1哈希', en: 'SHA-1' },
  summary: {
    zh: 'SHA-1哈希属于crypto类别。',
    en: 'SHA-1 is a crypto algorithm.',
  },
  description: {
    zh: 'SHA-1哈希（SHA-1）属于crypto类别的算法。',
    en: 'SHA-1 is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
