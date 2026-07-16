// 汉明距离v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-count-diff-2',
  categoryId: 'bitwise',
  title: { zh: '汉明距离v2', en: 'Hamming Distance v2' },
  summary: {
    zh: '统计两整数二进制不同位的个数。',
    en: 'Count differing bit positions of two integers.',
  },
  description: { zh: 'diff = a ^ b，再对 diff 做 popcount。', en: 'popcount of a XOR b. O(1).' },
  tags: ['bitwise', 'hamming', 'distance'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
