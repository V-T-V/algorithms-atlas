// RC4 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rc4',
  categoryId: 'crypto',
  title: { zh: 'RC4流密码', en: 'RC4' },
  summary: {
    zh: 'RC4流密码属于crypto类别。',
    en: 'RC4 is a crypto algorithm.',
  },
  description: {
    zh: 'RC4流密码（RC4）属于crypto类别的算法。',
    en: 'RC4 is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(256)' },
};
