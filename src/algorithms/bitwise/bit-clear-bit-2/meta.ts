// 清位v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-clear-bit-2',
  categoryId: 'bitwise',
  title: { zh: '清位v2', en: 'Clear Bit v2' },
  summary: { zh: '把第 i 位清 0：x & ~(1 << i)。', en: 'Clear bit i: x & ~(1 << i).' },
  description: { zh: '用按位与掩码的反码清掉第 i 位。', en: 'AND with ~(1<<i). O(1).' },
  tags: ['bitwise', 'clear-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
