// AES S-Box · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aes-sbox',
  categoryId: 'crypto',
  title: { zh: 'AES S盒', en: 'AES S-Box' },
  summary: {
    zh: 'AES S盒属于crypto类别。',
    en: 'AES S-Box is a crypto algorithm.',
  },
  description: {
    zh: 'AES S盒（AES S-Box）属于crypto类别的算法。',
    en: 'AES S-Box is an algorithm in the crypto category.',
  },
  tags: ["crypto","cryptography"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
