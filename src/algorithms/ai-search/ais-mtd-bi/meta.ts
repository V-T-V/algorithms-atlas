// MTD(bi)（MTD(bi)）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-mtd-bi',
  categoryId: 'ai-search',
  title: { zh: 'MTD(bi)', en: 'MTD(bi)' },
  summary: {
    zh: 'MTD(bi)：交替使用上下界驱动零窗口测试。',
    en: 'MTD(bi): alternate upper/lower bounds to drive zero-window tests.',
  },
  description: {
    zh: 'MTD(bi) 是 MTD(f) 的双向变体：每次根据上一次返回的界选择 beta = upper 或 lower + 1，进行零窗口测试，直至 lower == upper 收敛。',
    en: 'MTD(bi) is a bidirectional MTD(f) variant: each iteration picks beta = upper or lower + 1 based on the previous bound, doing zero-window tests until lower == upper.',
  },
  tags: ['ai-search', 'mtd', 'zero-window', 'game-tree'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
};
