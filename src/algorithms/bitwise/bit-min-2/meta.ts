// 掩码求最小 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-min-2',
  categoryId: 'bitwise',
  title: { zh: '掩码求最小', en: 'Branchless Min' },
  summary: { zh: '用符号掩码无分支求两数最小值。', en: 'Branchless min via the sign mask.' },
  description: {
    zh: '对 a,b：diff = a - b；mask = diff >> 31（a<b 时全1，否则全0）。min = b + (diff & mask)，即 a<b 时回退到 a。',
    en: 'diff = a-b; mask = diff>>31; min = b + (diff & mask). O(1).',
  },
  tags: ['bitwise', 'min', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
