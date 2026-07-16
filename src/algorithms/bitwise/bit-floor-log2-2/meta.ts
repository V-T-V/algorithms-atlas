// floor log2 填充法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-floor-log2-2',
  categoryId: 'bitwise',
  title: { zh: 'floor log2 填充法', en: 'Floor Log2 by Fill' },
  summary: {
    zh: '用位填充后取位数得 floor(log2(x))。',
    en: 'floor(log2 x) via bit-fill then position.',
  },
  description: {
    zh: '把最高位以下全填 1 得到 allones，再 popcount(allones) - 1 = log2。',
    en: 'Fill to all-ones then popcount - 1. O(1).',
  },
  tags: ['bitwise', 'log2'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
