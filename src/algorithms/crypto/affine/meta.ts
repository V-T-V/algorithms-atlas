// Affine Cipher · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'affine',
  categoryId: 'crypto',
  title: { zh: '仿射密码', en: 'Affine Cipher' },
  summary: {
    zh: '仿射密码属于crypto类别。',
    en: 'Affine Cipher is a crypto algorithm.',
  },
  description: {
    zh: '仿射密码（Affine Cipher）属于crypto类别的算法。',
    en: 'Affine Cipher is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
