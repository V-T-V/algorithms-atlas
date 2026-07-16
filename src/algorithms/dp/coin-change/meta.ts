// Coin Change · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'coin-change',
  categoryId: 'dp',
  title: { zh: '零钱兑换', en: 'Coin Change' },
  summary: {
    zh: '零钱兑换属于dp类别。',
    en: 'Coin Change is a dp algorithm.',
  },
  description: {
    zh: '零钱兑换（Coin Change）属于dp类别的算法。',
    en: 'Coin Change is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(amount·n)', space: 'O(amount)' },
};
