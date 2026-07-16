// 置位v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-set-bit-2',
  categoryId: 'bitwise',
  title: { zh: '置位v2', en: 'Set Bit v2' },
  summary: { zh: '把第 i 位置 1：x | (1 << i)。', en: 'Set bit i: x | (1 << i).' },
  description: { zh: '用按位或把第 i 位置 1。i ∈ [0,31]。', en: 'OR with (1<<i). O(1).' },
  tags: ['bitwise', 'set-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
