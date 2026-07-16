// 末尾连续1 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-trailing-ones-2',
  categoryId: 'bitwise',
  title: { zh: '末尾连续1', en: 'Count Trailing Ones' },
  summary: {
    zh: '统计最低位起连续 1 的个数。',
    en: 'Count contiguous 1 bits starting from the LSB.',
  },
  description: { zh: 'cto = ctz(~x)。即翻转后数末尾 0。', en: 'cto(x) = ctz(~x). O(1).' },
  tags: ['bitwise', 'trailing-ones', 'ctz'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
