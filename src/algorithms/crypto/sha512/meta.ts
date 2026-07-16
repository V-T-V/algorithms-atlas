// SHA-512 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sha512',
  categoryId: 'crypto',
  title: { zh: 'SHA-512哈希', en: 'SHA-512' },
  summary: {
    zh: 'SHA-512哈希属于crypto类别。',
    en: 'SHA-512 is a crypto algorithm.',
  },
  description: {
    zh: 'SHA-512哈希（SHA-512）属于crypto类别的算法。',
    en: 'SHA-512 is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
