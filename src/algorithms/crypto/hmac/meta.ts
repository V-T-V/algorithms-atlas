// HMAC · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hmac',
  categoryId: 'crypto',
  title: { zh: 'HMAC消息认证', en: 'HMAC' },
  summary: {
    zh: 'HMAC消息认证属于crypto类别。',
    en: 'HMAC is a crypto algorithm.',
  },
  description: {
    zh: 'HMAC消息认证（HMAC）属于crypto类别的算法。',
    en: 'HMAC is an algorithm in the crypto category.',
  },
  tags: ["crypto"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
