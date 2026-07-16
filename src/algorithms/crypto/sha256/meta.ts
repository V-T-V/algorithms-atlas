// SHA-256 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sha256',
  categoryId: 'crypto',
  title: { zh: 'SHA-256', en: 'SHA-256' },
  summary: {
    zh: 'SHA-256属于crypto类别。',
    en: 'SHA-256 is a crypto algorithm.',
  },
  description: {
    zh: 'SHA-256（SHA-256）属于crypto类别的算法。',
    en: 'SHA-256 is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
