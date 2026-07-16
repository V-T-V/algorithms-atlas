// MD5 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'md5',
  categoryId: 'crypto',
  title: { zh: 'MD5哈希', en: 'MD5' },
  summary: {
    zh: 'MD5哈希属于crypto类别。',
    en: 'MD5 is a crypto algorithm.',
  },
  description: {
    zh: 'MD5哈希（MD5）属于crypto类别的算法。',
    en: 'MD5 is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
