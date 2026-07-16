// 翻转位v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-toggle-bit-2',
  categoryId: 'bitwise',
  title: { zh: '翻转位v2', en: 'Toggle Bit v2' },
  summary: { zh: '翻转第 i 位：x ^ (1 << i)。', en: 'Toggle bit i: x ^ (1 << i).' },
  description: {
    zh: '异或 (1<<i) 翻转第 i 位：0 变 1，1 变 0。',
    en: 'XOR with (1<<i) flips bit i. O(1).',
  },
  tags: ['bitwise', 'toggle', 'xor'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
