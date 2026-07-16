// Diffie-Hellman · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'diffie-hellman',
  categoryId: 'crypto',
  title: { zh: 'DH密钥交换', en: 'Diffie-Hellman' },
  summary: {
    zh: 'DH密钥交换属于crypto类别。',
    en: 'Diffie-Hellman is a crypto algorithm.',
  },
  description: {
    zh: 'DH密钥交换（Diffie-Hellman）属于crypto类别的算法。',
    en: 'Diffie-Hellman is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(log e) per mod-exp', space: 'O(1)' },
};
