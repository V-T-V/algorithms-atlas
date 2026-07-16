// Playfair Cipher · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'playfair',
  categoryId: 'crypto',
  title: { zh: 'Playfair密码', en: 'Playfair Cipher' },
  summary: {
    zh: 'Playfair密码属于crypto类别。',
    en: 'Playfair Cipher is a crypto algorithm.',
  },
  description: {
    zh: 'Playfair密码（Playfair Cipher）属于crypto类别的算法。',
    en: 'Playfair Cipher is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
