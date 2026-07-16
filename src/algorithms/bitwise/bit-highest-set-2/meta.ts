// 提取最高位1 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-highest-set-2',
  categoryId: 'bitwise',
  title: { zh: '提取最高位1', en: 'Highest Set Bit' },
  summary: {
    zh: '返回仅保留最高位 1 的值（即最大的 2 的幂 ≤ x）。',
    en: 'Keep only the highest set bit (largest power of two ≤ x).',
  },
  description: {
    zh: '用「填充」把最高位以下全置 1，再 (v >> 1) + 1 得到仅含最高位的值。x=0 时返回 0。',
    en: 'Propagate then shift: isolates the MSB. O(1).',
  },
  tags: ['bitwise', 'msb', 'highest-set-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
