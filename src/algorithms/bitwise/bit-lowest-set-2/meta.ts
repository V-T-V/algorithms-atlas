// 提取最低位1v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-lowest-set-2',
  categoryId: 'bitwise',
  title: { zh: '提取最低位1v2', en: 'Lowest Set Bit v2' },
  summary: { zh: '返回仅保留最低位 1 的值，x & -x。', en: 'Isolate the lowest set bit: x & -x.' },
  description: {
    zh: '-x = ~x+1，只保留最低位的 1。x=0 返回 0。',
    en: 'x & -x returns the lowest set bit value. O(1).',
  },
  tags: ['bitwise', 'lsb', 'lowest-set-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
