// Vigenère Cipher · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'vigenere',
  categoryId: 'crypto',
  title: { zh: '维吉尼亚密码', en: 'Vigenère Cipher' },
  summary: {
    zh: '维吉尼亚密码属于crypto类别。',
    en: 'Vigenère Cipher is a crypto algorithm.',
  },
  description: {
    zh: '维吉尼亚密码（Vigenère Cipher）属于crypto类别的算法。',
    en: 'Vigenère Cipher is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
