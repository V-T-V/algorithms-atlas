// 清除最低位1 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-clear-lowest-2',
  categoryId: 'bitwise',
  title: { zh: '清除最低位1', en: 'Clear Lowest Set Bit' },
  summary: { zh: '用 x & (x-1) 清除最低位的 1。', en: 'Clear the lowest set bit with x & (x-1).' },
  description: {
    zh: 'x-1 把最低位 1 变 0、其后 0 全变 1，相与即清除最低位 1。常用于 Brian Kernighan 计数法。',
    en: 'x & (x-1) clears the lowest set bit. O(1) per op.',
  },
  tags: ['bitwise', 'lowest-set-bit', 'kernighan'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
