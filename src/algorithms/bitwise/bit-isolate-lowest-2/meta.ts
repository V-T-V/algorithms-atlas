// 提取最低位1 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-isolate-lowest-2',
  categoryId: 'bitwise',
  title: { zh: '提取最低位1', en: 'Isolate Lowest Set Bit' },
  summary: { zh: '用 x & -x 提取最低位的 1。', en: 'Isolate the lowest set bit with x & -x.' },
  description: {
    zh: '-x = ~x + 1，只保留最低位的 1。可用于 Fenwick 树的 lowbit、判断 2 的幂等。',
    en: 'x & -x keeps only the lowest set bit (Fenwick lowbit). O(1).',
  },
  tags: ['bitwise', 'lowest-set-bit', 'fenwick'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
