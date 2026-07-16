// Caesar Cipher · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'caesar-cipher',
  categoryId: 'crypto',
  title: { zh: '凯撒密码', en: 'Caesar Cipher' },
  summary: {
    zh: '凯撒密码属于crypto类别。',
    en: 'Caesar Cipher is a crypto algorithm.',
  },
  description: {
    zh: '凯撒密码（Caesar Cipher）属于crypto类别的算法。',
    en: 'Caesar Cipher is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
